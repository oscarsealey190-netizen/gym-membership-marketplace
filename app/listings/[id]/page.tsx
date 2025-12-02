'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ListingWithUser } from '@/types'

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [listing, setListing] = useState<ListingWithUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    async function fetchListing() {
      try {
        const res = await fetch(`/api/listings/${params.id}`)
        if (res.ok) {
          const data = await res.json()
          setListing(data.listing)
        }
      } catch (error) {
        console.error('Error fetching listing:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchListing()
  }, [params.id])

  async function handlePurchase() {
    if (!session) {
      router.push('/login')
      return
    }

    setPurchasing(true)

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: params.id }),
      })

      const { url } = await res.json()

      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert('Failed to start checkout')
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Listing not found</div>
      </div>
    )
  }

  const isOwner = session?.user?.id === listing.userId

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {listing.gymName}
              </h1>
              <p className="text-lg text-gray-600">{listing.membershipType}</p>
            </div>

            <div className="border-t border-b py-6 mb-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Price</p>
                  <p className="text-3xl font-bold text-blue-600">
                    ${listing.totalPrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Monthly Rate</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    ${listing.monthlyPrice.toFixed(2)}/mo
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Months Remaining</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {listing.monthsRemaining} months
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p className="text-lg text-gray-900">{listing.location}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Description
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {listing.description}
              </p>
            </div>

            <div className="border-t pt-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Seller Information
              </h2>
              <p className="text-gray-700">
                <span className="font-medium">Name:</span> {listing.user.name || 'Not provided'}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Email:</span> {listing.user.email}
              </p>
            </div>

            {listing.status === 'SOLD' && (
              <div className="bg-gray-100 border border-gray-300 rounded-md p-4 mb-6">
                <p className="text-gray-700 font-medium">This listing has been sold</p>
              </div>
            )}

            {listing.status === 'PENDING' && (
              <div className="bg-yellow-50 border border-yellow-300 rounded-md p-4 mb-6">
                <p className="text-yellow-800 font-medium">This listing has a pending transaction</p>
              </div>
            )}

            <div className="flex gap-4">
              {!isOwner && listing.status === 'ACTIVE' && (
                <button
                  onClick={handlePurchase}
                  disabled={purchasing}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {purchasing ? 'Processing...' : 'Buy Now'}
                </button>
              )}
              {isOwner && (
                <div className="flex-1 bg-gray-100 text-gray-600 px-6 py-3 rounded-md font-medium text-center">
                  This is your listing
                </div>
              )}
              <button
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
