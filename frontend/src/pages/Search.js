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
    }, 400);
    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div style={styles.page}>
      <div style={styles.overlay} />
      <div style={styles.content}>
        <div style={styles.heroSection}>
          <p style={styles.quote}>"Cooking is love made visible 🍽️"</p>
          <h2 style={styles.heading}>Search Recipes</h2>
          <p style={styles.subtext}>Discover thousands of delicious recipes</p>
        </div>
        <input style={styles.searchBox}
          type="text"
          placeholder="🔍 Type a recipe name e.g. chicken pasta..."
          value={query}
          onChange={e => setQuery(e.target.value)} />
        {loading && <p style={styles.loading}>🍳 Searching...</p>}
        <div style={styles.grid}>
          {results.map((r, i) => (
            <RecipeCard key={i} recipe={r} />
          ))}
        </div>
        {!loading && query && results.length === 0 && (
          <p style={styles.empty}>No recipes found for "{query}"</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh", position: "relative",
    backgroundImage: `url('https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1400&q=80')`,
    backgroundSize: "cover", backgroundPosition: "center",
    backgroundAttachment: "fixed",
  },
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(10,10,30,0.75)", zIndex: 0,
  },
  content: {
    position: "relative", zIndex: 1,
    maxWidth: "900px", margin: "0 auto", padding: "24px",
  },
  heroSection: {
    textAlign: "center", color: "white",
    padding: "40px 0 20px",
  },
  quote: {
    fontSize: "1rem", fontStyle: "italic",
    color: "#ffd700", marginBottom: "8px",
  },
  heading: {
    fontSize: "2rem", fontWeight: "800",
    color: "white", margin: "0 0 8px",
  },
  subtext: { color: "#aaa", marginBottom: "0" },
  searchBox: {
    width: "100%", padding: "16px", fontSize: "1rem",
    borderRadius: "12px", border: "none",
    marginBottom: "20px", boxSizing: "border-box",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    background: "rgba(255,255,255,0.95)",
  },
  loading: { color: "#ffd700", textAlign: "center", fontSize: "1.1rem" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))",
    gap: "16px",
  },
  empty: { color: "#aaa", textAlign: "center", marginTop: "40px" },
};