import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import API from "../api";

export default function QuizResults() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [filters, setFilters] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchQuizRecs(); }, []);

  const fetchQuizRecs = async () => {
    setLoading(true);
    try {
      const { data } = await API.post("/quiz/recommend", {});
      setRecipes(data.recommendations || []);
      setFilters(data.filters || null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay} />
      <div style={styles.content}>

        {/* Header card */}
        <div style={styles.headerCard}>
          <h2 style={styles.heading}>Your Personalized Recipes!</h2>
          <p style={styles.quote}>
            "Based on your quiz answers, here are recipes we think you'll love"
          </p>
          <div style={styles.btnRow}>
            <button onClick={fetchQuizRecs} style={styles.btnCyan}>
              Refresh
            </button>
            <button onClick={() => navigate("/quiz")} style={styles.btnOutline}>
              Retake Quiz
            </button>
            <button onClick={() => navigate("/recommend")} style={styles.btnGhost}>
              AI Recommendations
            </button>
          </div>
        </div>

        {/* Preference tags */}
        {filters && (
          <div style={styles.tagsBox}>
            <p style={styles.tagsLabel}>Your Preference Keywords:</p>
            <div style={styles.tagsRow}>
              {filters.keywords?.slice(0, 6).map((k, i) => (
                <span key={i} style={styles.tag}>{k}</span>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={styles.loadingBox}>
            <div style={styles.spinner} />
            <p style={styles.loadingText}>Finding your perfect recipes...</p>
          </div>
        )}

        {/* Error */}
        {error && <p style={styles.error}>{error}</p>}

        {/* Results */}
        {!loading && recipes.length > 0 && (
          <>
            <p style={styles.countText}>
              Found <span style={styles.countNum}>{recipes.length}</span> recipes matching your preferences
            </p>
            <div style={styles.grid}>
              {recipes.map((r, i) => <RecipeCard key={i} recipe={r} />)}
            </div>
          </>
        )}

        {/* Empty state */}
        {!loading && recipes.length === 0 && !error && (
          <div style={styles.emptyBox}>
            <p style={styles.emptyText}>No recipes found for your preferences.</p>
            <button onClick={() => navigate("/quiz")} style={styles.btnCyan}>
              Try Different Preferences
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh", position: "relative",
    backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&q=80')`,
    backgroundSize: "cover", backgroundPosition: "center",
    backgroundAttachment: "fixed",
  },
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.88)", zIndex: 0,
  },
  content: {
    position: "relative", zIndex: 1,
    maxWidth: 960, margin: "0 auto", padding: 24,
  },
  headerCard: {
    background: "rgba(0,0,0,0.75)",
    border: "1px solid #00fff7",
    boxShadow: "0 0 30px rgba(0,255,247,0.3)",
    borderRadius: 16, padding: "28px 32px",
    marginBottom: 20, marginTop: 20,
  },
  heading: {
    color: "#fff", fontSize: "1.8rem",
    fontWeight: "800", margin: "0 0 8px",
    textShadow: "0 0 16px #00fff7",
  },
  quote: {
    fontSize: "0.85rem", fontStyle: "italic",
    color: "#00fff7", margin: "0 0 20px",
    textShadow: "0 0 8px #00fff7",
  },
  btnRow: { display: "flex", gap: 10, flexWrap: "wrap" },
  btnCyan: {
    background: "transparent", color: "#00fff7",
    border: "2px solid #00fff7", padding: "9px 22px",
    borderRadius: 8, cursor: "pointer",
    fontWeight: "bold", fontSize: "0.9rem",
    boxShadow: "0 0 14px rgba(0,255,247,0.4)",
  },
  btnOutline: {
    background: "transparent", color: "#fff",
    border: "1px solid rgba(255,255,255,0.3)",
    padding: "9px 22px", borderRadius: 8,
    cursor: "pointer", fontSize: "0.9rem",
  },
  btnGhost: {
    background: "transparent", color: "#555",
    border: "1px solid #333", padding: "9px 22px",
    borderRadius: 8, cursor: "pointer", fontSize: "0.9rem",
  },
  tagsBox: {
    background: "rgba(0,0,0,0.6)",
    border: "1px solid rgba(0,255,247,0.15)",
    borderRadius: 10, padding: "14px 18px",
    marginBottom: 20,
  },
  tagsLabel: {
    color: "#00fff7", fontSize: "0.82rem",
    margin: "0 0 10px", fontWeight: "600",
    textShadow: "0 0 6px #00fff7",
  },
  tagsRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  tag: {
    background: "rgba(0,255,247,0.1)",
    border: "1px solid rgba(0,255,247,0.3)",
    color: "#00fff7", padding: "4px 14px",
    borderRadius: 20, fontSize: "0.8rem",
    fontWeight: "500",
  },
  loadingBox: { textAlign: "center", padding: "60px 0" },
  spinner: {
    width: 48, height: 48,
    border: "3px solid rgba(0,255,247,0.2)",
    borderTop: "3px solid #00fff7",
    borderRadius: "50%", margin: "0 auto 16px",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    color: "#00fff7", fontSize: "1.1rem",
    textShadow: "0 0 10px #00fff7",
  },
  error: {
    color: "#ff4d4d",
    background: "rgba(255,77,77,0.1)",
    border: "1px solid #ff4d4d",
    padding: 14, borderRadius: 8,
  },
  countText: {
    color: "#aaa", marginBottom: 16, fontSize: "0.9rem",
  },
  countNum: {
    color: "#00fff7", fontWeight: "bold",
    textShadow: "0 0 8px #00fff7",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 20,
  },
  emptyBox: { textAlign: "center", padding: "60px 0" },
  emptyText: {
    color: "#aaa", fontSize: "1rem", marginBottom: 20,
  },
};