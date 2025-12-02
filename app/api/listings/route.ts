import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const location = searchParams.get('location') || ''

    const listings = await db.listing.findMany({
      where: {
        status: 'ACTIVE',
        ...(search && {
          OR: [
            { gymName: { contains: search, mode: 'insensitive' } },
            { membershipType: { contains: search, mode: 'insensitive' } },
          ]
        }),
        ...(location && {
          location: { contains: location, mode: 'insensitive' }
        })
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ listings })
  } catch (error) {
    console.error('Error fetching listings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const {
      gymName,
      membershipType,
      monthlyPrice,
      monthsRemaining,
      description,
      location,
    } = body

    if (!gymName || !membershipType || !monthlyPrice || !monthsRemaining || !description || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const totalPrice = monthlyPrice * monthsRemaining

    const listing = await db.listing.create({
      data: {
        userId: session.user.id,
        gymName,
        membershipType,
        monthlyPrice: parseFloat(monthlyPrice),
        monthsRemaining: parseInt(monthsRemaining),
        totalPrice,
        description,
        location,
        status: 'ACTIVE',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json({ listing }, { status: 201 })
  } catch (error) {
    console.error('Error creating listing:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
