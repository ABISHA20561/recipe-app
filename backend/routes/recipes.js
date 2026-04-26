const router         = require("express").Router();
const axios          = require("axios");
const authMiddleware = require("../middleware/auth");
const SavedRecipe    = require("../models/SavedRecipe");
const User           = require("../models/User");

const MODEL_API = () => process.env.MODEL_API;

// GET /api/recipes/search?q=chicken
router.get("/search", async (req, res) => {
  try {
    const { q = "", limit = 20 } = req.query;
    const response = await axios.get(
      `${MODEL_API()}/search?q=${encodeURIComponent(q)}&limit=${limit}`
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Model server error: " + err.message });
  }
});

// POST /api/recipes/recommend  ← needs login
router.post("/recommend", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user?.modelUserId)
      return res.status(400).json({
        error: "No dataset User ID linked to your account."
      });

    const { top_k = 10 } = req.body;
    const response = await axios.post(`${MODEL_API()}/recommend`, {
      user_id: user.modelUserId,
      top_k
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Model server error: " + err.message });
  }
});

// POST /api/recipes/save  ← needs login
router.post("/save", authMiddleware, async (req, res) => {
  try {
    const saved = await SavedRecipe.create({
      userId: req.user.id,
      ...req.body
    });
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/recipes/saved  ← needs login
router.get("/saved", authMiddleware, async (req, res) => {
  try {
    const recipes = await SavedRecipe
      .find({ userId: req.user.id })
      .sort({ savedAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/recipes/saved/:id  ← needs login
router.delete("/saved/:id", authMiddleware, async (req, res) => {
  try {
    await SavedRecipe.findOneAndDelete({
      _id: req.params.id, userId: req.user.id
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/recipes/users/sample
router.get("/users/sample", async (req, res) => {
  try {
    const response = await axios.get(`${MODEL_API()}/users/sample`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;