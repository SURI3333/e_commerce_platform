import { useState } from "react";
import { api } from "../api/client";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role", res.data.role);

      navigate("/products");
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-900 via-purple-900 to-black">

      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: -50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-[350px] text-white border border-white/20"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back 👋</h2>

        <input
          placeholder="Email"
          className="w-full p-2 mb-3 bg-transparent border border-white/30 rounded focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 bg-transparent border border-white/30 rounded focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* ✅ Animated Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogin}
          className="w-full bg-indigo-500 p-2 rounded font-semibold hover:bg-indigo-400 transition"
        >
          Login
        </motion.button>

        <p className="text-center mt-4 text-sm">
          Don't have account?{" "}
          <Link to="/register" className="text-indigo-300">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}