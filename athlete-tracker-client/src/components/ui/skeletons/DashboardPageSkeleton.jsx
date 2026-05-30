import PageHeaderSkeleton from "./PageHeaderSkeleton";
import StatsGridSkeleton from "./StatsGridSkeleton";
import ChartSkeleton from "./ChartSkeleton";
import Skeleton from "../Skeleton";

export default function DashboardPageSkeleton() {
  return (
    <div
      className="space-y-10 text-start"
      role="status"
      aria-busy="true"
      aria-label="Cargando panel"
    >
      <PageHeaderSkeleton />
      <StatsGridSkeleton />
      <ChartSkeleton />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2" aria-hidden="true">
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
      </div>
    );
}
