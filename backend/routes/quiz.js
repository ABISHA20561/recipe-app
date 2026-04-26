const router = require("express").Router();
const axios  = require("axios");
const auth   = require("../middleware/auth");
const User   = require("../models/User");

const MODEL_API    = () => process.env.MODEL_API;
const NGROK_HEADERS = { "ngrok-skip-browser-warning": "true" };

// POST /api/quiz/save  — save quiz answers
router.post("/save", auth, async (req, res) => {
  try {
    const { answers } = req.body;
    await User.findByIdAndUpdate(req.user.id, {
      quizAnswers: answers,
      isNewUser:   true
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/quiz/recommend  — get recommendations based on quiz
router.post("/recommend", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user?.quizAnswers) {
      return res.status(400).json({ error: "No quiz answers found" });
    }

    const answers = user.quizAnswers;

    // Build filter based on answers
    const filters = buildFilters(answers);

    // Call model search API with keywords
    const keyword  = filters.keywords[
      Math.floor(Math.random() * filters.keywords.length)
    ];
    const response = await axios.get(
      `${MODEL_API()}/search?q=${keyword}&limit=50`,
      { headers: NGROK_HEADERS }
    );

    let recipes = response.data.results || [];

    // Filter by nutrition preferences
    recipes = filterByNutrition(recipes, filters);

    // Take top 10
    recipes = recipes.slice(0, 10);

    res.json({ recommendations: recipes, filters });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function buildFilters(answers) {
  const keywords  = [];
  const maxCal    = answers.diet === "low_calorie"  ? 400
                  : answers.diet === "high_protein" ? 600 : 9999;
  const minProt   = answers.diet === "high_protein" ? 20 : 0;

  // Q1: cuisine preference → keywords
  const cuisineMap = {
    italian:  ["pasta","pizza","risotto","lasagna"],
    asian:    ["rice","noodle","stir fry","soy","miso"],
    american: ["burger","bbq","chicken","steak","grilled"],
    indian:   ["curry","masala","spice","lentil","dal"],
    mexican:  ["taco","salsa","burrito","guacamole","bean"],
    any:      ["chicken","pasta","rice","salad","soup"]
  };
  keywords.push(...(cuisineMap[answers.cuisine] || cuisineMap.any));

  // Q3: meal type → more keywords
  const mealMap = {
    breakfast: ["egg","oat","pancake","toast","smoothie"],
    lunch:     ["salad","sandwich","soup","wrap"],
    dinner:    ["chicken","beef","pasta","roast","stew"],
    snack:     ["cookie","muffin","dip","cracker","bite"],
    dessert:   ["cake","brownie","chocolate","pudding","sweet"]
  };
  keywords.push(...(mealMap[answers.mealType] || []));

  // Q6: health goal → add health keywords
  if (answers.healthGoal === "lose_weight") {
    keywords.push("salad","light","low fat","vegetable");
  } else if (answers.healthGoal === "build_muscle") {
    keywords.push("protein","chicken breast","egg","beef","tuna");
  } else if (answers.healthGoal === "eat_healthy") {
    keywords.push("quinoa","vegetable","fruit","whole grain");
  }

  return { keywords, maxCal, minProt };
}

function filterByNutrition(recipes, filters) {
  return recipes.filter(r => {
    if (!r.nutrition || r.nutrition.length === 0) return true;
    const cal  = r.nutrition[0] || 0;
    const prot = r.nutrition[4] || 0;
    return cal <= filters.maxCal && prot >= filters.minProt;
  });
}

module.exports = router;