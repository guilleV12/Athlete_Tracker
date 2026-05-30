import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPasswordRequest } from "../services/authApi";
import { getApiErrorMessage } from "../lib/apiError";
import { resetPasswordSchema } from "../lib/validations/authSchemas";
import ThemeToggle from "../components/ui/ThemeToggle";
import FormField from "../components/ui/FormField";
import PasswordField from "../components/ui/PasswordField";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";

  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onTouched",
  });

  const onValidSubmit = async ({ password }) => {
    setApiError("");
    try {
      await resetPasswordRequest({ token, password });
      navigate("/login", {
        replace: true,
        state: { passwordReset: true },
      });
    } catch (error) {
      setApiError(
        getApiErrorMessage(error, "No se pudo actualizar la contraseña.")
      );
    }
  };

  if (!token) {
    return (
      <div className="animate-page-enter relative flex min-h-screen items-center justify-center bg-[var(--code-bg)] px-4 py-12 text-start">
        <div className="absolute end-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] z-10">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-6 text-center shadow-[var(--shadow)] sm:p-8">
          <h1 className="mb-4 text-2xl font-semibold text-[var(--text-h)]">
            Enlace inválido
          </h1>
          <p className="mb-6 text-sm text-[var(--text)]">
            El enlace de recuperación no es válido. Pedí uno nuevo.
          </p>
          <Link
            to="/forgot-password"
            className="btn-press btn-quest inline-flex min-h-11 w-full items-center justify-center rounded-xl"
          >
            Recuperar contraseña
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-page-enter relative flex min-h-screen items-center justify-center bg-[var(--code-bg)] px-4 py-12 text-start">
      <div className="absolute end-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] z-10">
        <ThemeToggle />
      </div>

      <form
        onSubmit={handleSubmit(onValidSubmit)}
        className="auth-panel w-full max-w-sm rounded-2xl p-6 sm:p-8"
        aria-busy={isSubmitting}
        noValidate
      >
        <h1 className="mb-2 text-center text-2xl font-semibold text-[var(--text-h)] sm:text-3xl">
          Nueva contraseña
        </h1>
        <p className="mb-6 text-center text-sm text-[var(--text)]">
          Elegí una contraseña segura. El enlace expira en 1 hora.
        </p>

        {apiError ? (
          <div
            className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200"
            role="alert"
          >
            {apiError}
          </div>
        ) : null}

        <FormField
          label="Nueva contraseña"
          id="password"
          error={errors.password?.message}
          hint="Mínimo 8 caracteres, con letras y números"
          required
          className="mb-4"
        >
          <PasswordField
            id="password"
            error={errors.password?.message}
            autoComplete="new-password"
            registration={register("password")}
          />
        </FormField>

        <FormField
          label="Confirmar contraseña"
          id="confirmPassword"
          error={errors.confirmPassword?.message}
          required
          className="mb-6"
        >
          <PasswordField
            id="confirmPassword"
            error={errors.confirmPassword?.message}
            autoComplete="new-password"
            registration={register("confirmPassword")}
          />
        </FormField>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-press btn-quest min-h-11 w-full rounded-xl p-3 text-base disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Guardando..." : "Actualizar contraseña"}
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
    </div>
  );
}
