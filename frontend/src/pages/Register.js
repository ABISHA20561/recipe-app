import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api";

export default function Register() {
  const [form,  setForm]  = useState({
    username:"", email:"", password:"", modelUserId:""
  });
  const [sampleUsers, setSampleUsers] = useState([]);
  const [error, setError] = useState("");
  const { login }  = useAuth();
  const navigate   = useNavigate();

  // Load sample user IDs from the dataset so user can pick one
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
    // If no dataset user ID selected → go to quiz
    if (!form.modelUserId) {
      navigate("/quiz");
    } else {
      navigate("/recommend");
    }
  } catch (err) {
    setError(err.response?.data?.error || "Registration failed");
  }
};

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2>Register</h2>
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
          <select style={styles.input}
            value={form.modelUserId}
            onChange={e => setForm({...form, modelUserId: e.target.value})}>
            <option value="">-- Select a User ID --</option>
            {sampleUsers.map(uid => (
              <option key={uid} value={uid}>User {uid}</option>
            ))}
          </select>

          <button style={styles.btn} type="submit">Register</button>
        </form>
        <p>Have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { display:"flex", justifyContent:"center",
               paddingTop:"60px", background:"#f0f2f5",
               minHeight:"100vh" },
  box:       { background:"white", padding:"40px", borderRadius:"10px",
               boxShadow:"0 2px 12px rgba(0,0,0,0.1)",
               width:"400px" },
  input:     { display:"block", width:"100%", marginBottom:"12px",
               padding:"10px", borderRadius:"6px",
               border:"1px solid #ddd", fontSize:"1rem",
               boxSizing:"border-box" },
  label:     { fontSize:"0.85rem", color:"#555",
               marginBottom:"6px", display:"block" },
  btn:       { width:"100%", padding:"10px", background:"#1a1a2e",
               color:"white", border:"none", borderRadius:"6px",
               fontSize:"1rem", cursor:"pointer" },
  error:     { color:"red", marginBottom:"10px" }
};