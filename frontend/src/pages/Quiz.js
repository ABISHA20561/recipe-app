import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api";

const QUESTIONS = [
  {
    id: "cuisine",
    question: " What cuisine do you enjoy most?",
    options: [
      { value:"italian",  label:" Italian",  emoji:"" },
      { value:"asian",    label:" Asian",    emoji:"" },
      { value:"american", label:" American", emoji:"" },
      { value:"indian",   label:" Indian",   emoji:"" },
      { value:"mexican",  label:"Mexican",  emoji:"" },
      { value:"any",      label:"Any / Mix",emoji:"" },
    ]
  },
  {
    id: "mealType",
    question: "What meal do you want recipes for?",
    options: [
      { value:"breakfast", label:" Breakfast", emoji:"" },
      { value:"lunch",     label:" Lunch",     emoji:"" },
      { value:"dinner",    label:" Dinner",    emoji:"" },
      { value:"snack",     label:" Snack",     emoji:"" },
      { value:"dessert",   label:" Dessert",   emoji:"" },
    ]
  },
  {
    id: "cookingTime",
    question: " How much time can you spend cooking?",
    options: [
      { value:"quick",    label:" Under 15 mins", emoji:"" },
      { value:"medium",   label:" 15–30 mins",    emoji:"" },
      { value:"normal",   label:" 30–60 mins",    emoji:"" },
      { value:"long",     label:" Over 1 hour",   emoji:"" },
    ]
  },
  {
    id: "diet",
    question: "Do you follow any diet?",
    options: [
      { value:"none",         label:" No restriction",  emoji:"" },
      { value:"vegetarian",   label:" Vegetarian",      emoji:"" },
      { value:"vegan",        label:" Vegan",           emoji:"" },
      { value:"low_calorie",  label:" Low Calorie",     emoji:"" },
      { value:"high_protein", label:" High Protein",   emoji:"" },
    ]
  },
  {
    id: "spiceLevel",
    question: "How spicy do you like your food?",
    options: [
      { value:"mild",    label:" Mild",         emoji:"" },
      { value:"medium",  label:" Medium",       emoji:"" },
      { value:"spicy",   label:" Spicy",        emoji:"" },
      { value:"very_spicy",label:" Very Spicy", emoji:"" },
    ]
  },
  {
    id: "healthGoal",
    question: " What is your main health goal?",
    options: [
      { value:"lose_weight",   label:" Lose Weight",    emoji:"" },
      { value:"build_muscle",  label:"Build Muscle",   emoji:"" },
      { value:"eat_healthy",   label:" Eat Healthy",    emoji:"" },
      { value:"enjoy_food",    label:" Just Enjoy Food",emoji:"" },
      { value:"no_goal",       label:"No Specific Goal",emoji:"" },
    ]
  },
  {
    id: "allergies",
    question: " Any food allergies or things you avoid?",
    options: [
      { value:"none",     label:"None",        emoji:"" },
      { value:"nuts",     label:" No Nuts",     emoji:"" },
      { value:"dairy",    label:" No Dairy",    emoji:"" },
      { value:"gluten",   label:" No Gluten",   emoji:"" },
      { value:"seafood",  label:" No Seafood",  emoji:"" },
    ]
  },
  {
    id: "cookingSkill",
    question: " What is your cooking skill level?",
    options: [
      { value:"beginner",     label:" Beginner",      emoji:"" },
      { value:"intermediate", label:" Intermediate",  emoji:"" },
      { value:"advanced",     label:" Advanced",      emoji:"" },
      { value:"chef",         label:" Professional Chef", emoji:"" },
    ]
  },
  {
    id: "servings",
    question: "How many people do you usually cook for?",
    options: [
      { value:"1",    label:" Just Me",      emoji:"" },
      { value:"2",    label:" 2 People",     emoji:"" },
      { value:"4",    label:"Family (4)",  emoji:"👨‍👩‍👧" },
      { value:"many", label:" Large Group",  emoji:"" },
    ]
  },
  {
    id: "favoriteIngredient",
    question: " What's your favourite main ingredient?",
    options: [
      { value:"chicken",   label:" Chicken",    emoji:"" },
      { value:"beef",      label:" Beef",       emoji:"" },
      { value:"fish",      label:" Fish",       emoji:"" },
      { value:"vegetable", label:" Vegetables", emoji:"" },
      { value:"pasta",     label:" Pasta",      emoji:"" },
      { value:"egg",       label:" Eggs",       emoji:"" },
    ]
  }
];

export default function Quiz() {
  const [step,    setStep]    = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const { user, login, token } = useAuth();
  const navigate = useNavigate();

  const current  = QUESTIONS[step];
  const progress = ((step) / QUESTIONS.length) * 100;

  const handleAnswer = async (value) => {
    const newAnswers = { ...answers, [current.id]: value };
    setAnswers(newAnswers);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      // Last question — save and get recommendations
      setLoading(true);
      try {
        await API.post("/quiz/save", { answers: newAnswers });
        navigate("/quiz-results");
      } catch (err) {
        console.error(err);
        navigate("/quiz-results");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingBox}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>
            🍳 Cooking up your recommendations...
          </p>
          <p style={styles.loadingSubText}>
            Analyzing your preferences
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Progress bar */}
        <div style={styles.progressWrapper}>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill,
                          width: `${progress}%` }} />
          </div>
          <p style={styles.progressText}>
            Question {step + 1} of {QUESTIONS.length}
          </p>
        </div>

        {/* Question */}
        <h2 style={styles.question}>{current.question}</h2>

        {/* Options */}
        <div style={styles.optionsGrid}>
          {current.options.map(opt => (
            <button key={opt.value}
              onClick={() => handleAnswer(opt.value)}
              style={{ ...styles.optionBtn,
                       ...(answers[current.id] === opt.value
                           ? styles.optionBtnSelected : {}) }}>
              <span style={styles.optionEmoji}>{opt.emoji}</span>
              <span style={styles.optionLabel}>{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Back button */}
        {step > 0 && (
          <button onClick={handleBack} style={styles.backBtn}>
            ← Back
          </button>
        )}

        {/* Skip */}
        <button onClick={() => navigate("/recommend")}
          style={styles.skipBtn}>
          Skip quiz → use dataset recommendations
        </button>
      </div>
    </div>
  );
}

const styles = {
  page:             { minHeight:"100vh", background:"linear-gradient(135deg,#1a1a2e,#16213e)",
                      display:"flex", alignItems:"center",
                      justifyContent:"center", padding:20 },
  card:             { background:"white", borderRadius:16,
                      padding:32, maxWidth:580, width:"100%",
                      boxShadow:"0 20px 60px rgba(0,0,0,0.3)" },
  progressWrapper:  { marginBottom:24 },
  progressBar:      { background:"#eee", borderRadius:10,
                      height:8, marginBottom:8 },
  progressFill:     { background:"linear-gradient(90deg,#1a1a2e,#e94560)",
                      height:8, borderRadius:10,
                      transition:"width 0.4s ease" },
  progressText:     { color:"#999", fontSize:"0.85rem",
                      margin:0, textAlign:"right" },
  question:         { color:"#1a1a2e", fontSize:"1.3rem",
                      marginBottom:24, lineHeight:1.4 },
  optionsGrid:      { display:"grid",
                      gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",
                      gap:12, marginBottom:20 },
  optionBtn:        { padding:"14px 12px", borderRadius:10,
                      border:"2px solid #eee", background:"white",
                      cursor:"pointer", textAlign:"left",
                      display:"flex", alignItems:"center",
                      gap:10, transition:"all 0.2s",
                      fontSize:"0.9rem" },
  optionBtnSelected:{ border:"2px solid #1a1a2e",
                      background:"#f0f4ff" },
  optionEmoji:      { fontSize:"1.4rem" },
  optionLabel:      { color:"#333", fontWeight:"500" },
  backBtn:          { background:"none", border:"1px solid #ddd",
                      padding:"8px 20px", borderRadius:8,
                      cursor:"pointer", color:"#666",
                      marginRight:12 },
  skipBtn:          { background:"none", border:"none",
                      color:"#999", cursor:"pointer",
                      fontSize:"0.8rem", textDecoration:"underline",
                      marginTop:8 },
  loadingPage:      { minHeight:"100vh",
                      background:"linear-gradient(135deg,#1a1a2e,#16213e)",
                      display:"flex", alignItems:"center",
                      justifyContent:"center" },
  loadingBox:       { textAlign:"center", color:"white" },
  spinner:          { width:50, height:50, border:"4px solid #444",
                      borderTop:"4px solid #e94560",
                      borderRadius:"50%", margin:"0 auto 20px",
                      animation:"spin 1s linear infinite" },
  loadingText:      { fontSize:"1.3rem", marginBottom:8 },
  loadingSubText:   { color:"#aaa", fontSize:"0.9rem" }
};