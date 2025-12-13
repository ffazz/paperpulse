'use client'

import { motion } from 'framer-motion'
import { HiQuestionMarkCircle } from 'react-icons/hi2'
import { useState } from 'react'

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
  progress?: {
    current: number
    required: number
  }
}

interface AchievementsBadgesProps {
  achievements: Achievement[]
}

export function AchievementsBadges({ achievements }: AchievementsBadgesProps) {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalCount = achievements.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Achievements</h2>
          <p className="text-gray-600 mt-1">
            {unlockedCount} of {totalCount} unlocked
          </p>
        </div>
        <div className="text-4xl font-bold text-blue-500">
          {Math.round((unlockedCount / totalCount) * 100)}%
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {achievements.map((achievement, index) => (
          <motion.button
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedAchievement(achievement)}
            className={`relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition hover:scale-105 ${
              achievement.unlocked
                ? 'border-yellow-400 bg-yellow-50 cursor-pointer'
                : 'border-gray-200 bg-gray-50 opacity-60'
            }`}
          >
            {/* Icon */}
            <span className="text-4xl">{achievement.icon}</span>

            {/* Lock overlay for locked achievements */}
            {!achievement.unlocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg">
                <HiQuestionMarkCircle className="w-6 h-6 text-gray-500" />
              </div>
            )}

            {/* Name */}
            <span className="text-xs text-center font-medium leading-tight">
              {achievement.name}
            </span>

            {/* Unlock date */}
            {achievement.unlocked && achievement.unlockedAt && (
              <span className="text-xs text-yellow-600 font-semibold">
                ✓
              </span>
            )}

            {/* Progress bar for locked achievements */}
            {!achievement.unlocked && achievement.progress && (
              <div className="w-full h-1 bg-gray-300 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{
                    width: `${(achievement.progress.current / achievement.progress.required) * 100}%`
                  }}
                />
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Achievement Details Modal */}
      {selectedAchievement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-6xl block mb-3">{selectedAchievement.icon}</span>
                <h3 className="text-2xl font-bold">{selectedAchievement.name}</h3>
              </div>
              <button
                onClick={() => setSelectedAchievement(null)}
                className="text-2xl text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <p className="text-gray-700 mb-4">{selectedAchievement.description}</p>

            {selectedAchievement.unlocked && selectedAchievement.unlockedAt && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Unlocked:</strong> {new Date(selectedAchievement.unlockedAt).toLocaleDateString()}
                </p>
              </div>
            )}

            {!selectedAchievement.unlocked && selectedAchievement.progress && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Progress:</strong> {selectedAchievement.progress.current} / {selectedAchievement.progress.required}
                </p>
                <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{
                      width: `${(selectedAchievement.progress.current / selectedAchievement.progress.required) * 100}%`
                    }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={() => setSelectedAchievement(null)}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}
