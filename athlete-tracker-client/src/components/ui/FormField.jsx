export default function FormField({
  label,
  id,
  error,
  hint,
  required = false,
  className = "",
  children,
}) {
  const errorId = error ? `${id}-error` : undefined;
  const hintId = hint && !error ? `${id}-hint` : undefined;

  return (
    <div className={`block ${className}`}>
      <label
        htmlFor={id}
        className="mb-1 block text-xs font-medium text-[var(--text)] sm:text-sm"
      >
        {label}
        {required ? (
          <span className="text-[var(--accent)]" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </label>
      {children}
      {hint && !error ? (
        <p id={hintId} className="mt-1 text-xs text-[var(--text)]">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p
          id={errorId}
          className="mt-1 text-xs text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function fieldInputClass(hasError) {
  return `field-input${hasError ? " field-input--error" : ""}`;
}
