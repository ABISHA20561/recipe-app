import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import RecipeCard from "../components/RecipeCard";
import API from "../api";

export default function Recommendations() {
  const { user }  = useAuth();
  const [recipes,  setRecipes]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [topK,     setTopK]     = useState(10);
  const [mode,     setMode]     = useState("blend");

  const fetchRecs = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await API.post("/recipes/recommend",
        { top_k: topK, mode });
      setRecipes(data.recommendations || []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecs(); }, [topK, mode]);

  const modeInfo = {
    blend:   { label:" Blended",  desc:"Mix of healthy & hedonic preferences" },
    healthy: { label:" Healthy",  desc:"Recipes matching your nutrition preferences" },
    hedonic: { label:"Hedonic",  desc:"Recipes matching your taste preferences" }
  };

  return (
    <div style={{ maxWidth:"900px", margin:"0 auto", padding:"24px" }}>
      <h2> Personalized For You</h2>
      {user?.modelUserId
        ? <p style={{color:"#666"}}>
            Recommendations for dataset user <b>{user.modelUserId}</b>
          </p>
        : <p style={{color:"orange"}}> No dataset user linked.</p>
      }

      {/* Mode selector */}
      <div style={{ display:"flex", gap:"10px", margin:"16px 0",
                    flexWrap:"wrap" }}>
        {Object.entries(modeInfo).map(([key, val]) => (
          <button key={key} onClick={() => setMode(key)}
            style={{ padding:"10px 20px", borderRadius:"20px",
                     border: mode === key ? "none" : "1px solid #ddd",
                     background: mode === key ? "#1a1a2e" : "white",
                     color: mode === key ? "white" : "#333",
                     cursor:"pointer", fontWeight: mode===key?"bold":"normal",
                     transition:"all 0.2s" }}>
            {val.label}
          </button>
        ))}
      </div>

      {/* Mode description */}
      <p style={{ color:"#666", fontSize:"0.9rem",
                  background:"#f8f8f8", padding:"10px",
                  borderRadius:"8px", marginBottom:"16px" }}>
         {modeInfo[mode].desc}
      </p>

      {/* Top K + Refresh */}
      <div style={{ display:"flex", gap:"8px",
                    alignItems:"center", marginBottom:"16px" }}>
        <label>Show top:</label>
        <select value={topK}
          onChange={e => setTopK(Number(e.target.value))}
          style={{ padding:"6px", borderRadius:"4px",
                   border:"1px solid #ddd" }}>
          {[5,10,20].map(k =>
            <option key={k} value={k}>{k}</option>)}
        </select>
        <button onClick={fetchRecs}
          style={{ background:"#1a1a2e", color:"white",
                   border:"none", padding:"8px 18px",
                   borderRadius:"6px", cursor:"pointer" }}>
           Refresh
        </button>
      </div>

      {loading && (
        <div style={{ textAlign:"center", padding:"40px" }}>
          <p style={{ fontSize:"1.2rem" }}> Getting your recommendations...</p>
          <p style={{ color:"#999", fontSize:"0.85rem" }}>
            This may take 10-20 seconds
          </p>
        </div>
      )}

      {error && (
        <p style={{ color:"red", background:"#fff0f0",
                    padding:"12px", borderRadius:"8px" }}>
          ❌ {error}
        </p>
      )}

      <div style={{ display:"grid",
                    gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",
                    gap:"16px" }}>
        {recipes.map((r, i) => <RecipeCard key={i} recipe={r} />)}
      </div>
    </div>
  );
}