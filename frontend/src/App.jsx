import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import "./App.css";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Todos from "./pages/Todos.jsx";
import { useAuth } from "./state/AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";

function App() {
  const location = useLocation();
  const { loading, isAuthed } = useAuth();

  return (
    <div className="appShell">
      <div className="bgOrbs" aria-hidden="true">
        <span className="orb orbA" />
        <span className="orb orbB" />
        <span className="orb orbC" />
      </div>

      <Navbar />

      <main className="container">
        {loading ? (
          <div className="center">
            <div className="spinner" />
            <div className="muted">Warming up…</div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <Routes location={location}>
                <Route
                  path="/"
                  element={<Navigate to={isAuthed ? "/todos" : "/login"} />}
                />
                <Route
                  path="/login"
                  element={isAuthed ? <Navigate to="/todos" /> : <Login />}
                />
                <Route
                  path="/signup"
                  element={isAuthed ? <Navigate to="/todos" /> : <Signup />}
                />
                <Route
                  path="/todos"
                  element={isAuthed ? <Todos /> : <Navigate to="/login" />}
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}

export default App;
