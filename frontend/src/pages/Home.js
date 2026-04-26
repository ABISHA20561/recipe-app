import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={styles.container}>
      <div style={styles.overlay} />
      <div style={styles.hero}>
        <p style={styles.quote}>"Let food be thy medicine and medicine be thy food"</p>
        <h1 style={styles.title}>P2D Recipe Recommender</h1>
        <p style={styles.sub}>
          Personalized recipes powered by a hypergraph neural network
          that understands your healthy <b>&</b> hedonic preferences.
        </p>
        <div style={styles.btnRow}>
          <Link to="/search" style={styles.btn}>🔍 Search Recipes</Link>
          <Link to="/recommend" style={{...styles.btn, ...styles.btnAlt}}>
            ✨ Get Recommendations
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "90vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundImage: `url('https://images.unsplash.com/photo-1543353071-873f17a7a088?w=1400&q=80')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
  },
  overlay: {
    position: "absolute", inset: 0,
    background: "linear-gradient(135deg, rgba(26,26,46,0.85), rgba(233,69,96,0.4))",
  },
  hero: {
    textAlign: "center", color: "white",
    padding: "40px", position: "relative", zIndex: 1,
    maxWidth: "700px",
  },
  quote: {
    fontSize: "1rem", fontStyle: "italic",
    color: "#ffd700", marginBottom: "16px",
    letterSpacing: "0.5px",
  },
  title: { fontSize: "2.8rem", marginBottom: "16px", fontWeight: "800" },
  sub: {
    fontSize: "1.1rem", color: "#ddd",
    maxWidth: "500px", margin: "0 auto 32px",
  },
  btnRow: {
    display: "flex", gap: "16px",
    justifyContent: "center", flexWrap: "wrap",
  },
  btn: {
    padding: "14px 28px", background: "#e94560",
    color: "white", textDecoration: "none",
    borderRadius: "8px", fontSize: "1rem", fontWeight: "bold",
    boxShadow: "0 4px 15px rgba(233,69,96,0.4)",
  },
  btnAlt: {
    background: "rgba(255,255,255,0.15)",
    border: "2px solid white",
    backdropFilter: "blur(6px)",
  },
};