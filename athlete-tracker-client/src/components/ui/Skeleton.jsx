/**
 * Bloque base para estados de carga.
 * Usa shimmer CSS (index.css) + tokens del tema (light/dark).
 */
export default function Skeleton({ className = "", ...props }) {
  return (
    <div
      className={`skeleton-shimmer rounded-lg ${className}`.trim()}
      aria-hidden="true"
      {...props}
    />
  );
}
