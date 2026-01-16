'use client'

import { useActionState } from 'react'
import { setupUserProfile } from '@/app/auth/actions'
import { User, Phone, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function UserSetupPage() {
  const router = useRouter()
  const [state, action, isPending] = useActionState(setupUserProfile, { error: '', success: false })
  const [userData, setUserData] = useState<{ full_name: string; email: string; phone: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUserProfile = async () => {
      try {
        const supabase = createClient()
        const { data: { user: authUser } } = await supabase.auth.getUser()

        if (!authUser) {
          router.push('/login')
          return
        }

        const { data: user } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single()

        if (user) {
          setUserData(user)
        }

        setLoading(false)
      } finally {
        // Error handling if needed
      }
    }

    checkUserProfile()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {userData?.phone ? 'Update Your Profile' : 'Complete Your Profile'}
            </h1>
            <p className="text-gray-600 mt-2">
              {userData?.phone ? 'Edit your personal details' : 'Add your details to get started'}
            </p>
          </div>
          {userData?.phone && (
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Dashboard
            </button>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {state.error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-medium">{state.error}</p>
              </div>
            )}

            {state.success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-medium">
                  Profile updated! Redirecting to dashboard...
                </p>
              </div>
            )}

            <form action={action} className="space-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="full_name" className="block text-sm font-semibold text-slate-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name *
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="e.g., John Doe"
                  defaultValue={userData?.full_name || ''}
                  required
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  disabled
                  defaultValue={userData?.email || ''}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="e.g., +91 98765 43210"
                  defaultValue={userData?.phone || ''}
                  required
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
                <p className="text-xs text-slate-500 mt-1">We&apos;ll use this for order notifications</p>
              </div>

              {/* Role (Read-only) */}
              <div>
                <label htmlFor="role" className="block text-sm font-semibold text-slate-700 mb-2">
                  Account Type
                </label>
                <input
                  id="role"
                  type="text"
                  disabled
                  value={userData?.role ? userData.role.charAt(0).toUpperCase() + userData.role.slice(1) : 'Student'}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 cursor-not-allowed"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold rounded-lg transition shadow-lg shadow-blue-600/20"
                >
                  {isPending ? 'Saving...' : userData?.phone ? 'Update Profile' : 'Complete Setup'}
                </button>
                {userData?.phone && (
                  <button
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold rounded-lg transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <p className="text-sm text-slate-600 mt-6 text-center">
              * Required fields
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
