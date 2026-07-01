import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { DASHBOARD_PATH } from "../lib/routes";
import { useToast } from "../context/ToastContext";
import { loginRequest } from "../services/authApi";
import { getApiErrorMessage } from "../lib/apiError";
import { getPostAuthNavigation } from "../lib/authRedirect";
import { loginSchema } from "../lib/validations/authSchemas";
import ThemeToggle from "../components/ui/ThemeToggle";
import FormField, { fieldInputClass } from "../components/ui/FormField";
import PasswordField from "../components/ui/PasswordField";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const passwordResetDone = location.state?.passwordReset === true;
  const { login, user, token, loading: authLoading } = useAuth();
  const { success } = useToast();
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  if (!authLoading && user && token) {
    return <Navigate to={DASHBOARD_PATH} replace />;
  }

  const onValidSubmit = async ({ email, password }) => {
    setApiError("");
    try {
      const data = await loginRequest({ email, password });
      login(data);
      const needsProfile = !data.user?.profileCompleted;
      success(
        needsProfile
          ? `Hola, ${data.user?.name ?? "atleta"}. Completá tu perfil para personalizar tu plan.`
          : `Bienvenido, ${data.user?.name ?? "atleta"}.`
      );
      navigate(getPostAuthNavigation(data.user, { from: "login" }));
    } catch (error) {
      setApiError(getApiErrorMessage(error, "Credenciales incorrectas."));
    }
  };

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
        <h1 className="mb-6 text-2xl font-semibold text-center text-[var(--text-h)] sm:text-3xl">
          Iniciar sesión
        </h1>

        {passwordResetDone ? (
          <div
            className="mb-4 rounded-lg border border-emerald-500/35 bg-emerald-500/[0.08] p-3 text-sm text-[var(--text-h)] dark:border-emerald-500/25 dark:bg-emerald-500/10"
            role="status"
          >
            Contraseña actualizada. Iniciá sesión con tu nueva contraseña.
          </div>
        ) : null}

        {apiError ? (
          <div
            className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200"
            role="alert"
            aria-live="polite"
          >
            {apiError}
          </div>
        ) : null}

        <FormField
          label="Email"
          id="email"
          error={errors.email?.message}
          required
          className="mb-4"
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

        <FormField
          label="Contraseña"
          id="password"
          error={errors.password?.message}
          required
          className="mb-2"
        >
          <PasswordField
            id="password"
            error={errors.password?.message}
            autoComplete="current-password"
            registration={register("password")}
          />
        </FormField>

        <p className="mb-2 mt-1 text-end text-sm">
          <Link
            to="/forgot-password"
            className="font-medium text-[var(--accent)] hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </p>

        <button
          className="btn-press btn-quest mb-2 min-h-11 w-full rounded-xl p-3 text-base disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Ingresando..." : "Ingresar"}
        </button>

        <p className="text-center text-sm text-[var(--text)]">
          ¿No tenés cuenta?{" "}
          <Link
            to="/register"
            className="font-medium text-[var(--accent)] hover:underline"
          >
            Crear una
          </Link>
        </p>
      </form>
    </div>
  );
}
