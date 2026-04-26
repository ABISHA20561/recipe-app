import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api";

export default function Login() {
  const [form, setForm] = useState({ email:"", password:"" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", form);
      login(data.token, data.user);
      navigate("/recommend");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay} />
      <div style={styles.box}>
        <h2 style={styles.heading}>Welcome Back</h2>
        <p style={styles.quote}>"Good food is the foundation of genuine happiness"</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} type="email" placeholder="Email"
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})} />
          <input style={styles.input} type="password" placeholder="Password"
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})} />
          <button style={styles.btn} type="submit">Login</button>
        </form>
        <p style={styles.link}>No account? <Link to="/register" style={styles.a}>Register here</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex", justifyContent: "center", alignItems: "center",
    minHeight: "100vh", position: "relative",
    backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&q=80')`,
    backgroundSize: "cover", backgroundPosition: "center",
  },
  overlay: {
    position: "absolute", inset: 0,
    background: "rgba(0,0,0,0.85)",
  },
  box: {
    position: "relative", zIndex: 1,
    background: "rgba(0,0,0,0.75)",
    padding: "40px", borderRadius: "16px",
    border: "1px solid #00fff7",
    boxShadow: "0 0 30px rgba(0,255,247,0.3)",
    width: "360px", textAlign: "center",
  },
  heading: {
    margin: "0 0 8px", color: "#fff",
    fontSize: "1.8rem", fontWeight: "800",
    textShadow: "0 0 16px #00fff7",
  },
  quote: {
    fontSize: "0.8rem", fontStyle: "italic",
    color: "#00fff7", marginBottom: "24px",
    textShadow: "0 0 8px #00fff7",
  },
  input: {
    display: "block", width: "100%", marginBottom: "14px",
    padding: "12px", borderRadius: "8px",
    border: "1px solid #00fff7",
    background: "rgba(0,255,247,0.05)",
    color: "white", fontSize: "1rem",
    boxSizing: "border-box",
    outline: "none",
    boxShadow: "0 0 6px rgba(0,255,247,0.2)",
  },
  btn: {
    width: "100%", padding: "12px",
    background: "transparent",
    color: "#00fff7",
    border: "2px solid #00fff7",
    borderRadius: "8px",
    fontSize: "1rem", cursor: "pointer", fontWeight: "bold",
    boxShadow: "0 0 16px #00fff7",
    marginTop: "4px", letterSpacing: "1px",
  },
  error: { color: "#ff4d4d", marginBottom: "10px", fontSize: "0.9rem" },
  link: { marginTop: "16px", color: "#aaa", fontSize: "0.9rem" },
  a: { color: "#00fff7", textDecoration: "none" },
};