import Skeleton from "../Skeleton";

export default function CardGridSkeleton({
  count = 3,
  cardClassName = "h-32",
}) {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className={`rounded-2xl ${cardClassName}`} />
      ))}
    </div>
  );
}
