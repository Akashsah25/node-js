import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../utils/api.js";
import { useAuth } from "../state/AuthContext.jsx";

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthed, setUser } = useAuth();

  const onLogout = async () => {
    try {
      await api.post("/users/logout");
    } finally {
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <header className="topbar">
      <div className="topbarInner">
        <Link to="/" className="brand">
          <span className="brandMark" />
          <span className="brandText">TodoGlow</span>
        </Link>

        <nav className="nav">
          {!isAuthed ? (
            <>
              <Link className="navLink" to="/login">
                Login
              </Link>
              <Link className="navLink" to="/signup">
                Signup
              </Link>
            </>
          ) : (
            <>
              <Link className="navLink" to="/todos">
                Todos
              </Link>
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="btn btnGhost"
                onClick={onLogout}
                type="button"
              >
                Logout
              </motion.button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

