import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import ToastContainer from "../components/ui/ToastContainer";

const ToastContext = createContext(null);

const DEFAULT_DURATION = 4000;
const ACHIEVEMENT_DURATION = 6500;
const MAX_TOASTS = 4;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const dismiss = useCallback((id) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }

    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 280);
  }, []);

  const toast = useCallback(
    ({
      message,
      type = "info",
      duration = DEFAULT_DURATION,
      title,
      description,
    }) => {
      if (!message && !title) return;

      const id = crypto.randomUUID();

      setToasts((prev) => {
        const next = [
          ...prev,
          {
            id,
            message: message ?? title,
            title,
            description,
            type,
            exiting: false,
          },
        ];
        return next.slice(-MAX_TOASTS);
      });

      const timer = setTimeout(() => dismiss(id), duration);
      timersRef.current.set(id, timer);
    },
    [dismiss]
  );

  const success = useCallback(
    (message, duration) => toast({ message, type: "success", duration }),
    [toast]
  );

  const error = useCallback(
    (message, duration) => toast({ message, type: "error", duration }),
    [toast]
  );

  const info = useCallback(
    (message, duration) => toast({ message, type: "info", duration }),
    [toast]
  );

  const warning = useCallback(
    (message, duration) => toast({ message, type: "warning", duration }),
    [toast]
  );

  const achievementUnlocked = useCallback(
    ({ name, description }) =>
      toast({
        type: "achievement",
        title: "¡Logro desbloqueado!",
        message: name,
        description,
        duration: ACHIEVEMENT_DURATION,
      }),
    [toast]
  );

  const value = useMemo(
    () => ({
      toast,
      success,
      error,
      info,
      warning,
      achievementUnlocked,
      dismiss,
    }),
    [toast, success, error, info, warning, achievementUnlocked, dismiss]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast debe usarse dentro de ToastProvider");
  }
  return ctx;
}
