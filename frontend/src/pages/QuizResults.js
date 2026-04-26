import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import API from "../api";

export default function QuizResults() {
  const [recipes,  setRecipes]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [filters,  setFilters]  = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizRecs();
  }, []);

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
    <div style={{ maxWidth:960, margin:"0 auto", padding:24 }}>

      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#1a1a2e,#16213e)",
                    borderRadius:12, padding:24,
                    color:"white", marginBottom:24 }}>
        <h2 style={{ margin:"0 0 8px" }}>
           Your Personalized Recommendations!
        </h2>
        <p style={{ color:"#aaa", margin:"0 0 16px" }}>
          Based on your quiz answers, here are recipes we think you'll love
        </p>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <button onClick={fetchQuizRecs}
            style={{ background:"#e94560", color:"white",
                     border:"none", padding:"8px 20px",
                     borderRadius:8, cursor:"pointer",
                     fontWeight:"bold" }}>
             Refresh
          </button>
          <button onClick={() => navigate("/quiz")}
            style={{ background:"transparent", color:"white",
                     border:"1px solid white", padding:"8px 20px",
                     borderRadius:8, cursor:"pointer" }}>
            Retake Quiz
          </button>
          <button onClick={() => navigate("/recommend")}
            style={{ background:"transparent", color:"#aaa",
                     border:"1px solid #555", padding:"8px 20px",
                     borderRadius:8, cursor:"pointer" }}>
             AI Recommendations
          </button>
        </div>
      </div>

      {/* Preference summary */}
      {filters && (
        <div style={{ background:"#f8f9fa", borderRadius:10,
                      padding:16, marginBottom:20 }}>
          <p style={{ margin:"0 0 8px", fontWeight:"bold",
                      color:"#1a1a2e" }}>
            Your Preferences Summary:
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {filters.keywords?.slice(0,6).map((k,i) => (
              <span key={i}
                style={{ background:"#1a1a2e", color:"white",
                         padding:"4px 12px", borderRadius:20,
                         fontSize:"0.8rem" }}>
                {k}
              </span>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div style={{ textAlign:"center", padding:60 }}>
          <p style={{ fontSize:"1.2rem" }}>
            Finding your perfect recipes...
          </p>
        </div>
      )}

      {error && (
        <p style={{ color:"red", background:"#fff0f0",
                    padding:16, borderRadius:8 }}>
           {error}
        </p>
      )}

      {/* Recipe grid */}
      {!loading && recipes.length > 0 && (
        <>
          <p style={{ color:"#666", marginBottom:16 }}>
            Found <b>{recipes.length}</b> recipes matching your preferences
          </p>
          <div style={{ display:"grid",
                        gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",
                        gap:20 }}>
            {recipes.map((r, i) => (
              <RecipeCard key={i} recipe={r} />
            ))}
          </div>
        </>
      )}

      {!loading && recipes.length === 0 && !error && (
        <div style={{ textAlign:"center", padding:60 }}>
          <p style={{ fontSize:"1.1rem", color:"#666" }}>
             No recipes found for your preferences.
          </p>
          <button onClick={() => navigate("/quiz")}
            style={{ background:"#1a1a2e", color:"white",
                     border:"none", padding:"12px 24px",
                     borderRadius:8, cursor:"pointer",
                     marginTop:16 }}>
            Try Different Preferences
          </button>
        </div>
      )}
    </div>
  );
}