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
    setLoading(true); setError("");
    try {
      const { data } = await API.post("/recipes/recommend", { top_k: topK, mode });
      setRecipes(data.recommendations || []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchRecs(); }, [topK, mode]);

  const modeInfo = {
    blend:   { label: "Blended",  desc: "Mix of healthy & hedonic preferences",      color: "#00fff7" },
    healthy: { label: "Healthy",  desc: "Recipes matching your nutrition preferences", color: "#00ff99" },
    hedonic: { label: "Hedonic",  desc: "Recipes matching your taste preferences",     color: "#ff00ff" },
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay} />
      <div style={styles.content}>
        <div style={styles.header}>
          <h2 style={styles.heading}>Personalized For You</h2>
          {user?.modelUserId
            ? <p style={styles.sub}>Recommendations for dataset user <span style={styles.highlight}>{user.modelUserId}</span></p>
            : <p style={styles.warn}>No dataset user linked.</p>
          }
        </div>

        <div style={styles.modeRow}>
          {Object.entries(modeInfo).map(([key, val]) => (
            <button key={key} onClick={() => setMode(key)}
              style={{
                ...styles.modeBtn,
                border: `2px solid ${val.color}`,
                color: mode === key ? "#000" : val.color,
                background: mode === key ? val.color : "transparent",
                boxShadow: mode === key ? `0 0 14px ${val.color}` : "none",
              }}>
              {val.label}
            </button>
          ))}
        </div>

        <p style={{ ...styles.modeDesc, color: modeInfo[mode].color }}>
          {modeInfo[mode].desc}
        </p>

        <div style={styles.controls}>
          <label style={styles.label}>Show top:</label>
          <select value={topK}
            onChange={e => setTopK(Number(e.target.value))}
            style={styles.select}>
            {[5, 10, 20].map(k => <option key={k} value={k}>{k}</option>)}
          </select>
          <button onClick={fetchRecs} style={styles.refreshBtn}>Refresh</button>
        </div>

        {loading && (
          <div style={styles.loadingBox}>
            <p style={styles.loadingText}>Fetching your recommendations...</p>
            <p style={styles.loadingSub}>This may take 10-20 seconds</p>
          </div>
        )}

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.grid}>
          {recipes.map((r, i) => <RecipeCard key={i} recipe={r} />)}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh", position: "relative",
    backgroundImage: `url('https://images.unsplash.com/photo-1543353071-873f17a7a088?w=1400&q=80')`,
    backgroundSize: "cover", backgroundPosition: "center",
    backgroundAttachment: "fixed",
  },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 0 },
  content: { position: "relative", zIndex: 1, maxWidth: "900px", margin: "0 auto", padding: "24px" },
  header: { padding: "32px 0 16px" },
  heading: {
    color: "#fff", fontSize: "2rem", fontWeight: "800",
    margin: "0 0 8px", textShadow: "0 0 20px #00fff7",
    fontFamily: "'Segoe UI', sans-serif",
  },
  sub: { color: "#aaa", margin: 0 },
  highlight: { color: "#00fff7", fontWeight: "bold" },
  warn: { color: "#ff9900", margin: 0 },
  modeRow: { display: "flex", gap: 10, margin: "16px 0", flexWrap: "wrap" },
  modeBtn: {
    padding: "10px 24px", borderRadius: 25,
    cursor: "pointer", fontWeight: "bold",
    fontSize: "0.9rem", transition: "all 0.2s",
    letterSpacing: "0.5px",
  },
  modeDesc: {
    fontSize: "0.9rem", padding: "10px 16px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: 8, marginBottom: 16,
    border: "1px solid rgba(255,255,255,0.1)",
  },
  controls: { display: "flex", gap: 10, alignItems: "center", marginBottom: 20 },
  label: { color: "#aaa", fontSize: "0.9rem" },
  select: {
    padding: "8px 12px", borderRadius: 8,
    border: "1px solid #00fff7",
    background: "rgba(0,0,0,0.6)", color: "#00fff7",
    fontSize: "0.9rem", outline: "none",
  },
  refreshBtn: {
    background: "transparent", color: "#00fff7",
    border: "2px solid #00fff7", padding: "8px 20px",
    borderRadius: 8, cursor: "pointer", fontWeight: "bold",
    boxShadow: "0 0 10px rgba(0,255,247,0.3)",
  },
  loadingBox: { textAlign: "center", padding: "40px" },
  loadingText: { color: "#00fff7", fontSize: "1.2rem", textShadow: "0 0 10px #00fff7" },
  loadingSub: { color: "#666", fontSize: "0.85rem" },
  error: {
    color: "#ff4d4d", background: "rgba(255,77,77,0.1)",
    padding: 12, borderRadius: 8, border: "1px solid #ff4d4d",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))",
    gap: 16,
  },
};