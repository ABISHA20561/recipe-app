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
    <div style={styles.container}>
      <h2> Saved Recipes ({saved.length})</h2>
      {loading && <p>Loading...</p>}
      <div style={styles.grid}>
        {saved.map(r => (
          <div key={r._id}>
            <RecipeCard recipe={r} showSave={false} />
            <button onClick={() => handleDelete(r._id)}
                    style={styles.delBtn}>
              🗑 Remove
            </button>
          </div>
        ))}
      </div>
      {!loading && saved.length === 0 && (
        <p style={styles.empty}>No saved recipes yet. Go find some!</p>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth:"900px", margin:"0 auto", padding:"24px" },
  grid:      { display:"grid",
               gridTemplateColumns:"repeat(auto-fill, minmax(280px,1fr))",
               gap:"16px" },
  delBtn:    { background:"#e74c3c", color:"white", border:"none",
               padding:"6px 14px", borderRadius:"6px",
               cursor:"pointer", marginBottom:"16px" },
  empty:     { color:"#999", textAlign:"center", marginTop:"40px" }
};