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
          <p style={styles.quote}>"Cooking is love made visible"</p>
          <h2 style={styles.heading}>Search Recipes</h2>
          <p style={styles.subtext}>Discover thousands of delicious recipes</p>
        </div>
        <input style={styles.searchBox}
          type="text"
          placeholder="Type a recipe name e.g. chicken pasta..."
          value={query}
          onChange={e => setQuery(e.target.value)} />
        {loading && <p style={styles.loading}>Searching...</p>}
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
    background: "rgba(0,0,0,0.85)", zIndex: 0,
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
    color: "#00fff7", marginBottom: "8px",
    textShadow: "0 0 10px #00fff7",
  },
  heading: {
    fontSize: "2.2rem", fontWeight: "800",
    color: "#fff", margin: "0 0 8px",
    textShadow: "0 0 20px #00fff7",
  },
  subtext: { color: "#aaa", marginBottom: "0" },
  searchBox: {
    width: "100%", padding: "16px", fontSize: "1rem",
    borderRadius: "10px",
    border: "2px solid #00fff7",
    marginBottom: "20px", boxSizing: "border-box",
    background: "rgba(0,0,0,0.7)",
    color: "white",
    boxShadow: "0 0 12px #00fff7",
    outline: "none",
  },
  loading: {
    color: "#00fff7", textAlign: "center",
    fontSize: "1.1rem", textShadow: "0 0 8px #00fff7",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))",
    gap: "16px",
  },
  empty: { color: "#aaa", textAlign: "center", marginTop: "40px" },
};