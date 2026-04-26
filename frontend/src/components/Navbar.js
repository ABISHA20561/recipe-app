import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}> P2D Recipes</Link>
      <div style={styles.links}>
        <Link to="/search"    style={styles.link}>Search</Link>
        <Link to="/performance" style={{ color:"#eee", textDecoration:"none" }}>
  Performance
</Link>
        {user ? (
          <>
            <Link to="/recommend" style={styles.link}>For You</Link>
            <Link to="/saved"     style={styles.link}>Saved</Link>
            <span style={styles.user}>👤 {user.username}</span>
            <button onClick={handleLogout} style={styles.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"    style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav:   { display:"flex", justifyContent:"space-between",
           alignItems:"center", padding:"12px 24px",
           background:"#1a1a2e", color:"white" },
  brand: { color:"white", textDecoration:"none",
           fontSize:"1.3rem", fontWeight:"bold" },
  links: { display:"flex", gap:"16px", alignItems:"center" },
  link:  { color:"#eee", textDecoration:"none" },
  user:  { color:"#aef" },
  btn:   { background:"#e74c3c", color:"white",
           border:"none", padding:"6px 14px",
           borderRadius:"4px", cursor:"pointer" }
};