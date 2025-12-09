import { prisma } from '@/lib/prisma'
import HeroSection from '@/components/home/HeroSection'
import StatsGrid from '@/components/home/StatsGrid'
import FeaturesSection from '@/components/home/FeaturesSection'
import CTASection from '@/components/home/CTASection'

async function getStats() {
  try {
    const [total, indonesian, international] = await Promise.all([
      prisma.book.count(),
      prisma.book.count({ 
        where: { 
          language: { 
            in: ['Indonesian', 'Indonesia', 'id', 'ind'] 
          } 
        } 
      }),
      prisma.book.count({ 
        where: { 
          language: { 
            notIn: ['Indonesian', 'Indonesia', 'id', 'ind'] 
          } 
        } 
      }),
    ])
    
    return { total, indonesian, international }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return { total: 0, indonesian: 0, international: 0 }
  }
}

export default async function HomePage() {
  const stats = await getStats()

  return (
    <div className="min-h-screen pt-16">
      <HeroSection />
      <StatsGrid stats={stats} />
      <FeaturesSection />
      <CTASection />
    </div>
  )
}
