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
      <div style={styles.box}>
        <h2>Login</h2>
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
        <p>No account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { display:"flex", justifyContent:"center",
               paddingTop:"80px", background:"#f0f2f5",
               minHeight:"100vh" },
  box:       { background:"white", padding:"40px", borderRadius:"10px",
               boxShadow:"0 2px 12px rgba(0,0,0,0.1)",
               width:"360px" },
  input:     { display:"block", width:"100%", marginBottom:"12px",
               padding:"10px", borderRadius:"6px",
               border:"1px solid #ddd", fontSize:"1rem",
               boxSizing:"border-box" },
  btn:       { width:"100%", padding:"10px", background:"#1a1a2e",
               color:"white", border:"none", borderRadius:"6px",
               fontSize:"1rem", cursor:"pointer" },
  error:     { color:"red", marginBottom:"10px" }
};