import { useState, useEffect } from "react";
import RecipeCard from "../components/RecipeCard";
import API from "../api";

export default function Search() {
  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const delay = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await API.get(
          `/recipes/search?q=${encodeURIComponent(query)}&limit=20`
        );
        setResults(data.results || []);
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 400);          // debounce 400ms
    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div style={styles.container}>
      <h2> Search Recipes</h2>
      <input style={styles.searchBox}
        type="text"
        placeholder="Type a recipe name e.g. chicken pasta..."
        value={query}
        onChange={e => setQuery(e.target.value)} />

      {loading && <p>Searching...</p>}

      <div style={styles.grid}>
        {results.map((r, i) => (
          <RecipeCard key={i} recipe={r} />
        ))}
      </div>
      {!loading && query && results.length === 0 && (
        <p style={styles.empty}>No recipes found for "{query}"</p>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth:"900px", margin:"0 auto", padding:"24px" },
  searchBox: { width:"100%", padding:"14px", fontSize:"1rem",
               borderRadius:"8px", border:"1px solid #ddd",
               marginBottom:"20px", boxSizing:"border-box",
               boxShadow:"0 2px 6px rgba(0,0,0,0.07)" },
  grid:      { display:"grid",
               gridTemplateColumns:"repeat(auto-fill, minmax(280px,1fr))",
               gap:"16px" },
  empty:     { color:"#999", textAlign:"center", marginTop:"40px" }
};