import PageHeaderSkeleton from "./PageHeaderSkeleton";
import FormBlockSkeleton from "./FormBlockSkeleton";
import CardGridSkeleton from "./CardGridSkeleton";
import Skeleton from "../Skeleton";

/** Workouts / Meals: header + form + grid de cards. */
export default function ResourcePageSkeleton({ label = "Cargando" }) {
  return (
    <div
      className="space-y-10 text-start"
      role="status"
      aria-busy="true"
      aria-label={label}
    >
      <PageHeaderSkeleton />
      <FormBlockSkeleton />
      <div className="space-y-4" aria-hidden="true">
        <Skeleton className="h-6 w-40" />
        <CardGridSkeleton count={3} cardClassName="h-32" />
      </div>
    </div>
  );
}
