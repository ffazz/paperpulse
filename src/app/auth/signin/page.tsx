'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { HiEnvelope, HiLockClosed, HiArrowRight } from 'react-icons/hi2'
import { Logo } from '@/components/Logo'

export default function SignIn() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else if (result?.ok) {
        router.push('/dashboard')
      } else {
        setError('Authentication failed')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const registered = searchParams.get('registered')

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/10 via-blue-50 to-ghost flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center flex justify-center">
          <Logo variant="main" size={80} clickable={false} />
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-midnight mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">Sign in to your PaperPulse account</p>
        </div>

        {/* Success Message */}
        {registered && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">
              Account created successfully! Please sign in with your credentials.
            </p>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-midnight mb-2">Email</label>
              <div className="relative">
                <HiEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 sm:py-3.5 md:py-4 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-midnight mb-2">Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full pl-12 pr-4 py-3 sm:py-3.5 md:py-4 rounded-xl border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm sm:text-base">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-accent to-blue-600 text-white font-semibold py-3 sm:py-3.5 md:py-4 rounded-xl hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <HiArrowRight className="w-5 h-5" />}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 sm:my-8 flex items-center gap-4">
            <div className="h-px bg-gray-200 flex-1" />
            <p className="text-gray-500 text-xs sm:text-sm">New to PaperPulse?</p>
            <div className="h-px bg-gray-200 flex-1" />
          </div>

          {/* Sign Up Link */}
          <Link
            href="/auth/signup"
            className="block w-full text-center py-3 sm:py-3.5 md:py-4 rounded-xl border-2 border-accent text-accent font-semibold hover:bg-accent hover:text-white transition-colors"
          >
            Create Account
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-xs sm:text-sm text-gray-600 mt-6 sm:mt-8">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
