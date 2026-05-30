import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { fieldInputClass } from "./FormField";

export default function PasswordField({
  id,
  error,
  autoComplete = "current-password",
  placeholder = "••••••••",
  registration,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={`${fieldInputClass(Boolean(error))} pe-11`}
        aria-invalid={Boolean(error)}
        {...registration}
      />
      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        className="touch-target absolute end-0.5 top-1/2 -translate-y-1/2 rounded-full text-[var(--text)] transition hover:bg-[var(--code-bg)] hover:text-[var(--text-h)] flex items-center justify-center"
        aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        aria-pressed={visible}
        tabIndex={-1}
      >
        {visible ? (
          <EyeOff size={16} aria-hidden="true" />
        ) : (
          <Eye size={16} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
