import Skeleton from "../Skeleton";

export default function PageHeaderSkeleton() {
  return (
    <div className="space-y-3" aria-hidden="true">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-9 max-w-xs sm:h-10" />
      <Skeleton className="h-4 max-w-md" />
    </div>
  );
}
