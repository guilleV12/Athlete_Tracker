import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  clearStoredAuth,
  readStoredSession,
} from "../lib/authSession.js";
import { SESSION_EXPIRED_EVENT } from "../lib/authEvents.js";
import { useToast } from "./ToastContext.jsx";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { warning } = useToast();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    clearStoredAuth();
    setUser(null);
    setToken(null);
  }, []);

  useEffect(() => {
    const { token: storedToken, userRaw } = readStoredSession();

    if (!storedToken || !userRaw) {
      if (storedToken || userRaw) {
        clearStoredAuth();
      }
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      setUser(JSON.parse(userRaw));
      setToken(storedToken);
    } catch {
      clearStoredAuth();
      setUser(null);
      setToken(null);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    const onExpired = () => {
      clearSession();
      warning("Tu sesión expiró. Volvé a iniciar sesión.");
    };
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired);
  }, [clearSession, warning]);

  const login = useCallback((data) => {
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const patchUser = useCallback((partial) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...partial };
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        patchUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
