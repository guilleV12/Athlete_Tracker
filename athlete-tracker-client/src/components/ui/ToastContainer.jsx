import { createPortal } from "react-dom";
import ToastItem from "./Toast";

export default function ToastContainer({ toasts, onDismiss }) {
  if (typeof document === "undefined" || toasts.length === 0) {
    return null;
  }

  const hasError = toasts.some((t) => t.type === "error" && !t.exiting);

  return createPortal(
    <div
      className="pointer-events-none fixed inset-x-0 top-[max(1rem,env(safe-area-inset-top,0px))] z-50 flex flex-col items-center gap-2 px-4 md:top-6"
      aria-live={hasError ? "assertive" : "polite"}
      aria-relevant="additions"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>,
    document.body
  );
}
