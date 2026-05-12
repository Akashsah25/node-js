import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../utils/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Since backend is cookie/JWT based, we “probe” by trying to read todos.
  // If unauthorized, user remains null.
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const resp = await api.get("/todos");
        if (!ignore) {
          // If todos succeed, user is authenticated, but we don't have /me.
          // Keep a minimal user marker.
          setUser((u) => u ?? { authenticated: true });
        }
      } catch {
        if (!ignore) setUser(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      loading,
      isAuthed: !!user,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

