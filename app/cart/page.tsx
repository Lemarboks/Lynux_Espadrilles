'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/app/context/CartContext'
import { img } from '@/lib/image'

const DELIVERY = 65

const formatPrice = (price: number): string =>
  'R' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart()

  return (
    <section className="lx-cart-page lx-container font-dm">
      <p className="lx-eyebrow">Your selection</p>
      <h1 className="lx-page-title">Your bag</h1>

      {cartCount === 0 ? (
        <div className="lx-empty">
          <p>Your bag is currently empty.</p>
          <Link href="/shop" className="lx-button">Discover the collection</Link>
        </div>
      ) : (
        <div className="lx-cart-layout">
          <div>
            {cartItems.map(item => (
              <div key={item.cartId} className="lx-cart-row">
                <div className="lx-cart-image">
                  <Image src={img(item.colourImage || item.product.image)} alt={item.product.name} fill sizes="112px" />
                </div>
                <div>
                  <h2>{item.product.name}</h2>
                  <p className="lx-cart-variant">
                    {[`Size ${item.size}`, item.colour, item.jute, item.toe].filter(Boolean).join(' · ')}
                  </p>
                  <div className="lx-cart-controls">
                    <div className="lx-qty">
                      <button type="button" onClick={() => updateQuantity(item.cartId, item.quantity - 1)} aria-label="Decrease quantity">−</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.cartId, item.quantity + 1)} aria-label="Increase quantity">+</button>
                    </div>
                    <button type="button" className="lx-remove" onClick={() => removeFromCart(item.cartId)}>Remove</button>
                  </div>
                </div>
                <p className="lx-cart-price">{formatPrice(item.product.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <aside className="lx-cart-summary">
            <h2 className="font-cormorant">Summary</h2>
            <div className="lx-summary-line"><span>Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
            <div className="lx-summary-line"><span>Delivery</span><span>{formatPrice(DELIVERY)}</span></div>
            <div className="lx-summary-line lx-summary-total"><span>Total</span><span>{formatPrice(cartTotal + DELIVERY)}</span></div>
            <Link href="/checkout" className="lx-button">Proceed to checkout <span aria-hidden>→</span></Link>
            <p className="lx-summary-note">Handcrafted to order · Secure payment with Paystack</p>
          </aside>
        </div>
      )}

      <style>{`
        .lx-cart-page { min-height: 55vh; padding: 72px 0 100px; }
        .lx-cart-page .lx-page-title { font-size: clamp(42px, 5vw, 62px); }
        .lx-empty { display: flex; flex-direction: column; align-items: flex-start; gap: 20px; padding: 40px 0; color: var(--color-ink-light); font-size: 13px; }
        .lx-empty p { margin: 0; }
        .lx-cart-layout { display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: 65px; margin-top: 37px; }
        .lx-cart-row { display: grid; grid-template-columns: 112px 1fr auto; gap: 20px; padding: 18px 0; border-top: 1px solid #DFCFC4; }
        .lx-cart-image { position: relative; width: 112px; aspect-ratio: 1; overflow: hidden; background: #E8D4C7; }
        .lx-cart-image img { object-fit: cover; }
        .lx-cart-row h2 { margin: 2px 0 4px; font-family: var(--font-dm), sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.08em; }
        .lx-cart-variant { margin: 0 0 13px; color: var(--color-ink-light); font-size: 11px; }
        .lx-cart-controls { display: flex; align-items: center; gap: 14px; }
        .lx-cart-controls .lx-qty { transform: scale(0.85); transform-origin: left center; }
        .lx-remove { padding: 0; border: 0; border-bottom: 1px solid #DFCFC4; background: none; color: var(--color-ink-light); font-size: 10px; cursor: pointer; }
        .lx-cart-price { margin: 2px 0 0; font-size: 12px; white-space: nowrap; }
        .lx-cart-summary { height: fit-content; padding: 21px; border: 1px solid #DFCFC4; background: rgba(251,250,247,0.5); }
        .lx-cart-summary h2 { margin: 0 0 17px; font-size: 27px; font-weight: 400; }
        .lx-summary-line { display: flex; justify-content: space-between; gap: 15px; padding: 10px 0; border-top: 1px solid #DFCFC4; color: var(--color-ink-light); font-size: 12px; }
        .lx-summary-total { color: var(--color-ink); font-size: 14px; font-weight: 600; }
        .lx-cart-summary .lx-button { width: 100%; margin-top: 16px; }
        .lx-summary-note { margin: 12px 0 0; color: var(--color-ink-light); font-size: 10px; text-align: center; }
        @media (max-width: 900px) {
          .lx-cart-layout { grid-template-columns: 1fr; gap: 30px; }
        }
        @media (max-width: 680px) {
          .lx-cart-page { padding: 40px 0 70px; }
          .lx-cart-row { grid-template-columns: 84px 1fr; }
          .lx-cart-image { width: 84px; }
          .lx-cart-price { grid-column: 2; }
        }
      `}</style>
    </section>
  )
}
