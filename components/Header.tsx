'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-blue-600">
              GymSwap
            </Link>
            <div className="hidden md:flex gap-6">
              <Link
                href="/listings"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Browse
              </Link>
              {session && (
                <Link
                  href="/listings/new"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Sell
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
