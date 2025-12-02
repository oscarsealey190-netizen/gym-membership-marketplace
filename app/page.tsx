import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
            Turn Your Unused Gym Membership Into Cash
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Stop wasting money on gym memberships you don&apos;t use. Sell them to people who want to save money on gym access.
          </p>

          <div className="flex gap-4 justify-center mb-16">
            <Link
              href="/listings"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors"
            >
              Browse Memberships
            </Link>
            <Link
              href="/listings/new"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium text-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Sell Your Membership
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Recover Your Money
              </h3>
              <p className="text-gray-600">
                Get back what you paid for that membership you&apos;re not using
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🏋️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Save on Memberships
              </h3>
              <p className="text-gray-600">
                Buy discounted gym memberships from other members
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Secure Payments
              </h3>
              <p className="text-gray-600">
                Safe and secure transactions powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
