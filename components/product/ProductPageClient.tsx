'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getProductBySlug } from '@/lib/products'
import { useCart } from '@/app/context/CartContext'
import { useWishlist } from '@/app/context/WishlistContext'
import Toast, { useToast } from '@/components/ui/Toast'
import { img } from '@/lib/image'

const formatPrice = (price: number): string =>
  'R' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const SIZE_CHART = [
  { sa: 3, eu: 36, length: '22.5cm' },
  { sa: 4, eu: 37, length: '23.5cm' },
  { sa: 5, eu: 38, length: '24.5cm' },
  { sa: 6, eu: 39, length: '25.5cm' },
  { sa: 7, eu: 40, length: '26cm' },
  { sa: 8, eu: 41, length: '26.5cm' },
  { sa: 9, eu: 42, length: '27cm' },
]

function SizeGuideModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="lx-dialog-backdrop" onClick={onClose}>
      <div className="lx-dialog font-dm" role="dialog" aria-modal="true" aria-labelledby="size-guide-title" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="lx-dialog-close" aria-label="Close size guide">×</button>
        <p className="lx-eyebrow">Find your fit</p>
        <h2 id="size-guide-title" className="font-cormorant">Size guide</h2>
        <p>Measure your foot from heel to toe. If you are between sizes, size up.</p>
        <table className="lx-size-table">
          <thead><tr><th>SA</th><th>EU</th><th>Foot length</th></tr></thead>
          <tbody>
            {SIZE_CHART.map(({ sa, eu, length }) => (
              <tr key={sa}><td>{sa}</td><td>{eu}</td><td>{length}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function ProductPageClient({ slug }: { slug: string }) {
  const product = getProductBySlug(slug)

  const [mainImage, setMainImage] = useState<string>(product?.images[0] ?? '')
  const [selectedSize, setSelectedSize] = useState<number | null>(null)
  const [selectedJute, setSelectedJute] = useState<string | null>(null)
  const [selectedToe, setSelectedToe] = useState<string | null>(null)
  const [selectedColour, setSelectedColour] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const { addToCart } = useCart()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const { toast, showToast } = useToast()
  const router = useRouter()

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="font-dm text-sm text-ink-light">Product not found.</p>
      </div>
    )
  }

  const needsJute = product.juteOptions.length > 0
  const needsToe = product.toeOptions.length > 0
  const needsColour = product.colours.length > 0
  const liked = isInWishlist(product.id)

  const isComplete =
    selectedSize !== null &&
    (!needsJute || selectedJute !== null) &&
    (!needsToe || selectedToe !== null) &&
    (!needsColour || selectedColour !== null)

  const missingText = (() => {
    const missing: string[] = []
    if (!selectedSize) missing.push('size')
    if (needsJute && !selectedJute) missing.push('sole style')
    if (needsToe && !selectedToe) missing.push('toe style')
    if (needsColour && !selectedColour) missing.push('colour')
    if (!missing.length) return null
    const list = missing.length > 1 ? `${missing.slice(0, -1).join(', ')} and ${missing[missing.length - 1]}` : missing[0]
    return `Select your ${list} to continue.`
  })()

  const addSelection = () => {
    const colourImage = product.colours.find(c => c.name === selectedColour)?.image ?? null
    addToCart(product, selectedSize!, selectedColour ?? '', selectedJute ?? '', selectedToe ?? '', quantity, colourImage)
  }

  const handleAddToCart = () => {
    if (!isComplete) return
    addSelection()
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleBuyNow = () => {
    if (!isComplete) return
    addSelection()
    router.push('/checkout')
  }

  const toggleLiked = () => {
    if (liked) {
      removeFromWishlist(product.id)
      showToast('Removed from liked items')
    } else {
      addToWishlist(product)
      showToast(`${product.name} added to liked items`)
    }
  }

  return (
    <>
      {showSizeGuide && <SizeGuideModal onClose={() => setShowSizeGuide(false)} />}
      <Toast message={toast.message} visible={toast.visible} />

      <section className="lx-product-page lx-container font-dm">
        <nav className="lx-breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link><span aria-hidden>/</span>
          <Link href="/shop">The Collection</Link><span aria-hidden>/</span>
          <span>{product.name}</span>
        </nav>

        <div className="lx-product-layout">
          <div className="lx-gallery">
            {product.images.length > 1 && (
              <div className="lx-gallery-thumbs">
                {product.images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    className="lx-gallery-thumb"
                    aria-current={mainImage === src}
                    aria-label={`Show image ${i + 1}`}
                    onClick={() => setMainImage(src)}
                  >
                    <Image src={img(src)} alt="" fill sizes="78px" />
                  </button>
                ))}
              </div>
            )}
            <div className="lx-gallery-main">
              {mainImage && <Image src={img(mainImage)} alt={product.name} fill priority sizes="(max-width: 900px) 100vw, 55vw" />}
            </div>
          </div>

          <div className="lx-product-info">
            <p className="lx-eyebrow">Lynux collection</p>
            <div className="lx-product-title">
              <h1 className="font-cormorant">{product.name}</h1>
              <button type="button" className="lx-like lx-like-large" onClick={toggleLiked} aria-pressed={liked}
                aria-label={`${liked ? 'Remove' : 'Add'} ${product.name} ${liked ? 'from' : 'to'} liked items`}>
                <svg viewBox="0 0 24 24" aria-hidden><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z" /></svg>
              </button>
            </div>
            <p className="lx-product-price">
              {product.priceRange
                ? `${formatPrice(product.priceRange.min)} – ${formatPrice(product.priceRange.max)}`
                : formatPrice(product.price)}
            </p>
            <p className="lx-product-description">{product.description}</p>
            <ul className="lx-product-facts">
              {product.features.map(f => <li key={f}>{f}</li>)}
            </ul>

            <div className="lx-option-group">
              <div className="lx-option-heading">
                <span>Size</span>
                <button type="button" onClick={() => setShowSizeGuide(true)}>View size guide</button>
              </div>
              <div className="lx-option-row">
                {product.sizes.map(size => (
                  <button key={size} type="button" className="lx-chip lx-chip-round" aria-pressed={selectedSize === size} onClick={() => setSelectedSize(size)}>{size}</button>
                ))}
              </div>
            </div>

            {needsJute && (
              <div className="lx-option-group">
                <div className="lx-option-heading"><span>Sole style</span></div>
                <div className="lx-option-row">
                  {product.juteOptions.map(opt => (
                    <button key={opt} type="button" className="lx-chip" aria-pressed={selectedJute === opt} onClick={() => setSelectedJute(opt)}>{opt}</button>
                  ))}
                </div>
              </div>
            )}

            {needsToe && (
              <div className="lx-option-group">
                <div className="lx-option-heading"><span>Toe style</span></div>
                <div className="lx-option-row">
                  {product.toeOptions.map(opt => (
                    <button key={opt} type="button" className="lx-chip" aria-pressed={selectedToe === opt} onClick={() => setSelectedToe(opt)}>{opt}</button>
                  ))}
                </div>
              </div>
            )}

            {needsColour && (
              <div className="lx-option-group">
                <div className="lx-option-heading"><span>Colour</span></div>
                <div className="lx-option-row">
                  {product.colours.map(colour => (
                    <button
                      key={colour.name}
                      type="button"
                      className="lx-colour-chip"
                      title={colour.name}
                      aria-label={colour.name}
                      aria-pressed={selectedColour === colour.name}
                      style={{ background: colour.hex ?? 'conic-gradient(#BD8D66, #D1C6A9, #77816A, #BD8D66)' }}
                      onClick={() => {
                        setSelectedColour(colour.name)
                        if (colour.image) setMainImage(colour.image)
                      }}
                    />
                  ))}
                </div>
                <p className="lx-option-note">{selectedColour ?? 'Select a colour'}</p>
              </div>
            )}

            <div className="lx-option-group">
              <div className="lx-option-heading"><span>Quantity</span></div>
              <div className="lx-qty">
                <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
                <span>{quantity}</span>
                <button type="button" onClick={() => setQuantity(q => q + 1)} aria-label="Increase quantity">+</button>
              </div>
            </div>

            {missingText && <p className="lx-missing">{missingText}</p>}

            <div className="lx-product-actions">
              <button type="button" className="lx-button" disabled={!isComplete} onClick={handleAddToCart}>
                {addedToCart ? 'Added to bag ✓' : 'Add to bag'}
              </button>
              <button type="button" className="lx-button lx-button-outline" disabled={!isComplete} onClick={handleBuyNow}>
                Buy now
              </button>
            </div>

            <div className="lx-purchase-note">
              <span>Handcrafted to order</span>
              <span>R65 flat-rate delivery</span>
              <span>Free defect exchange</span>
            </div>
          </div>
        </div>

        <div className="lx-product-additional">
          <details className="lx-accordion">
            <summary>Description</summary>
            <p>{product.description}</p>
          </details>
          <details className="lx-accordion">
            <summary>Shipping &amp; Returns</summary>
            <p>Every pair is handcrafted to order and delivered anywhere in South Africa for a flat R65. Manufacturing defects are exchanged free of charge.</p>
            <p><Link href="/returns" className="lx-text-link">Read the returns policy ↗</Link></p>
          </details>
        </div>
      </section>

      <style>{`
        .lx-product-page { padding: 22px 0 90px; }
        .lx-breadcrumbs { display: flex; gap: 9px; margin: 0 0 17px; color: var(--color-ink-light); font-size: 10px; letter-spacing: 0.04em; }
        .lx-breadcrumbs a:hover { color: var(--color-ink); }
        .lx-product-layout { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(340px, 0.8fr); gap: clamp(28px, 5vw, 72px); align-items: start; }
        .lx-gallery { display: grid; grid-template-columns: 55px minmax(0, 1fr); gap: 9px; }
        .lx-gallery-thumbs { display: flex; flex-direction: column; gap: 7px; }
        .lx-gallery-thumb { position: relative; aspect-ratio: 1; padding: 0; overflow: hidden; border: 1px solid transparent; border-radius: 2px; background: #E8D4C7; cursor: pointer; }
        .lx-gallery-thumb[aria-current="true"] { border-color: var(--color-ink); }
        .lx-gallery-thumb img, .lx-gallery-main img { object-fit: cover; }
        .lx-gallery-main { position: relative; grid-column: 2; aspect-ratio: 1.08; overflow: hidden; border-radius: 2px; background: #EAD9CE; }
        .lx-product-info { position: sticky; top: 110px; padding: 8px 0; }
        .lx-product-title { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
        .lx-product-title h1 { margin: 0; font-size: 43px; font-weight: 400; line-height: 1.08; text-transform: uppercase; }
        .lx-like-large { position: static; flex-shrink: 0; width: 34px; height: 34px; margin-top: 6px; border: 1px solid #DFCFC4; }
        .lx-product-price { margin: 7px 0 13px; padding-bottom: 13px; border-bottom: 1px solid #DFCFC4; font-size: 16px; }
        .lx-product-description { max-width: 500px; margin: 13px 0; color: var(--color-ink-light); font-size: 13px; }
        .lx-product-facts { display: flex; flex-wrap: wrap; gap: 8px 17px; margin: 0 0 16px; padding: 0; list-style: none; color: #544E45; font-size: 11px; }
        .lx-product-facts li::before { margin-right: 7px; color: var(--color-clay-dark); content: "✳"; }
        .lx-option-group { margin: 16px 0; }
        .lx-option-heading { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; }
        .lx-option-heading button { padding: 0; border: 0; border-bottom: 1px solid #DFCFC4; background: none; color: var(--color-ink-light); font-size: 10px; font-weight: 400; letter-spacing: 0; text-transform: none; cursor: pointer; }
        .lx-option-row { display: flex; flex-wrap: wrap; gap: 7px; }
        .lx-chip { min-width: 40px; height: 39px; padding: 0 12px; border: 1px solid #DFCFC4; border-radius: 30px; background: transparent; color: var(--color-ink); font-size: 11px; cursor: pointer; }
        .lx-chip-round { width: 39px; padding: 0; border-radius: 50%; }
        .lx-chip[aria-pressed="true"] { border-color: var(--color-ink); background: var(--color-ink); color: var(--color-cream); }
        .lx-colour-chip { position: relative; width: 22px; height: 22px; padding: 0; border: 1px solid rgba(41,36,30,0.27); border-radius: 50%; cursor: pointer; }
        .lx-colour-chip::after { position: absolute; inset: -4px; border: 1px solid transparent; border-radius: 50%; content: ""; }
        .lx-colour-chip[aria-pressed="true"]::after { border-color: var(--color-ink); }
        .lx-option-note { margin: 9px 0 0; color: var(--color-ink-light); font-size: 11px; }
        .lx-missing { margin: 0 0 12px; color: var(--color-clay-dark); font-size: 11px; }
        .lx-product-actions { display: grid; grid-template-columns: 1fr; gap: 8px; }
        .lx-purchase-note { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 14px; padding-top: 17px; border-top: 1px solid #DFCFC4; }
        .lx-purchase-note span { color: var(--color-ink-light); font-size: 9px; text-align: center; }
        .lx-purchase-note span::before { display: block; margin-bottom: 5px; color: var(--color-clay-dark); content: "✳"; font-size: 16px; }
        .lx-product-additional { margin-top: 42px; }
        .lx-accordion { border-top: 1px solid #DFCFC4; }
        .lx-accordion:last-child { border-bottom: 1px solid #DFCFC4; }
        .lx-accordion summary { padding: 12px 0; font-size: 11px; list-style: none; cursor: pointer; }
        .lx-accordion summary::-webkit-details-marker { display: none; }
        .lx-accordion summary::after { float: right; content: "+"; font-size: 15px; }
        .lx-accordion[open] summary::after { content: "−"; }
        .lx-accordion p { margin: 0 0 12px; color: var(--color-ink-light); font-size: 11px; }
        .lx-dialog-backdrop { position: fixed; inset: 0; z-index: 70; display: grid; place-items: center; padding: 15px; background: rgba(41,36,30,0.4); }
        .lx-dialog { position: relative; width: min(440px, 100%); padding: 35px; border: 1px solid #DFCFC4; background: var(--color-cream); color: var(--color-ink); }
        .lx-dialog h2 { margin: 0; font-size: 38px; font-weight: 400; }
        .lx-dialog > p:not(.lx-eyebrow) { color: var(--color-ink-light); font-size: 12px; }
        .lx-dialog-close { position: absolute; top: 12px; right: 16px; border: 0; background: none; font-size: 24px; cursor: pointer; }
        .lx-size-table { width: 100%; margin-top: 18px; border-collapse: collapse; font-size: 11px; }
        .lx-size-table th { padding: 8px 0; border-bottom: 1px solid #DFCFC4; color: var(--color-ink-light); font-weight: 500; text-align: left; }
        .lx-size-table td { padding: 8px 0; border-bottom: 1px solid #DFCFC4; }
        @media (max-width: 900px) {
          .lx-product-layout { grid-template-columns: 1fr; }
          .lx-product-info { position: static; }
          .lx-gallery { grid-template-columns: 1fr; }
          .lx-gallery-main { grid-column: 1; grid-row: 1; }
          .lx-gallery-thumbs { flex-direction: row; overflow-x: auto; }
          .lx-gallery-thumb { flex: 0 0 55px; }
        }
        @media (max-width: 680px) {
          .lx-product-title h1 { font-size: 36px; }
        }
      `}</style>
    </>
  )
}
