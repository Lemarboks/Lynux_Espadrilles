'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { useWishlist } from '@/app/context/WishlistContext'
import Toast, { useToast } from '@/components/ui/Toast'
import { img } from '@/lib/image'

interface ProductCardProps {
  product: Product
}

const formatPrice = (price: number): string =>
  'R' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const MAX_SWATCHES = 5

export default function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const { toast, showToast } = useToast()
  const inWishlist = isInWishlist(product.id)

  const handleHeartClick = () => {
    if (inWishlist) {
      removeFromWishlist(product.id)
      showToast('Removed from liked items')
    } else {
      addToWishlist(product)
      showToast(`${product.name} added to liked items`)
    }
  }

  return (
    <article className="lx-card font-dm">
      <Link href={`/product/${product.slug}`} className="lx-card-image" aria-label={`View ${product.name}`}>
        <Image
          src={img(product.image)}
          alt={product.name}
          fill
          sizes="(max-width: 680px) 50vw, (max-width: 950px) 33vw, 25vw"
        />
        <span className="lx-card-label">View the style</span>
      </Link>
      <button
        type="button"
        className="lx-like"
        onClick={handleHeartClick}
        aria-pressed={inWishlist}
        aria-label={`${inWishlist ? 'Remove' : 'Add'} ${product.name} ${inWishlist ? 'from' : 'to'} liked items`}
      >
        <svg viewBox="0 0 24 24" aria-hidden><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z" /></svg>
      </button>
      <div className="lx-card-meta">
        <h3>{product.name}</h3>
        <p>
          {product.priceRange
            ? `${formatPrice(product.priceRange.min)} – ${formatPrice(product.priceRange.max)}`
            : formatPrice(product.price)}
        </p>
        {product.colours.length > 0 && (
          <div className="lx-swatches" aria-label={`${product.colours.length} ${product.colours.length === 1 ? 'colour' : 'colours'}`}>
            {product.colours.slice(0, MAX_SWATCHES).map(colour => (
              <span
                key={colour.name}
                title={colour.name}
                style={{ background: colour.hex ?? 'conic-gradient(#BD8D66, #D1C6A9, #77816A, #BD8D66)' }}
              />
            ))}
          </div>
        )}
      </div>
      <Toast message={toast.message} visible={toast.visible} />
    </article>
  )
}
