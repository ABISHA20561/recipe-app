import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api";

export default function Register() {
  const [form, setForm] = useState({
    username:"", email:"", password:"", modelUserId:""
  });
  const [sampleUsers, setSampleUsers] = useState([]);
  const [error, setError] = useState("");
  const { login }  = useAuth();
  const navigate   = useNavigate();

  useEffect(() => {
    API.get("/recipes/users/sample")
       .then(r => setSampleUsers(r.data.users || []))
       .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/register", {
        ...form,
        modelUserId: form.modelUserId ? parseInt(form.modelUserId) : null
      });
      login(data.token, data.user);
      if (!form.modelUserId) navigate("/quiz");
      else navigate("/recommend");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay} />
      <div style={styles.box}>
        <div style={styles.iconWrapper}>🥗</div>
        <h2 style={styles.heading}>Create Account</h2>
        <p style={styles.quote}>"Every recipe is a new adventure waiting to be explored"</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} placeholder="👤 Username"
            value={form.username}
            onChange={e => setForm({...form, username: e.target.value})} />
          <input style={styles.input} type="email" placeholder="📧 Email"
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})} />
          <input style={styles.input} type="password" placeholder="🔒 Password"
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})} />
          <label style={styles.label}>
            🔗 Link a dataset User ID (for personalized recommendations):
          </label>
          <select style={styles.input}
            value={form.modelUserId}
            onChange={e => setForm({...form, modelUserId: e.target.value})}>
            <option value="">-- Select a User ID --</option>
            {sampleUsers.map(uid => (
              <option key={uid} value={uid}>User {uid}</option>
            ))}
          </select>
          <button style={styles.btn} type="submit">Create Account</button>
        </form>
        <p style={styles.link}>Have an account? <Link to="/login">Login here</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex", justifyContent: "center", alignItems: "center",
    minHeight: "100vh", position: "relative",
    backgroundImage: `url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1400&q=80')`,
    backgroundSize: "cover", backgroundPosition: "center",
  },
  overlay: {
    position: "absolute", inset: 0,
    background: "rgba(10,10,30,0.7)",
  },
  box: {
    position: "relative", zIndex: 1,
    background: "rgba(255,255,255,0.97)",
    padding: "40px", borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    width: "400px", textAlign: "center",
  },
  iconWrapper: { fontSize: "2.5rem", marginBottom: "8px" },
  heading: { margin: "0 0 6px", color: "#1a1a2e", fontSize: "1.6rem" },
  quote: {
    fontSize: "0.8rem", fontStyle: "italic",
    color: "#e94560", marginBottom: "20px",
  },
  input: {
    display: "block", width: "100%", marginBottom: "12px",
    padding: "12px", borderRadius: "8px",
    border: "1px solid #ddd", fontSize: "1rem",
    boxSizing: "border-box", textAlign: "left",
  },
  label: {
    fontSize: "0.82rem", color: "#555",
    marginBottom: "6px", display: "block", textAlign: "left",
  },
  btn: {
    width: "100%", padding: "12px",
    background: "linear-gradient(135deg,#1a1a2e,#e94560)",
    color: "white", border: "none", borderRadius: "8px",
    fontSize: "1rem", cursor: "pointer", fontWeight: "bold",
    marginTop: "4px",
  },
  error: { color: "red", marginBottom: "10px", fontSize: "0.9rem" },
  link: { marginTop: "16px", color: "#555", fontSize: "0.9rem" },
};