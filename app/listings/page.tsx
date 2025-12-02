'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ListingWithUser } from '@/types'

export default function ListingsPage() {
  const [listings, setListings] = useState<ListingWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')

  async function fetchListings() {
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (location) params.append('location', location)

      const res = await fetch(`/api/listings?${params}`)
      const data = await res.json()
      setListings(data.listings)
    } catch (error) {
      console.error('Error fetching listings:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchListings()
  }, [search, location])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Browse Gym Memberships
          </h1>
          <Link
            href="/listings/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            List Your Membership
          </Link>
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Gym name or membership type..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, State..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading listings...</div>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-gray-600">No listings found</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {listing.gymName}
                  </h2>
                  <p className="text-sm text-gray-600">{listing.membershipType}</p>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold text-blue-600">
                      ${listing.totalPrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">
                      (${listing.monthlyPrice}/mo)
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {listing.monthsRemaining} months remaining
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {listing.description}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Location:</span> {listing.location}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    <span className="font-medium">Seller:</span> {listing.user.name || listing.user.email}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
