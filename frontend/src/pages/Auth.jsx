import { useState } from "react";
import { api } from "../api/client";
import { useNavigate } from "react-router-dom";
import "../styles/theme.css";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  // ✅ LOGIN FUNCTION
  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role", res.data.role);

      navigate("/products");
    } catch {
      alert("Login failed ❌");
    }
  };

  // ✅ REGISTER FUNCTION
  const handleRegister = async () => {
    try {
      await api.post("/auth/register", {
        email,
        password,
        role: "customer",
      });

      alert("Registered ✅");
      setIsLogin(true);
    } catch {
      alert("Register failed ❌");
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        {/* ✅ TOGGLE HEADER */}
        <div className="toggle-bar">
          <button
            className={isLogin ? "active" : ""}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>

          <button
            className={!isLogin ? "active" : ""}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        {/* ✅ LOGIN FORM */}
        {isLogin ? (
          <>
            <h2>Welcome Back 👋</h2>

            <input
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="btn" onClick={handleLogin}>
              LOGIN NOW
            </button>
          </>
        ) : (
          <>
            {/* ✅ REGISTER FORM */}
            <h2>Create Account 🚀</h2>

            <input
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="btn" onClick={handleRegister}>
              REGISTER
            </button>
          </>
        )}

      </div>

    </div>
  );
}