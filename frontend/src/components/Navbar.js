import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  const handleLogout = () => { logout(); navigate("/login"); };

  const navLink = (to, label, key) => (
    <Link
      to={to}
      key={key}
      onMouseEnter={() => setHovered(key)}
      onMouseLeave={() => setHovered(null)}
      style={{
        ...styles.link,
        color: hovered === key ? "#00fff7" : "#aaa",
        textShadow: hovered === key ? "0 0 8px #00fff7" : "none",
      }}>
      {label}
    </Link>
  );

  return (
    <nav style={styles.nav}>
      {/* Brand */}
      <Link to="/" style={styles.brand}>P2D Recipes</Link>

      {/* Links */}
      <div style={styles.links}>
        {navLink("/search",      "Search",      "search")}
        {navLink("/performance", "Performance", "perf")}

        {user ? (
          <>
            {navLink("/recommend", "For You", "recommend")}
            {navLink("/saved",     "Saved",   "saved")}

            {/* Quiz — always cyan */}
            <Link to="/quiz"
              onMouseEnter={() => setHovered("quiz")}
              onMouseLeave={() => setHovered(null)}
              style={{
                ...styles.link,
                color: "#00fff7",
                fontWeight: "700",
                textShadow: hovered === "quiz"
                  ? "0 0 16px #00fff7"
                  : "0 0 8px #00fff7",
              }}>
              Quiz
            </Link>

            {/* Username */}
            <span style={styles.user}>👤 {user.username}</span>

            {/* Logout */}
            <button
              onClick={handleLogout}
              onMouseEnter={() => setHovered("logout")}
              onMouseLeave={() => setHovered(null)}
              style={{
                ...styles.btn,
                background: hovered === "logout"
                  ? "rgba(255,77,77,0.15)" : "transparent",
                boxShadow: hovered === "logout"
                  ? "0 0 14px rgba(255,77,77,0.5)"
                  : "0 0 8px rgba(255,77,77,0.3)",
              }}>
              Logout
            </button>
          </>
        ) : (
          <>
            {navLink("/login", "Login", "login")}
            <Link to="/register"
              onMouseEnter={() => setHovered("register")}
              onMouseLeave={() => setHovered(null)}
              style={{
                ...styles.link,
                color: "#ff00ff",
                fontWeight: "700",
                textShadow: hovered === "register"
                  ? "0 0 16px #ff00ff"
                  : "0 0 8px #ff00ff",
              }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", padding: "14px 28px",
    background: "rgba(0,0,0,0.97)",
    borderBottom: "1px solid rgba(0,255,247,0.25)",
    boxShadow: "0 0 24px rgba(0,255,247,0.15)",
    position: "relative", zIndex: 9999,
  },
  brand: {
    color: "#00fff7", textDecoration: "none",
    fontSize: "1.4rem", fontWeight: "800",
    textShadow: "0 0 14px #00fff7",
    letterSpacing: "1.5px",
  },
  links: {
    display: "flex", gap: "22px", alignItems: "center",
  },
  link: {
    textDecoration: "none",
    fontSize: "0.95rem",
    transition: "all 0.2s",
    fontWeight: "500",
  },
  user: {
    color: "#00fff7", fontSize: "0.88rem",
    fontWeight: "600", textShadow: "0 0 6px #00fff7",
    background: "rgba(0,255,247,0.08)",
    border: "1px solid rgba(0,255,247,0.2)",
    padding: "5px 12px", borderRadius: "20px",
  },
  btn: {
    color: "#ff4d4d",
    border: "1px solid #ff4d4d",
    padding: "6px 16px", borderRadius: "6px",
    cursor: "pointer", fontSize: "0.85rem",
    fontWeight: "600", transition: "all 0.2s",
  },
};