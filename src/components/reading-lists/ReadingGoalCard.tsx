'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HiTrophy, HiPlus } from 'react-icons/hi2'

interface ReadingGoal {
  id: string
  year: number
  targetBooks: number
  currentBooks: number
}

export default function ReadingGoalCard() {
  const [goal, setGoal] = useState<ReadingGoal | null>(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [targetInput, setTargetInput] = useState('')

  const currentYear = new Date().getFullYear()

  useEffect(() => {
    fetchGoal()
  }, [])

  const fetchGoal = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/user/goals?year=${currentYear}`)
      
      if (response.ok) {
        const data = await response.json()
        setGoal(data)
        setTargetInput(data?.targetBooks?.toString() || '')
      }
    } catch (error) {
      console.error('Error fetching goal:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGoal = async () => {
    if (!targetInput || parseInt(targetInput) < 1) return

    try {
      const response = await fetch('/api/user/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: currentYear,
          targetBooks: parseInt(targetInput),
        }),
      })

      if (response.ok) {
        fetchGoal()
        setEditMode(false)
      }
    } catch (error) {
      console.error('Error creating goal:', error)
    }
  }

  const handleUpdateGoal = async (targetBooks?: number, currentBooks?: number) => {
    try {
      const response = await fetch(`/api/user/goals?year=${currentYear}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(targetBooks !== undefined && { targetBooks }),
          ...(currentBooks !== undefined && { currentBooks }),
        }),
      })

      if (response.ok) {
        fetchGoal()
      }
    } catch (error) {
      console.error('Error updating goal:', error)
    }
  }

  if (loading) {
    return <div className="h-64 bg-gray-200 rounded-3xl animate-pulse" />
  }

  if (!goal) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-accent/10 to-purple-600/10 rounded-3xl p-8 border-2 border-accent/20 text-center"
      >
        <HiTrophy className="w-12 h-12 mx-auto text-accent/50 mb-4" />
        <h3 className="text-xl font-bold text-midnight mb-2">No Reading Goal Set</h3>
        <p className="text-midnight/60 mb-6">Set a target for how many books you want to read this year</p>
        
        {editMode ? (
          <div className="flex gap-2 max-w-xs mx-auto">
            <input
              type="number"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              placeholder="Number of books"
              min="1"
              max="1000"
              className="flex-1 px-4 py-2 rounded-xl border border-accent/20 focus:ring-2 focus:ring-accent outline-none"
              autoFocus
            />
            <button
              onClick={handleCreateGoal}
              className="px-4 py-2 bg-accent text-white rounded-xl font-semibold hover:bg-accent/90 transition"
            >
              Set Goal
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent/90 transition"
          >
            <HiPlus className="w-5 h-5" />
            Set Reading Goal
          </button>
        )}
      </motion.div>
    )
  }

  const percentage = (goal.currentBooks / goal.targetBooks) * 100
  const daysLeft = Math.ceil((365 - new Date().getDay()) / 7) * 7
  const booksPerMonth = goal.targetBooks / 12

  let motivationMessage = '💪 Keep going, you can do it!'
  let color = 'yellow-500'

  if (percentage < 25) {
    color = 'red-500'
  } else if (percentage < 50) {
    color = 'orange-500'
  } else if (percentage < 75) {
    color = 'yellow-500'
  } else if (percentage < 100) {
    color = 'green-500'
    motivationMessage = '✅ You\'re on track!'
  } else if (percentage === 100) {
    color = 'green-500'
    motivationMessage = '🎉 Goal completed!'
  } else {
    color = 'purple-500'
    motivationMessage = '🏆 Exceeded goal! Amazing!'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-lg p-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <HiTrophy className="w-8 h-8 text-accent" />
          <h3 className="text-2xl font-bold text-midnight">{currentYear} Reading Goal</h3>
        </div>
        <button
          onClick={() => setEditMode(!editMode)}
          className="text-sm px-4 py-2 text-accent hover:bg-accent/10 rounded-xl transition"
        >
          {editMode ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {editMode ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-midnight mb-2">
              Target Books
            </label>
            <input
              type="number"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              min="1"
              max="1000"
              className="w-full px-4 py-3 rounded-xl border border-midnight/10 focus:ring-2 focus:ring-accent outline-none"
            />
          </div>
          <button
            onClick={() => handleUpdateGoal(parseInt(targetInput))}
            className="w-full px-4 py-3 bg-accent text-white rounded-xl font-semibold hover:bg-accent/90 transition"
          >
            Save Changes
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-midnight">Progress</span>
              <span className="text-sm font-bold text-accent">{Math.round(percentage)}%</span>
            </div>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(percentage, 100)}%` }}
                className={`h-full bg-gradient-to-r from-${color} to-${color} transition-all duration-500`}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-accent">{goal.currentBooks}</div>
              <div className="text-xs text-midnight/60 mt-1">Books Read</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-midnight">{goal.targetBooks}</div>
              <div className="text-xs text-midnight/60 mt-1">Target</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-midnight">{goal.targetBooks - goal.currentBooks}</div>
              <div className="text-xs text-midnight/60 mt-1">Remaining</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-midnight">{booksPerMonth.toFixed(1)}</div>
              <div className="text-xs text-midnight/60 mt-1">Per Month</div>
            </div>
          </div>

          {/* Motivation Message */}
          <div className="text-center p-4 bg-gradient-to-r from-accent/10 to-purple-600/10 rounded-xl">
            <p className="text-lg font-semibold text-midnight">{motivationMessage}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                handleUpdateGoal(undefined, goal.currentBooks + 1)
              }}
              className="flex-1 px-4 py-2 border border-accent text-accent rounded-xl font-semibold hover:bg-accent/10 transition"
            >
              Mark Book Read
            </button>
            {goal.currentBooks > 0 && (
              <button
                onClick={() => {
                  handleUpdateGoal(undefined, goal.currentBooks - 1)
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-midnight rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Undo
              </button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}
