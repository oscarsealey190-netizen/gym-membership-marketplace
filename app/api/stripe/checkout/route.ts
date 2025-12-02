import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { listingId } = await req.json()

    if (!listingId) {
      return NextResponse.json(
        { error: 'Missing listing ID' },
        { status: 400 }
      )
    }

    const listing = await db.listing.findUnique({
      where: { id: listingId },
      include: { user: true }
    })

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      )
    }

    if (listing.userId === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot purchase your own listing' },
        { status: 400 }
      )
    }

    if (listing.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Listing is not available' },
        { status: 400 }
      )
    }

    // Create transaction record
    const transaction = await db.transaction.create({
      data: {
        listingId: listing.id,
        buyerId: session.user.id,
        sellerId: listing.userId,
        amount: listing.totalPrice,
        status: 'PENDING',
      }
    })

    // Update listing status to pending
    await db.listing.update({
      where: { id: listingId },
      data: { status: 'PENDING' }
    })

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(listing.totalPrice * 100),
            product_data: {
              name: `${listing.gymName} - ${listing.membershipType}`,
              description: `${listing.monthsRemaining} months remaining`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        transactionId: transaction.id,
        listingId: listing.id,
        buyerId: session.user.id,
        sellerId: listing.userId,
      },
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/listings/${listingId}?canceled=true`,
    })

    // Update transaction with Stripe payment intent ID
    await db.transaction.update({
      where: { id: transaction.id },
      data: { stripePaymentIntentId: checkoutSession.id }
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
