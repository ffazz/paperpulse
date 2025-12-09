export default function DashboardLoading() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container">
        {/* Header Skeleton */}
        <div className="mb-16">
          <div className="h-16 w-96 bg-midnight/5 rounded-2xl animate-pulse mb-4" />
          <div className="h-6 w-64 bg-midnight/5 rounded-xl animate-pulse" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 bg-midnight/5 rounded-3xl animate-pulse" />
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="space-y-8">
          <div className="h-96 bg-midnight/5 rounded-3xl animate-pulse" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="h-96 bg-midnight/5 rounded-3xl animate-pulse" />
            <div className="h-96 bg-midnight/5 rounded-3xl animate-pulse" />
          </div>
          <div className="h-96 bg-midnight/5 rounded-3xl animate-pulse" />
        </div>
      </div>
    </div>
  )
}
