import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import ReadingListsGrid from '@/components/reading-lists/ReadingListsGrid'
import ReadingGoalCard from '@/components/reading-lists/ReadingGoalCard'
import { Suspense } from 'react'

export const metadata = {
  title: 'Reading Lists | PaperPulse',
  description: 'Organize your books into themed reading lists',
}

export default async function ReadingListsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/auth/signin')
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-accent/5 pt-20 md:pt-24 pb-8 md:pb-12">
      <div className="container mx-auto px-4">
        <div className="space-y-12">
          {/* My Lists Section */}
          <section>
            <ReadingListsGrid />
          </section>

          {/* Reading Goal Section */}
          <section className="border-t border-midnight/10 pt-12">
            <h2 className="text-3xl font-bold text-midnight mb-8">Your Reading Goal</h2>
            <Suspense fallback={<div className="h-64 bg-gray-200 rounded-3xl animate-pulse" />}>
              <ReadingGoalCard />
            </Suspense>
          </section>
        </div>
      </div>
    </main>
  )
}
