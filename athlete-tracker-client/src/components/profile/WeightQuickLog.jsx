import { useState } from "react";
import FormField, { fieldInputClass } from "../ui/FormField";

export default function WeightQuickLog({
  currentWeightKg,
  onSubmit,
  disabled = false,
}) {
  const [weight, setWeight] = useState(
    currentWeightKg != null ? String(currentWeightKg) : ""
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const value = Number(weight);
    if (!Number.isFinite(value) || value < 30 || value > 300) {
      setError("Ingresá un peso entre 30 y 300 kg.");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(value);
    } catch (err) {
      setError(err?.message ?? "No se pudo registrar el peso.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <FormField
        label="Peso actual (kg)"
        id="quick-weight"
        error={error}
        className="flex-1"
      >
        <input
          id="quick-weight"
          type="number"
          step="0.1"
          min={30}
          max={300}
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className={fieldInputClass}
          disabled={disabled || submitting}
        />
      </FormField>
      <button
        type="submit"
        disabled={disabled || submitting}
        className="btn-press btn-quest min-h-11 shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 sm:mb-0"
      >
        {submitting ? "Registrando…" : "Registrar peso"}
      </button>
    </form>
  );
}
