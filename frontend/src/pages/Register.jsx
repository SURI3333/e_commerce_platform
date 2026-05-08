import { useState } from "react";
import { api } from "../api/client";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";


export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");

  const handleRegister = async () => {
    try {
      await api.post("/auth/register", { email, password, role });
      alert("Registered ✅");
      navigate("/login");
    } catch {
      alert("Error ❌");
    }
  };

  return (
    <div className="container-center">

      <motion.div
        className="card"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >

        <h2>Create Account 🚀</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="customer">Customer</option>
          <option value="vendor">Vendor</option>
        </select>

        <button onClick={handleRegister}>
          Register
        </button>

        <p>
          Already have account? <Link to="/login">Login</Link>
        </p>

      </motion.div>

    </div>
  );
}