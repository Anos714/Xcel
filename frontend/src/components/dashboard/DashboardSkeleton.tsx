import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>

              <Skeleton className="h-12 w-12 rounded-xl" />
            </div>
          </div>
        ))}
      </section>

      {/* Recent Tweets */}
      <section className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
        <Skeleton className="h-6 w-40" />

        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </section>

      {/* Upcoming Tweets */}
      <section className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
        <Skeleton className="h-6 w-44" />

        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </section>
    </div>
  );
}
