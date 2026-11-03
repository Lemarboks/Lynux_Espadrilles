'use client'

import Link from 'next/link'
import { useWishlist } from '@/app/context/WishlistContext'
import ProductCard from '@/components/shop/ProductCard'

export default function WishlistPage() {
  const { wishlistItems, wishlistCount } = useWishlist()

  return (
    <section className="lx-liked-page lx-container font-dm">
      <p className="lx-eyebrow">Your favourites</p>
      <h1 className="lx-page-title">
        Liked items
        {wishlistCount > 0 && <span className="lx-liked-total"> ({wishlistCount} {wishlistCount === 1 ? 'style' : 'styles'})</span>}
      </h1>

      {wishlistCount === 0 ? (
        <div className="lx-liked-empty">
          <p>You haven&rsquo;t liked any styles yet. Tap the heart on a style to save it here.</p>
          <Link href="/shop" className="lx-button">Discover the collection</Link>
        </div>
      ) : (
        <div className="lx-liked-grid">
          {wishlistItems.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      )}

      <style>{`
        .lx-liked-page { min-height: 55vh; padding: 72px 0 100px; }
        .lx-liked-page .lx-page-title { font-size: clamp(42px, 5vw, 62px); }
        .lx-liked-total { color: var(--color-ink-light); font-family: var(--font-dm), sans-serif; font-size: 11px; }
        .lx-liked-empty { display: flex; flex-direction: column; align-items: flex-start; gap: 20px; padding: 40px 0; color: var(--color-ink-light); font-size: 13px; }
        .lx-liked-empty p { margin: 0; }
        .lx-liked-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 26px 15px; margin-top: 37px; }
        @media (max-width: 950px) { .lx-liked-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
        @media (max-width: 680px) {
          .lx-liked-page { padding: 40px 0 70px; }
          .lx-liked-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 22px 11px; }
        }
      `}</style>
    </section>
  )
}
