import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { fetchProfile, saveProfile, logWeight } from "../services/profileApi";
import { getApiErrorMessage } from "../lib/apiError";
import { profileSchema } from "../lib/validations/profileSchemas";
import FormField, { fieldInputClass } from "../components/ui/FormField";
import WeightHistoryChart from "../components/profile/WeightHistoryChart";
import WeightQuickLog from "../components/profile/WeightQuickLog";
import ProfileOnboardingBanner from "../components/profile/ProfileOnboardingBanner";
import { notifyNewAchievements } from "../lib/achievementNotifications";

const ACTIVITY_OPTIONS = [
  { value: "sedentary", label: "Sedentario" },
  { value: "light", label: "Ligera (1–3 días/sem)" },
  { value: "moderate", label: "Moderada (3–5 días/sem)" },
  { value: "active", label: "Activa (6–7 días/sem)" },
  { value: "very_active", label: "Muy activa / físico" },
];

const MODE_OPTIONS = [
  {
    value: "maintenance",
    label: "Mantenimiento",
    hint: "Mantener peso y energía (TDEE).",
  },
  {
    value: "deficit",
    label: "Déficit",
    hint: "TDEE − 400 kcal (pérdida de grasa).",
  },
  {
    value: "surplus",
    label: "Superávit",
    hint: "TDEE + 300 kcal (ganancia muscular).",
  },
  {
    value: "intuitive",
    label: "Comer libre",
    hint: "Sin meta numérica; foco en bienestar.",
  },
];

function toDateInputValue(iso) {
  if (!iso) return "";
  return iso.slice(0, 10);
}

export default function ProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, patchUser } = useAuth();
  const toastApi = useToast();
  const [showOnboarding, setShowOnboarding] = useState(
    () => location.state?.onboarding === true
  );
  const [onboardingFrom, setOnboardingFrom] = useState(
    () => location.state?.from ?? "register"
  );
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [preview, setPreview] = useState(null);
  const [weightHistory, setWeightHistory] = useState([]);
  const [hasProfile, setHasProfile] = useState(false);
  const [currentWeightKg, setCurrentWeightKg] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      birthDate: "",
      sex: "male",
      weightKg: "",
      heightCm: "",
      activityLevel: "moderate",
      nutritionMode: "maintenance",
    },
    mode: "onTouched",
  });

  const watched = watch();

  useEffect(() => {
    if (location.state?.onboarding) {
      setOnboardingFrom(location.state.from ?? "register");
      setShowOnboarding(true);
      navigate(".", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (!loading && showOnboarding && hasProfile) {
      navigate("/", { replace: true });
    }
  }, [loading, showOnboarding, hasProfile, navigate]);

  const dismissOnboarding = () => {
    setShowOnboarding(false);
    navigate("/");
  };

  const firstName = user?.name?.trim().split(/\s+/)[0] ?? "";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setApiError("");
      try {
        const data = await fetchProfile();
        if (cancelled) return;
        if (data.profile) {
          reset({
            birthDate: toDateInputValue(data.profile.birthDate),
            sex: data.profile.sex,
            weightKg: data.profile.weightKg,
            heightCm: data.profile.heightCm,
            activityLevel: data.profile.activityLevel,
            nutritionMode: data.profile.nutritionMode,
          });
          setPreview(data.computed);
          setWeightHistory(data.weightHistory ?? []);
          setHasProfile(true);
          setCurrentWeightKg(data.profile.weightKg);
        } else {
          setWeightHistory([]);
          setHasProfile(false);
          setCurrentWeightKg(null);
        }
      } catch (err) {
        if (!cancelled) {
          setApiError(getApiErrorMessage(err, "No se pudo cargar el perfil."));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reset]);

  const onValidSubmit = async (values) => {
    setApiError("");
    try {
      const data = await saveProfile(values);
      setPreview(data.computed);
      setWeightHistory(data.weightHistory ?? []);
      setHasProfile(true);
      setCurrentWeightKg(data.profile?.weightKg ?? values.weightKg);
      reset({
        birthDate: toDateInputValue(data.profile.birthDate),
        sex: data.profile.sex,
        weightKg: data.profile.weightKg,
        heightCm: data.profile.heightCm,
        activityLevel: data.profile.activityLevel,
        nutritionMode: data.profile.nutritionMode,
      });
      patchUser({ profileCompleted: true });
      const wasOnboarding = showOnboarding;
      setShowOnboarding(false);
      toastApi.success("Perfil guardado. Tus metas calóricas están listas.");
      notifyNewAchievements(toastApi, data.newAchievements);
      if (wasOnboarding) {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setApiError(getApiErrorMessage(err, "No se pudo guardar el perfil."));
    }
  };

  const applyProfileResponse = (data) => {
    setPreview(data.computed);
    setWeightHistory(data.weightHistory ?? []);
    if (data.profile) {
      setHasProfile(true);
      setCurrentWeightKg(data.profile.weightKg);
      reset({
        birthDate: toDateInputValue(data.profile.birthDate),
        sex: data.profile.sex,
        weightKg: data.profile.weightKg,
        heightCm: data.profile.heightCm,
        activityLevel: data.profile.activityLevel,
        nutritionMode: data.profile.nutritionMode,
      });
    }
  };

  const onQuickWeight = async (weightKg) => {
    setApiError("");
    try {
      const data = await logWeight(weightKg);
      applyProfileResponse(data);
      toastApi.success("Peso registrado. BMR, TDEE y meta actualizados.");
    } catch (err) {
      const message = getApiErrorMessage(err, "No se pudo registrar el peso.");
      setApiError(message);
      throw new Error(message);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6 text-start sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <header className="mb-8 space-y-2">
        <p className="page-hero-eyebrow">Tu plan</p>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-h)] sm:text-4xl">
          Perfil nutricional
        </h1>
        <p className="text-sm text-[var(--text)]">
          Estimación orientativa (Mifflin-St Jeor). No reemplaza asesoramiento
          médico o nutricional profesional.
        </p>
      </header>

      {apiError ? (
        <div
          className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200"
          role="alert"
        >
          {apiError}
        </div>
      ) : null}

      {showOnboarding && !hasProfile && !loading ? (
        <ProfileOnboardingBanner
          userName={firstName}
          from={onboardingFrom}
          onSkip={dismissOnboarding}
        />
      ) : null}

      {loading ? (
        <div className="quest-card p-8 text-center text-[var(--text)]">
          Cargando perfil…
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onValidSubmit)}
          className="space-y-8"
          noValidate
          aria-busy={isSubmitting}
        >
          <section className="quest-card space-y-4 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-[var(--text-h)]">
              Datos corporales
            </h2>

            <FormField
              label="Fecha de nacimiento"
              id="birthDate"
              required
              error={errors.birthDate?.message}
            >
              <input
                id="birthDate"
                type="date"
                className={fieldInputClass(Boolean(errors.birthDate))}
                {...register("birthDate")}
              />
            </FormField>

            <FormField
              label="Sexo (para fórmula metabólica)"
              id="sex"
              required
              error={errors.sex?.message}
            >
              <select
                id="sex"
                className={fieldInputClass(Boolean(errors.sex))}
                {...register("sex")}
              >
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
              </select>
            </FormField>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Peso (kg)"
                id="weightKg"
                required
                error={errors.weightKg?.message}
              >
                <input
                  id="weightKg"
                  type="number"
                  step="0.1"
                  min="30"
                  max="300"
                  className={fieldInputClass(Boolean(errors.weightKg))}
                  {...register("weightKg")}
                />
              </FormField>

              <FormField
                label="Altura (cm)"
                id="heightCm"
                required
                error={errors.heightCm?.message}
              >
                <input
                  id="heightCm"
                  type="number"
                  step="1"
                  min="100"
                  max="250"
                  className={fieldInputClass(Boolean(errors.heightCm))}
                  {...register("heightCm")}
                />
              </FormField>
            </div>

            <FormField
              label="Nivel de actividad"
              id="activityLevel"
              required
              error={errors.activityLevel?.message}
            >
              <select
                id="activityLevel"
                className={fieldInputClass(Boolean(errors.activityLevel))}
                {...register("activityLevel")}
              >
                {ACTIVITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </FormField>
          </section>

          <section className="quest-card space-y-4 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-[var(--text-h)]">
              Objetivo nutricional
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {MODE_OPTIONS.map((mode) => (
                <label
                  key={mode.value}
                  className={`cursor-pointer rounded-xl border-2 p-4 transition ${
                    watched.nutritionMode === mode.value
                      ? "border-[var(--accent-border)] bg-[var(--accent-bg)]"
                      : "border-[var(--border)] hover:border-[var(--accent-border)]"
                  }`}
                >
                  <input
                    type="radio"
                    value={mode.value}
                    className="sr-only"
                    {...register("nutritionMode")}
                  />
                  <span className="block font-semibold text-[var(--text-h)]">
                    {mode.label}
                  </span>
                  <span className="mt-1 block text-xs text-[var(--text)]">
                    {mode.hint}
                  </span>
                </label>
              ))}
            </div>
            {errors.nutritionMode ? (
              <p className="text-xs text-red-600 dark:text-red-400" role="alert">
                {errors.nutritionMode.message}
              </p>
            ) : null}
          </section>

          {hasProfile ? (
            <section className="quest-card space-y-4 p-5 sm:p-6">
              <div>
                <h2 className="text-lg font-semibold text-[var(--text-h)]">
                  Actualizar peso
                </h2>
                <p className="mt-1 text-sm text-[var(--text)]">
                  Registrá un pesaje sin cambiar el resto del perfil. Se
                  recalculan BMR, TDEE y meta automáticamente.
                </p>
              </div>
              <WeightQuickLog
                currentWeightKg={currentWeightKg}
                onSubmit={onQuickWeight}
                disabled={isSubmitting}
              />
            </section>
          ) : null}

          {hasProfile ? (
            <section className="quest-card space-y-4 p-5 sm:p-6">
              <div>
                <h2 className="text-lg font-semibold text-[var(--text-h)]">
                  Historial de peso
                </h2>
                <p className="mt-1 text-sm text-[var(--text)]">
                  Últimas mediciones registradas.
                </p>
              </div>
              <WeightHistoryChart data={weightHistory} />
            </section>
          ) : null}

          {preview ? (
            <section className="quest-card achievement-card space-y-3 p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-[var(--text-h)]">
                Tu resumen (guardado)
              </h2>
              <ul className="space-y-2 text-sm text-[var(--text-h)]">
                <li>
                  <span className="text-[var(--text)]">Edad:</span>{" "}
                  {preview.age} años
                </li>
                <li>
                  <span className="text-[var(--text)]">BMR:</span> {preview.bmr}{" "}
                  kcal
                </li>
                <li>
                  <span className="text-[var(--text)]">TDEE:</span> {preview.tdee}{" "}
                  kcal
                </li>
                <li>
                  <span className="text-[var(--text)]">Meta diaria:</span>{" "}
                  {preview.targetCalories != null
                    ? `${preview.targetCalories} kcal`
                    : "Sin meta (comer libre)"}
                </li>
              </ul>
            </section>
          ) : (
            <p className="text-center text-sm text-[var(--text)]">
              Guardá el perfil para ver BMR, TDEE y meta diaria.
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-press btn-quest min-h-11 w-full rounded-xl p-3 text-base disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Guardando…" : "Guardar perfil"}
          </button>
        </form>
      )}

      {!loading && !preview ? (
        <p className="mt-4 text-center text-xs text-[var(--text)]">
          Tip: podés volver al dashboard después de guardar para ver tu progreso
          calórico del día.
        </p>
      ) : null}
    </div>
  );
}
