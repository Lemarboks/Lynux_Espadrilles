'use client'

import Link from 'next/link'
import { useWishlist } from '@/app/context/WishlistContext'
import ProductCard from '@/components/shop/ProductCard'

export default function WishlistPage() {
  const { wishlistItems, wishlistCount } = useWishlist()

  return (
    <div className="pt-20 lg:pt-24 min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h1 className="font-cormorant font-semibold text-4xl lg:text-5xl text-ink mb-2">My Wishlist</h1>
          <p className="font-dm text-sm text-ink-light">
            {wishlistCount} saved style{wishlistCount !== 1 ? 's' : ''}
          </p>
        </div>

        {wishlistCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#C8A97E" strokeWidth="1.2" className="mb-6">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <h2 className="font-cormorant font-semibold text-3xl text-ink mb-3">Your wishlist is empty</h2>
            <p className="font-dm text-sm text-ink-light mb-8 max-w-sm">
              Save your favourite styles to find them later.
            </p>
            <Link
              href="/shop"
              className="inline-block font-dm text-sm font-medium bg-clay hover:bg-clay-dark text-cream px-10 py-3.5 transition-all duration-300 tracking-wide"
            >
              Browse Collection
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
              {wishlistItems.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center">
              <Link
                href="/shop"
                className="inline-block font-dm text-sm font-medium border border-ink text-ink hover:bg-ink hover:text-cream px-10 py-3.5 transition-all duration-300 tracking-wide"
              >
                Continue Shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
