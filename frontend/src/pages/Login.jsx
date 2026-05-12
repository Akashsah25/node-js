import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../utils/api.js";
import { useAuth } from "../state/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { data } = await api.post("/users/login", { email, password });
      setUser(data?.data?.user ?? { authenticated: true });
      navigate("/todos");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid2">
      <motion.section
        className="panel"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="panelHeader">
          <div className="kicker">Welcome back</div>
          <h1 className="title">Login</h1>
          <p className="subtitle">
            Sign in to manage your todos with a smooth, fast UI.
          </p>
        </div>

        <form className="form" onSubmit={onSubmit}>
          <label className="field">
            <span>Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </label>

          {error ? <div className="alert">{error}</div> : null}

          <motion.button
            whileTap={{ scale: 0.99 }}
            className="btn btnPrimary"
            disabled={busy}
            type="submit"
          >
            {busy ? "Signing in…" : "Login"}
          </motion.button>

          <div className="fineprint">
            No account? <Link to="/signup">Create one</Link>
          </div>
        </form>
      </motion.section>

      <section className="heroCard">
        <div className="heroInner">
          <div className="heroBadge">Cookie-based auth</div>
          <h2 className="heroTitle">Beautiful. Animated. Productive.</h2>
          <p className="heroText">
            Your backend uses secure HTTP-only cookies. This UI automatically
            keeps your session and protects your todo routes.
          </p>
          <ul className="heroList">
            <li>Fast Todo CRUD</li>
            <li>Framer Motion transitions</li>
            <li>Glass + gradient theme</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

