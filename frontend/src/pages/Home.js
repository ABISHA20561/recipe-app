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
          <Link to="/search" style={styles.btn}>Search Recipes</Link>
          <Link to="/recommend" style={{...styles.btn, ...styles.btnAlt}}>
            Get Recommendations
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "90vh", display: "flex",
    alignItems: "center", justifyContent: "center",
    backgroundImage: `url('https://images.unsplash.com/photo-1543353071-873f17a7a088?w=1400&q=80')`,
    backgroundSize: "cover", backgroundPosition: "center",
    position: "relative",
  },
  overlay: {
    position: "absolute", inset: 0,
    background: "rgba(0,0,0,0.82)",
  },
  hero: {
    textAlign: "center", color: "white",
    padding: "40px", position: "relative", zIndex: 1,
    maxWidth: "700px",
  },
  quote: {
    fontSize: "1rem", fontStyle: "italic",
    color: "#00fff7", marginBottom: "20px",
    letterSpacing: "0.5px",
    textShadow: "0 0 10px #00fff7",
  },
  title: {
    fontSize: "2.8rem", marginBottom: "16px",
    fontWeight: "800", color: "#fff",
    textShadow: "0 0 20px #00fff7, 0 0 40px #00fff7",
  },
  sub: {
    fontSize: "1.1rem", color: "#aaa",
    maxWidth: "500px", margin: "0 auto 32px",
  },
  btnRow: {
    display: "flex", gap: "16px",
    justifyContent: "center", flexWrap: "wrap",
  },
  btn: {
    padding: "14px 28px",
    background: "transparent",
    color: "#00fff7",
    textDecoration: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "bold",
    border: "2px solid #00fff7",
    boxShadow: "0 0 12px #00fff7, inset 0 0 12px rgba(0,255,247,0.1)",
    transition: "all 0.3s",
  },
  btnAlt: {
    color: "#ff00ff",
    border: "2px solid #ff00ff",
    boxShadow: "0 0 12px #ff00ff, inset 0 0 12px rgba(255,0,255,0.1)",
  },
};