import { Listing, Transaction, User } from '@prisma/client'

export type ListingWithUser = Listing & {
  user: User
}

export type TransactionWithDetails = Transaction & {
  listing: Listing
  buyer: User
  seller: User
}
