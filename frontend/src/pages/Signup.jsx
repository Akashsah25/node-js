import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../utils/api.js";
import { useAuth } from "../state/AuthContext.jsx";

export default function Signup() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api.post("/users/register", { fullName, userName, email, password });
      const { data } = await api.post("/users/login", { email, password });
      setUser(data?.data?.user ?? { authenticated: true });
      navigate("/todos");
    } catch (err) {
      setError(err?.response?.data?.message || "Signup failed");
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
          <div className="kicker">Start here</div>
          <h1 className="title">Create account</h1>
          <p className="subtitle">Signup and begin tracking tasks instantly.</p>
        </div>

        <form className="form" onSubmit={onSubmit}>
          <div className="row2">
            <label className="field">
              <span>Full name</span>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Akash Sah"
                autoComplete="name"
                required
              />
            </label>
            <label className="field">
              <span>Username</span>
              <input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="akash"
                autoComplete="username"
                required
              />
            </label>
          </div>

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
              placeholder="At least 6 characters"
              autoComplete="new-password"
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
            {busy ? "Creating…" : "Signup"}
          </motion.button>

          <div className="fineprint">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </form>
      </motion.section>

      <section className="heroCard">
        <div className="heroInner">
          <div className="heroBadge">Minimal + modern</div>
          <h2 className="heroTitle">A frontend you can show.</h2>
          <p className="heroText">
            Built with React + CSS + Framer Motion, connected to your Node/Express
            backend.
          </p>
          <ul className="heroList">
            <li>Responsive layout</li>
            <li>Accessible inputs</li>
            <li>Animated micro-interactions</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

