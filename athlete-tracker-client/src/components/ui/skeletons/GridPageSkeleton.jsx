import PageHeaderSkeleton from "./PageHeaderSkeleton";
import CardGridSkeleton from "./CardGridSkeleton";

export default function GridPageSkeleton({
  cardCount = 3,
  cardHeight = "h-40",
  label = "Cargando contenido",
}) {
  return (
    <div
      className="space-y-10 text-start"
      role="status"
      aria-busy="true"
      aria-label={label}
    >
      <PageHeaderSkeleton />
      <CardGridSkeleton count={cardCount} cardClassName={cardHeight} />
    </div>
  );
}
