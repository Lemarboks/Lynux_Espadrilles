'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { useWishlist } from '@/app/context/WishlistContext'
import Toast, { useToast } from '@/components/ui/Toast'

interface ProductCardProps {
  product: Product
  imageHeight?: number
}

const formatPrice = (price: number): string =>
  'R' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const LIGHT_COLOURS = ['Ivory', 'White', 'Nude', 'Baby Pink']

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <svg key={star} width="12" height="12" viewBox="0 0 24 24"
          fill={star <= Math.round(rating) ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth="1.5" className="text-clay">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  )
}

export default function ProductCard({ product, imageHeight }: ProductCardProps) {
  const MAX_SWATCHES = 5
  const hasColours = product.colours && product.colours.length > 0
  const visibleColours = hasColours ? product.colours.slice(0, MAX_SWATCHES) : []
  const extraCount = hasColours ? product.colours.length - MAX_SWATCHES : 0

  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState<{ rx: number; ry: number } | null>(null)
  const [heartScale, setHeartScale] = useState(1)

  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const { toast, showToast } = useToast()
  const inWishlist = isInWishlist(product.id)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const rx = (((e.clientY - rect.top) - rect.height / 2) / (rect.height / 2)) * -8
    const ry = (((e.clientX - rect.left) - rect.width / 2) / (rect.width / 2)) * 8
    setTilt({ rx, ry })
  }

  const handleHeartClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setHeartScale(1.3)
    setTimeout(() => setHeartScale(1), 200)
    if (inWishlist) {
      removeFromWishlist(product.id)
      showToast('Removed from wishlist')
    } else {
      addToWishlist(product)
      showToast(`${product.name} added to wishlist`)
    }
  }

  return (
    <>
      <Link href={`/product/${product.slug}`} className="group block">
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setTilt(null)}
          style={{
            transformStyle: 'preserve-3d',
            transform: tilt
              ? `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(1.02)`
              : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
            transition: tilt ? 'transform 0.1s ease' : 'transform 0.5s ease',
            willChange: 'transform',
          }}
        >
          <div
            className="overflow-hidden bg-sand"
            style={imageHeight
              ? { position: 'relative', height: imageHeight }
              : { position: 'relative', aspectRatio: '1 / 1' }
            }
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-all duration-300 flex items-end justify-center pb-6">
              <span className="font-dm text-xs tracking-widest uppercase text-cream bg-ink/80 px-6 py-2.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                View Product
              </span>
            </div>

            {/* Heart button */}
            <button
              onClick={handleHeartClick}
              title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              aria-label={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              style={{
                position: 'absolute', top: 12, right: 12,
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(255,255,255,0.90)',
                backdropFilter: 'blur(4px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', cursor: 'pointer',
                transform: `scale(${heartScale})`,
                transition: 'transform 200ms ease',
                zIndex: 5,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24"
                fill={inWishlist ? '#E53E3E' : 'none'}
                stroke={inWishlist ? '#E53E3E' : '#9E9693'}
                strokeWidth="1.8">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>

          <div className="pt-4 pb-2">
            <h3 className="font-cormorant font-semibold text-lg text-ink tracking-wide mb-1">
              {product.name}
            </h3>
            {product.rating && (
              <div className="flex items-center gap-2 mb-1">
                <StarRating rating={product.rating} />
                <span className="font-dm text-xs text-ink-light">({product.reviewCount})</span>
              </div>
            )}
            <p className="font-dm text-sm text-ink-mid">
              {product.priceRange
                ? `${formatPrice(product.priceRange.min)} – ${formatPrice(product.priceRange.max)}`
                : formatPrice(product.price)
              }
            </p>
            {hasColours && (
              <div className="mt-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {visibleColours.map(colour => {
                    const isLight = LIGHT_COLOURS.includes(colour.name)
                    return (
                      <span key={colour.name} title={colour.name} style={{
                        display: 'inline-block', width: '14px', height: '14px',
                        borderRadius: '50%',
                        background: colour.hex
                          ? colour.hex
                          : 'conic-gradient(#FF6B6B, #FFD93D, #6BCB77, #4D96FF, #C77DFF, #FF6B6B)',
                        border: isLight ? '1px solid #E0D8CC' : 'none',
                        flexShrink: 0,
                      }} />
                    )
                  })}
                  {extraCount > 0 && (
                    <span className="font-dm text-ink-light" style={{ fontSize: '12px' }}>+{extraCount} more</span>
                  )}
                </div>
                <p className="font-dm text-ink-light mt-0.5" style={{ fontSize: '11px' }}>
                  {product.colours.length} colour{product.colours.length !== 1 ? 's' : ''} available
                </p>
              </div>
            )}
          </div>
        </div>
      </Link>
      <Toast message={toast.message} visible={toast.visible} />
    </>
  )
}
