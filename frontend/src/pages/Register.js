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
        <h2 style={styles.heading}>Create Account</h2>
        <p style={styles.quote}>"Every recipe is a new adventure waiting to be explored"</p>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} placeholder="Username"
            value={form.username}
            onChange={e => setForm({...form, username: e.target.value})} />
          <input style={styles.input} type="email" placeholder="Email"
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})} />
          <input style={styles.input} type="password" placeholder="Password"
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})} />
          <label style={styles.label}>
            Link a dataset User ID (for personalized recommendations):
          </label>
          <select style={{...styles.input, ...styles.select}}
            value={form.modelUserId}
            onChange={e => setForm({...form, modelUserId: e.target.value})}>
            <option value="">-- Select a User ID --</option>
            {sampleUsers.map(uid => (
              <option key={uid} value={uid}>User {uid}</option>
            ))}
          </select>
          <button style={styles.btn} type="submit">Create Account</button>
        </form>
        <p style={styles.link}>Have an account? <Link to="/login" style={styles.a}>Login here</Link></p>
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
    background: "rgba(0,0,0,0.85)",
  },
  box: {
    position: "relative", zIndex: 1,
    background: "rgba(0,0,0,0.75)",
    padding: "40px", borderRadius: "16px",
    border: "1px solid #ff00ff",
    boxShadow: "0 0 30px rgba(255,0,255,0.3)",
    width: "400px", textAlign: "center",
  },
  heading: {
    margin: "0 0 8px", color: "#fff",
    fontSize: "1.8rem", fontWeight: "800",
    textShadow: "0 0 16px #ff00ff",
  },
  quote: {
    fontSize: "0.8rem", fontStyle: "italic",
    color: "#ff00ff", marginBottom: "24px",
    textShadow: "0 0 8px #ff00ff",
  },
  input: {
    display: "block", width: "100%", marginBottom: "14px",
    padding: "12px", borderRadius: "8px",
    border: "1px solid #ff00ff",
    background: "rgba(255,0,255,0.05)",
    color: "white", fontSize: "1rem",
    boxSizing: "border-box", outline: "none",
    boxShadow: "0 0 6px rgba(255,0,255,0.2)",
  },
  select: { color: "white" },
  label: {
    fontSize: "0.82rem", color: "#aaa",
    marginBottom: "6px", display: "block", textAlign: "left",
  },
  btn: {
    width: "100%", padding: "12px",
    background: "transparent",
    color: "#ff00ff",
    border: "2px solid #ff00ff",
    borderRadius: "8px",
    fontSize: "1rem", cursor: "pointer", fontWeight: "bold",
    boxShadow: "0 0 16px #ff00ff",
    marginTop: "4px", letterSpacing: "1px",
  },
  error: { color: "#ff4d4d", marginBottom: "10px", fontSize: "0.9rem" },
  link: { marginTop: "16px", color: "#aaa", fontSize: "0.9rem" },
  a: { color: "#ff00ff", textDecoration: "none" },
};