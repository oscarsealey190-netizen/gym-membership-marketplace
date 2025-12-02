'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ListingWithUser, TransactionWithDetails } from '@/types'

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [myListings, setMyListings] = useState<ListingWithUser[]>([])
  const [myPurchases, setMyPurchases] = useState<TransactionWithDetails[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchDashboardData()
    }
  }, [status, router])

  async function fetchDashboardData() {
    try {
      const res = await fetch('/api/dashboard')
      const data = await res.json()
      setMyListings(data.listings || [])
      setMyPurchases(data.purchases || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome, {session?.user?.name || session?.user?.email}!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Listings */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">My Listings</h2>
              <Link
                href="/listings/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
              >
                + New Listing
              </Link>
            </div>

            <div className="space-y-4">
              {myListings.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow text-center text-gray-600">
                  No listings yet
                </div>
              ) : (
                myListings.map((listing) => (
                  <div key={listing.id} className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {listing.gymName}
                        </h3>
                        <p className="text-sm text-gray-600">{listing.membershipType}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          listing.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : listing.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {listing.status}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Price:</span> ${listing.totalPrice.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Location:</span> {listing.location}
                      </p>
                    </div>
                    <div className="mt-4">
                      <Link
                        href={`/listings/${listing.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* My Purchases */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">My Purchases</h2>
            <div className="space-y-4">
              {myPurchases.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow text-center text-gray-600">
                  No purchases yet
                </div>
              ) : (
                myPurchases.map((transaction) => (
                  <div key={transaction.id} className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {transaction.listing.gymName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {transaction.listing.membershipType}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          transaction.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : transaction.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Amount Paid:</span> ${transaction.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Seller:</span> {transaction.seller.name || transaction.seller.email}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Date:</span>{' '}
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {transaction.status === 'COMPLETED' && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-800">
                          <span className="font-medium">Contact Seller:</span> {transaction.seller.email}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
