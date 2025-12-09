export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="text-6xl mb-4 pulse-animation">📚</div>
        <h2 className="text-2xl font-semibold text-gray-700">
          Memuat...
        </h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
        </div>
      </div>
    </div>
  )
}