'use client'

import { useActionState } from 'react'
import { setupShop } from '@/app/auth/actions'
import { Store, MapPin, DollarSign } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function ShopSetupPage() {
  const router = useRouter()
  const [state, action, isPending] = useActionState(setupShop, { error: '', success: false })
  const [shopData, setShopData] = useState<{ id: string; name: string; location: string; bw_price: number; color_price: number; spiral_price: number; lamination_price: number } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkExistingShop = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          router.push('/login')
          return
        }

        const { data: shop } = await supabase
          .from('shops')
          .select('*')
          .eq('owner_id', user.id)
          .single()

        if (shop) {
          setShopData(shop)
        }

        setLoading(false)
      } finally {
        // Error handling if needed
      }
    }

    checkExistingShop()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {shopData ? 'Update Your Shop' : 'Complete Your Shop Setup'}
            </h1>
            <p className="text-gray-600 mt-2">
              {shopData ? 'Edit your shop details' : 'Add your shop details to get started'}
            </p>
          </div>
          {shopData && (
            <button
              onClick={() => router.push('/shop/dashboard')}
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
                  {shopData ? 'Shop updated successfully! Redirecting...' : 'Shop setup complete! Redirecting...'}
                </p>
              </div>
            )}

            <form action={action} className="space-y-6">
              {/* Shop Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                  <Store className="w-4 h-4 inline mr-2" />
                  Shop Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g., Quick Print Services"
                  defaultValue={shopData?.name || ''}
                  required
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-slate-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Shop Location *
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="e.g., Hostel Block A, Campus Road"
                  defaultValue={shopData?.location || ''}
                  required
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              {/* Pricing Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Pricing
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* B/W Price */}
                  <div>
                    <label htmlFor="bw_price" className="block text-sm font-semibold text-slate-700 mb-2">
                      B&W Price per page (₹) *
                    </label>
                    <input
                      id="bw_price"
                      name="bw_price"
                      type="number"
                      step="0.5"
                      placeholder="e.g., 2.5"
                      defaultValue={shopData?.bw_price || ''}
                      required
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>

                  {/* Color Price */}
                  <div>
                    <label htmlFor="color_price" className="block text-sm font-semibold text-slate-700 mb-2">
                      Color Price per page (₹) *
                    </label>
                    <input
                      id="color_price"
                      name="color_price"
                      type="number"
                      step="0.5"
                      placeholder="e.g., 8"
                      defaultValue={shopData?.color_price || ''}
                      required
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>

                  {/* Spiral Binding Price */}
                  <div>
                    <label htmlFor="spiral_price" className="block text-sm font-semibold text-slate-700 mb-2">
                      Spiral Binding (₹) *
                    </label>
                    <input
                      id="spiral_price"
                      name="spiral_price"
                      type="number"
                      step="0.5"
                      placeholder="e.g., 50"
                      defaultValue={shopData?.spiral_price || ''}
                      required
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>

                  {/* Lamination Price */}
                  <div>
                    <label htmlFor="lamination_price" className="block text-sm font-semibold text-slate-700 mb-2">
                      Lamination (₹) *
                    </label>
                    <input
                      id="lamination_price"
                      name="lamination_price"
                      type="number"
                      step="0.5"
                      placeholder="e.g., 20"
                      defaultValue={shopData?.lamination_price || ''}
                      required
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold rounded-lg transition shadow-lg shadow-blue-600/20"
                >
                  {isPending ? 'Saving...' : shopData ? 'Update Shop' : 'Complete Setup'}
                </button>
                {shopData && (
                  <button
                    type="button"
                    onClick={() => router.push('/shop/dashboard')}
                    className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold rounded-lg transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <p className="text-sm text-slate-600 mt-6 text-center">
              * All fields are required
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
