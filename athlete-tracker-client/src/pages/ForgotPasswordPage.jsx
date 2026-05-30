import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { forgotPasswordRequest } from "../services/authApi";
import { getApiErrorMessage } from "../lib/apiError";
import { forgotPasswordSchema } from "../lib/validations/authSchemas";
import ThemeToggle from "../components/ui/ThemeToggle";
import FormField, { fieldInputClass } from "../components/ui/FormField";

export default function ForgotPasswordPage() {
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onTouched",
  });

  const onValidSubmit = async ({ email }) => {
    setApiError("");
    setSuccess(null);
    try {
      const data = await forgotPasswordRequest({ email });
      setSuccess(data);
    } catch (error) {
      setApiError(
        getApiErrorMessage(error, "No se pudo procesar la solicitud.")
      );
    }
  };

  return (
    <div className="animate-page-enter relative flex min-h-screen items-center justify-center bg-[var(--code-bg)] px-4 py-12 text-start">
      <div className="absolute end-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] z-10">
        <ThemeToggle />
      </div>

      <div className="auth-panel w-full max-w-sm rounded-2xl p-6 sm:p-8">
        <h1 className="mb-2 text-center text-2xl font-semibold text-[var(--text-h)] sm:text-3xl">
          Recuperar contraseña
        </h1>
        <p className="mb-6 text-center text-sm text-[var(--text)]">
          Ingresá tu email y te enviamos un enlace para elegir una nueva
          contraseña.
        </p>

        {success ? (
          <div className="space-y-4">
            <div
              className="rounded-lg border border-emerald-500/35 bg-emerald-500/[0.08] p-3 text-sm text-[var(--text-h)] dark:border-emerald-500/25 dark:bg-emerald-500/10"
              role="status"
            >
              {success.message}
            </div>

            {success.devResetUrl ? (
              <div className="rounded-lg border border-[var(--border)] bg-[var(--code-bg)] p-3 text-sm">
                <p className="mb-2 font-medium text-[var(--text-h)]">
                  Modo desarrollo
                </p>
                <p className="mb-2 text-[var(--text)]">
                  En producción esto llegaría por email. Por ahora usá este
                  enlace:
                </p>
                <Link
                  to={success.devResetUrl.replace(/^https?:\/\/[^/]+/, "")}
                  className="break-all font-medium text-[var(--accent)] hover:underline"
                >
                  Restablecer contraseña
                </Link>
              </div>
            ) : null}

            <Link
              to="/login"
              className="btn-press btn-quest flex min-h-11 w-full items-center justify-center rounded-xl text-base"
            >
              Volver al login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onValidSubmit)} noValidate aria-busy={isSubmitting}>
            {apiError ? (
              <div
                className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200"
                role="alert"
              >
                {apiError}
              </div>
            ) : null}

            <FormField
              label="Email"
              id="email"
              error={errors.email?.message}
              required
              className="mb-6"
            >
              <input
                id="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="tu@email.com"
                className={fieldInputClass(Boolean(errors.email))}
                aria-invalid={Boolean(errors.email)}
                {...register("email")}
              />
            </FormField>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-press btn-quest min-h-11 w-full rounded-xl p-3 text-base disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Enviando..." : "Enviar enlace"}
            </button>

            <p className="mt-4 text-center text-sm text-[var(--text)]">
              <Link
                to="/login"
                className="font-medium text-[var(--accent)] hover:underline"
              >
                Volver al login
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
