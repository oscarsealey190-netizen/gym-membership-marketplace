import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const { transactionId, listingId } = session.metadata!

        // Update transaction status
        await db.transaction.update({
          where: { id: transactionId },
          data: { status: 'COMPLETED' }
        })

        // Update listing status
        await db.listing.update({
          where: { id: listingId },
          data: { status: 'SOLD' }
        })

        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        const { transactionId, listingId } = session.metadata!

        // Update transaction status
        await db.transaction.update({
          where: { id: transactionId },
          data: { status: 'FAILED' }
        })

        // Set listing back to active
        await db.listing.update({
          where: { id: listingId },
          data: { status: 'ACTIVE' }
        })

        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
