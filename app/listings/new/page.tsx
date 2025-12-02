'use client'

import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { useSession } from 'next-auth/react'

export default function NewListingPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!session) {
    router.push('/login')
    return null
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = {
      gymName: formData.get('gymName'),
      membershipType: formData.get('membershipType'),
      monthlyPrice: formData.get('monthlyPrice'),
      monthsRemaining: formData.get('monthsRemaining'),
      description: formData.get('description'),
      location: formData.get('location'),
    }

    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const result = await res.json()
        setError(result.error || 'Something went wrong')
        return
      }

      const { listing } = await res.json()
      router.push(`/listings/${listing.id}`)
    } catch (error) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            List Your Gym Membership
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="gymName" className="block text-sm font-medium text-gray-700">
                Gym Name
              </label>
              <input
                type="text"
                name="gymName"
                id="gymName"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                placeholder="e.g., Planet Fitness, Gold's Gym"
              />
            </div>

            <div>
              <label htmlFor="membershipType" className="block text-sm font-medium text-gray-700">
                Membership Type
              </label>
              <input
                type="text"
                name="membershipType"
                id="membershipType"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                placeholder="e.g., Premium, Basic, All-Access"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="monthlyPrice" className="block text-sm font-medium text-gray-700">
                  Monthly Price ($)
                </label>
                <input
                  type="number"
                  name="monthlyPrice"
                  id="monthlyPrice"
                  required
                  step="0.01"
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                  placeholder="49.99"
                />
              </div>

              <div>
                <label htmlFor="monthsRemaining" className="block text-sm font-medium text-gray-700">
                  Months Remaining
                </label>
                <input
                  type="number"
                  name="monthsRemaining"
                  id="monthsRemaining"
                  required
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                  placeholder="6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                name="location"
                id="location"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                placeholder="e.g., New York, NY"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                required
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                placeholder="Describe your membership, why you're selling, etc."
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Listing'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
