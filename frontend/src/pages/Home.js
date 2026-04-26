import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>P2D Recipe Recommender</h1>
        <p style={styles.sub}>
          Personalized recipes powered by a hypergraph neural network
          that understands your healthy <b>&</b> hedonic preferences.
        </p>
        <div style={styles.btnRow}>
          <Link to="/search"    style={styles.btn}>Search Recipes</Link>
          <Link to="/recommend" style={{...styles.btn, ...styles.btnAlt}}>
             Get Recommendations
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight:"90vh", display:"flex",
               alignItems:"center", justifyContent:"center",
               background:"linear-gradient(135deg,#1a1a2e,#16213e)" },
  hero:      { textAlign:"center", color:"white", padding:"40px" },
  title:     { fontSize:"2.5rem", marginBottom:"16px" },
  sub:       { fontSize:"1.1rem", color:"#aaa",
               maxWidth:"500px", margin:"0 auto 32px" },
  btnRow:    { display:"flex", gap:"16px", justifyContent:"center",
               flexWrap:"wrap" },
  btn:       { padding:"14px 28px", background:"#e94560",
               color:"white", textDecoration:"none",
               borderRadius:"8px", fontSize:"1rem",
               fontWeight:"bold" },
  btnAlt:    { background:"transparent",
               border:"2px solid white", color:"white" }
};