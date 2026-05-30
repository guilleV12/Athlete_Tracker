import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { registerAndLogin } from "../services/authApi";
import { getApiErrorMessage } from "../lib/apiError";
import { getPostAuthNavigation } from "../lib/authRedirect";
import {
  registerSchema,
  toRegisterPayload,
} from "../lib/validations/authSchemas";
import ThemeToggle from "../components/ui/ThemeToggle";
import FormField, { fieldInputClass } from "../components/ui/FormField";
import PasswordField from "../components/ui/PasswordField";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { success } = useToast();
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const onValidSubmit = async (formData) => {
    setApiError("");
    try {
      const data = await registerAndLogin(toRegisterPayload(formData));
      login(data);
      const needsProfile = !data.user?.profileCompleted;
      success(
        needsProfile
          ? "Cuenta creada. Configurá tu perfil para empezar."
          : "Cuenta creada. ¡Bienvenido!"
      );
      navigate(getPostAuthNavigation(data.user, { from: "register" }));
    } catch (error) {
      setApiError(getApiErrorMessage(error, "Error al registrar usuario."));
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
        <h1 className="mb-6 text-center text-2xl font-semibold text-[var(--text-h)] sm:text-3xl">
          Crear cuenta
        </h1>

        {apiError ? (
          <div
            className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200"
            role="alert"
            aria-live="polite"
          >
            {apiError}
          </div>
        ) : null}

        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Nombre completo"
            id="firstName"
            error={errors.firstName?.message}
            hint="Sin el apellido"
            required
          >
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="Ej. Martina Ana"
              className={fieldInputClass(Boolean(errors.firstName))}
              aria-invalid={Boolean(errors.firstName)}
              {...register("firstName")}
            />
          </FormField>

          <FormField
            label="Apellido(s)"
            id="lastName"
            error={errors.lastName?.message}
            required
          >
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Ej. García López"
              className={fieldInputClass(Boolean(errors.lastName))}
              aria-invalid={Boolean(errors.lastName)}
              {...register("lastName")}
            />
          </FormField>
        </div>

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
          className="btn-press btn-quest min-h-11 w-full rounded-xl p-3 text-base disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Creando cuenta..." : "Registrarme"}
        </button>

        <p className="mt-4 text-center text-sm text-[var(--text)]">
          ¿Ya tenés cuenta?{" "}
          <Link
            to="/login"
            className="font-medium text-[var(--accent)] hover:underline"
          >
            Ingresar
          </Link>
        </p>
      </form>
    </div>
  );
}
