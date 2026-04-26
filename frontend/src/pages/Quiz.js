import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const QUESTIONS = [
  {
    id: "cuisine",
    question: "What cuisine do you enjoy most?",
    options: [
      { value: "italian",  label: "Italian" },
      { value: "asian",    label: "Asian" },
      { value: "american", label: "American" },
      { value: "indian",   label: "Indian" },
      { value: "mexican",  label: "Mexican" },
      { value: "any",      label: "Any / Mix" },
    ]
  },
  {
    id: "mealType",
    question: "What meal do you want recipes for?",
    options: [
      { value: "breakfast", label: "Breakfast" },
      { value: "lunch",     label: "Lunch" },
      { value: "dinner",    label: "Dinner" },
      { value: "snack",     label: "Snack" },
      { value: "dessert",   label: "Dessert" },
    ]
  },
  {
    id: "cookingTime",
    question: "How much time can you spend cooking?",
    options: [
      { value: "quick",  label: "Under 15 mins" },
      { value: "medium", label: "15–30 mins" },
      { value: "normal", label: "30–60 mins" },
      { value: "long",   label: "Over 1 hour" },
    ]
  },
  {
    id: "diet",
    question: "Do you follow any diet?",
    options: [
      { value: "none",         label: "No restriction" },
      { value: "vegetarian",   label: "Vegetarian" },
      { value: "vegan",        label: "Vegan" },
      { value: "low_calorie",  label: "Low Calorie" },
      { value: "high_protein", label: "High Protein" },
    ]
  },
  {
    id: "spiceLevel",
    question: "How spicy do you like your food?",
    options: [
      { value: "mild",       label: "Mild" },
      { value: "medium",     label: "Medium" },
      { value: "spicy",      label: "Spicy" },
      { value: "very_spicy", label: "Very Spicy" },
    ]
  },
  {
    id: "healthGoal",
    question: "What is your main health goal?",
    options: [
      { value: "lose_weight",  label: "Lose Weight" },
      { value: "build_muscle", label: "Build Muscle" },
      { value: "eat_healthy",  label: "Eat Healthy" },
      { value: "enjoy_food",   label: "Just Enjoy Food" },
      { value: "no_goal",      label: "No Specific Goal" },
    ]
  },
  {
    id: "allergies",
    question: "Any food allergies or things you avoid?",
    options: [
      { value: "none",    label: "None" },
      { value: "nuts",    label: "No Nuts" },
      { value: "dairy",   label: "No Dairy" },
      { value: "gluten",  label: "No Gluten" },
      { value: "seafood", label: "No Seafood" },
    ]
  },
  {
    id: "cookingSkill",
    question: "What is your cooking skill level?",
    options: [
      { value: "beginner",     label: "Beginner" },
      { value: "intermediate", label: "Intermediate" },
      { value: "advanced",     label: "Advanced" },
      { value: "chef",         label: "Professional Chef" },
    ]
  },
  {
    id: "servings",
    question: "How many people do you usually cook for?",
    options: [
      { value: "1",    label: "Just Me" },
      { value: "2",    label: "2 People" },
      { value: "4",    label: "Family (4)" },
      { value: "many", label: "Large Group" },
    ]
  },
  {
    id: "favoriteIngredient",
    question: "What's your favourite main ingredient?",
    options: [
      { value: "chicken",   label: "Chicken" },
      { value: "beef",      label: "Beef" },
      { value: "fish",      label: "Fish" },
      { value: "vegetable", label: "Vegetables" },
      { value: "pasta",     label: "Pasta" },
      { value: "egg",       label: "Eggs" },
    ]
  }
];

export default function Quiz() {
  const [step,    setStep]    = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();

  const current  = QUESTIONS[step];
  const progress = (step / QUESTIONS.length) * 100;

  const handleAnswer = async (value) => {
    const newAnswers = { ...answers, [current.id]: value };
    setAnswers(newAnswers);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
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

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.overlay} />
        <div style={styles.loadingBox}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Cooking up your recommendations...</p>
          <p style={styles.loadingSub}>Analyzing your preferences</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.overlay} />
      <div style={styles.card}>

        {/* Header */}
        <h2 style={styles.heading}>Taste Quiz</h2>
        <p style={styles.quote}>"Tell us what you love, we'll find the perfect recipe"</p>

        {/* Progress bar */}
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>
        <p style={styles.progressText}>
          Question {step + 1} of {QUESTIONS.length}
        </p>

        {/* Question */}
        <h3 style={styles.question}>{current.question}</h3>

        {/* Options */}
        <div style={styles.optionsGrid}>
          {current.options.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleAnswer(opt.value)}
              onMouseEnter={() => setHovered(opt.value)}
              onMouseLeave={() => setHovered(null)}
              style={{
                ...styles.optionBtn,
                ...(answers[current.id] === opt.value ? styles.optionSelected : {}),
                ...(hovered === opt.value && answers[current.id] !== opt.value
                  ? styles.optionHover : {}),
              }}>
              {opt.label}
            </button>
          ))}
        </div>

        {/* Back button */}
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} style={styles.backBtn}>
            ← Back
          </button>
        )}

        {/* Skip */}
        <button onClick={() => navigate("/recommend")} style={styles.skipBtn}>
          Skip quiz → use dataset recommendations
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh", display: "flex",
    alignItems: "center", justifyContent: "center",
    position: "relative",
    backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&q=80')`,
    backgroundSize: "cover", backgroundPosition: "center",
    padding: 20,
  },
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.88)", zIndex: 0,
  },
  card: {
    position: "relative", zIndex: 1,
    background: "rgba(0,0,0,0.75)",
    border: "1px solid #00fff7",
    boxShadow: "0 0 30px rgba(0,255,247,0.3)",
    borderRadius: 16, padding: "36px 32px",
    maxWidth: 580, width: "100%",
    textAlign: "center",
  },
  heading: {
    color: "#fff", fontSize: "1.8rem",
    fontWeight: "800", margin: "0 0 6px",
    textShadow: "0 0 16px #00fff7",
  },
  quote: {
    fontSize: "0.82rem", fontStyle: "italic",
    color: "#00fff7", marginBottom: 24,
    textShadow: "0 0 8px #00fff7",
  },
  progressBar: {
    background: "rgba(0,255,247,0.1)",
    borderRadius: 10, height: 6,
    marginBottom: 8,
    border: "1px solid rgba(0,255,247,0.2)",
  },
  progressFill: {
    background: "#00fff7",
    height: 6, borderRadius: 10,
    boxShadow: "0 0 10px #00fff7",
    transition: "width 0.4s ease",
  },
  progressText: {
    color: "#00fff7", fontSize: "0.78rem",
    margin: "0 0 20px", textAlign: "right",
    opacity: 0.7,
  },
  question: {
    color: "#fff", fontSize: "1.2rem",
    marginBottom: 20, lineHeight: 1.5,
    fontWeight: "600",
  },
  optionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: 10, marginBottom: 20,
  },
  optionBtn: {
    padding: "12px 14px",
    background: "rgba(0,255,247,0.03)",
    border: "1px solid rgba(0,255,247,0.3)",
    borderRadius: 8, cursor: "pointer",
    color: "#ccc", fontSize: "0.9rem",
    fontWeight: "500", textAlign: "center",
    transition: "all 0.2s",
  },
  optionHover: {
    background: "rgba(0,255,247,0.08)",
    border: "1px solid #00fff7",
    color: "#fff",
  },
  optionSelected: {
    background: "rgba(0,255,247,0.15)",
    border: "2px solid #00fff7",
    color: "#00fff7",
    boxShadow: "0 0 12px rgba(0,255,247,0.3)",
  },
  backBtn: {
    background: "transparent",
    border: "1px solid rgba(0,255,247,0.3)",
    padding: "8px 20px", borderRadius: 8,
    cursor: "pointer", color: "#aaa",
    marginRight: 12, fontSize: "0.9rem",
  },
  skipBtn: {
    background: "none", border: "none",
    color: "#444", cursor: "pointer",
    fontSize: "0.78rem", textDecoration: "underline",
    marginTop: 10,
  },
  loadingBox: {
    position: "relative", zIndex: 1,
    textAlign: "center", color: "white",
    background: "rgba(0,0,0,0.75)",
    border: "1px solid #00fff7",
    boxShadow: "0 0 30px rgba(0,255,247,0.3)",
    borderRadius: 16, padding: "50px 40px",
  },
  spinner: {
    width: 48, height: 48,
    border: "3px solid rgba(0,255,247,0.2)",
    borderTop: "3px solid #00fff7",
    borderRadius: "50%", margin: "0 auto 20px",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    color: "#00fff7", fontSize: "1.2rem",
    marginBottom: 8, textShadow: "0 0 10px #00fff7",
  },
  loadingSub: { color: "#555", fontSize: "0.85rem" },
};