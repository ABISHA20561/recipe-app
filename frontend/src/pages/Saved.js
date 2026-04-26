import { useState, useEffect } from "react";
import RecipeCard from "../components/RecipeCard";
import API from "../api";

export default function Saved() {
  const [saved,   setSaved]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/recipes/saved")
       .then(r => setSaved(r.data))
       .catch(() => {})
       .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    await API.delete(`/recipes/saved/${id}`);
    setSaved(prev => prev.filter(r => r._id !== id));
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay} />
      <div style={styles.content}>
        <div style={styles.header}>
          <h2 style={styles.heading}>Saved Recipes</h2>
          <span style={styles.badge}>{saved.length} recipes</span>
          <p style={styles.quote}>"Your personal cookbook, curated by AI"</p>
        </div>
        {loading && <p style={styles.loading}>Loading...</p>}
        <div style={styles.grid}>
          {saved.map(r => (
            <div key={r._id}>
              <RecipeCard recipe={r} showSave={false} />
              <button onClick={() => handleDelete(r._id)} style={styles.delBtn}>
                Remove
              </button>
            </div>
          ))}
        </div>
        {!loading && saved.length === 0 && (
          <div style={styles.emptyBox}>
            <p style={styles.emptyTitle}>No saved recipes yet</p>
            <p style={styles.emptySub}>Search and save recipes you love!</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh", position: "relative",
    backgroundImage: `url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1400&q=80')`,
    backgroundSize: "cover", backgroundPosition: "center",
    backgroundAttachment: "fixed",
  },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 0 },
  content: { position: "relative", zIndex: 1, maxWidth: "900px", margin: "0 auto", padding: "24px" },
  header: { padding: "32px 0 20px" },
  heading: {
    color: "#fff", fontSize: "2rem", fontWeight: "800",
    margin: "0 0 8px", textShadow: "0 0 20px #ff00ff",
    fontFamily: "'Segoe UI', sans-serif", display: "inline-block",
  },
  badge: {
    marginLeft: 12, background: "rgba(255,0,255,0.15)",
    color: "#ff00ff", padding: "4px 14px", borderRadius: 20,
    fontSize: "0.85rem", fontWeight: "bold",
    border: "1px solid #ff00ff",
    boxShadow: "0 0 8px rgba(255,0,255,0.3)",
    verticalAlign: "middle",
  },
  quote: {
    color: "#ff00ff", fontStyle: "italic",
    fontSize: "0.9rem", marginTop: 8,
    textShadow: "0 0 8px #ff00ff",
  },
  loading: { color: "#ff00ff", textAlign: "center", textShadow: "0 0 8px #ff00ff" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))",
    gap: 16,
  },
  delBtn: {
    background: "transparent", color: "#ff4d4d",
    border: "2px solid #ff4d4d", padding: "8px 16px",
    borderRadius: 8, cursor: "pointer",
    marginBottom: 16, width: "100%",
    fontWeight: "bold",
    boxShadow: "0 0 8px rgba(255,77,77,0.3)",
  },
  emptyBox: { textAlign: "center", padding: "60px 0" },
  emptyTitle: { color: "#fff", fontSize: "1.3rem", fontWeight: "bold" },
  emptySub: { color: "#666", fontSize: "0.9rem" },
};