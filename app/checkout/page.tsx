'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/app/context/CartContext'
import { img } from '@/lib/image'
import { describeLine, PricedOrder } from '@/lib/order'

declare global {
  interface Window {
    PaystackPop?: new () => {
      resumeTransaction: (accessCode: string, callbacks?: {
        onSuccess?: (tx: { reference: string }) => void
        onCancel?: () => void
        onError?: (error: { message: string }) => void
      }) => void
    }
  }
}

interface Receipt {
  status: 'paid' | 'mismatch' | 'pending' | 'failed'
  reference: string
  paidAt: string | null
  fullName: string
  order: PricedOrder | null
}

const formatPrice = (price: number): string =>
  'R' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const SA_PROVINCES = [
  'Western Cape','Gauteng','KwaZulu-Natal','Eastern Cape',
  'Limpopo','Mpumalanga','Free State','North West','Northern Cape',
]

interface FormData {
  fullName: string; email: string; phone: string
  street: string; suburb: string; city: string
  province: string; postalCode: string; notes: string
}

interface FormErrors {
  fullName?: string; email?: string; phone?: string
  street?: string; suburb?: string; city?: string
  province?: string; postalCode?: string
}

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart()
  const delivery = 65
  const total = cartTotal + delivery

  const [form, setForm] = useState<FormData>({
    fullName: '', email: '', phone: '', street: '', suburb: '',
    city: '', province: '', postalCode: '', notes: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [orderRef, setOrderRef] = useState('')
  const [receipt, setReceipt] = useState<Receipt | null>(null)

  // Only the server can say a payment succeeded; the URL or popup callback alone can be faked
  const confirmPayment = useCallback(async (reference: string) => {
    setOrderRef(reference)
    setSubmitted(true)
    setReceipt(null)
    let result: Receipt = { status: 'pending', reference, paidAt: null, fullName: '', order: null }
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        const res = await fetch(`/api/verify?reference=${encodeURIComponent(reference)}`)
        result = await res.json()
      } catch {}
      if (result.status !== 'pending') break
      await new Promise(r => setTimeout(r, 2500))
    }
    if (result.status === 'paid') clearCart()
    setReceipt(result)
  }, [clearCart])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('reference') || params.get('trxref')
    if (ref) confirmPayment(ref)
  }, [confirmPayment])

  useEffect(() => {
    if (window.PaystackPop) return

    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v2/inline.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      script.remove()
    }
  }, [])

  const validate = (): boolean => {
    const e: FormErrors = {}
    if (!form.fullName.trim()) e.fullName = 'Full name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.phone.trim()) e.phone = 'Phone number is required'
    else if (form.phone.replace(/\D/g, '').length < 10) e.phone = 'Enter at least 10 digits'
    if (!form.street.trim()) e.street = 'Street address is required'
    if (!form.suburb.trim()) e.suburb = 'Suburb is required'
    if (!form.city.trim()) e.city = 'City is required'
    if (!form.province) e.province = 'Please select a province'
    if (!form.postalCode.trim()) e.postalCode = 'Postal code is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setPaymentError('')

    // The server prices the cart from the catalogue; only ids and options are sent from here
    let session: { accessCode?: string; authorizationUrl?: string; error?: string }
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: form,
          items: cartItems.map(i => ({
            id: i.product.id,
            size: i.size,
            colour: i.colour,
            jute: i.jute,
            toe: i.toe,
            quantity: i.quantity,
          })),
        }),
      })
      session = await res.json()
    } catch {
      session = { error: 'We couldn’t reach the payment service. Please check your connection and try again.' }
    }

    if (!session.accessCode || !session.authorizationUrl) {
      setPaymentError(session.error ?? 'We couldn’t start the payment. Please try again.')
      setLoading(false)
      return
    }

    if (!window.PaystackPop) {
      // Popup script blocked or slow: use Paystack's hosted page, which returns to /checkout/?reference=...
      window.location.href = session.authorizationUrl
      return
    }

    new window.PaystackPop().resumeTransaction(session.accessCode, {
      onSuccess: (tx) => {
        setLoading(false)
        confirmPayment(tx.reference)
      },
      onCancel: () => setLoading(false),
      onError: (error) => {
        setPaymentError(error.message || 'Payment failed. Please try again.')
        setLoading(false)
      },
    })
  }

  const inputClass = (field: keyof FormErrors) =>
    `w-full font-dm text-sm text-ink border px-4 py-3 bg-cream focus:outline-none focus:border-clay transition-colors duration-200 ${
      errors[field] ? 'border-accent' : 'border-sand-dark'
    }`

  if (cartItems.length === 0 && !submitted) {
    return (
      <div className="pt-20 lg:pt-24 min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-cormorant font-semibold text-4xl text-ink mb-4">Your cart is empty</h1>
          <Link href="/shop" className="inline-block font-dm text-sm bg-clay hover:bg-clay-dark text-cream px-8 py-3.5 transition-all duration-300">
            Shop Collection
          </Link>
        </div>
      </div>
    )
  }

  if (submitted && !receipt) {
    return (
      <div className="pt-20 lg:pt-24 min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <h1 className="font-cormorant font-semibold text-4xl text-ink mb-4">Confirming your payment…</h1>
          <p className="font-dm text-sm text-ink-light">This only takes a moment. Please don&apos;t close this page.</p>
        </div>
      </div>
    )
  }

  if (submitted && receipt && receipt.status !== 'paid') {
    const failed = receipt.status === 'failed'
    return (
      <div className="pt-20 lg:pt-24 min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <h1 className="font-cormorant font-semibold text-4xl text-ink mb-4">
            {failed ? 'Payment not completed' : 'We’re still confirming your payment'}
          </h1>
          <p className="font-dm text-sm text-ink-light leading-relaxed mb-6">
            {failed
              ? 'Your payment didn’t go through and you have not been charged. Please try again.'
              : 'If money left your account, don’t worry. We’ll check it and contact you. Please keep your reference below.'}
          </p>
          <div className="bg-sand px-6 py-4 mb-8">
            <p className="font-dm text-xs text-ink-light uppercase tracking-widest mb-1">Reference</p>
            <p className="font-cormorant font-semibold text-2xl text-ink break-all">{orderRef}</p>
          </div>
          <Link href={failed ? '/cart' : '/shop'} className="inline-block font-dm text-sm bg-clay hover:bg-clay-dark text-cream px-8 py-3.5 transition-all duration-300">
            {failed ? 'Back to Cart' : 'Continue Shopping'}
          </Link>
        </div>
      </div>
    )
  }

  if (submitted && receipt) {
    return (
      <div className="pt-20 lg:pt-24 min-h-screen bg-cream flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="text-center">
            <div className="flex justify-center mb-6 print:hidden">
              <div className="w-20 h-20 rounded-full bg-clay/10 flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-clay">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            </div>
            <h1 className="font-cormorant font-semibold text-4xl text-ink mb-4">Payment Successful!</h1>
            <p className="font-dm text-sm text-ink-light leading-relaxed mb-6">
              Thank you{receipt.fullName ? `, ${receipt.fullName.split(' ')[0]}` : ''}. We&apos;ve received your payment and emailed you a receipt. We&apos;ll be in touch within 24 hours to confirm your order and shipping details.
            </p>
          </div>
          <div className="bg-sand px-6 py-6 mb-8">
            <p className="font-dm text-xs text-ink-light uppercase tracking-widest mb-1">Receipt · Order Reference</p>
            <p className="font-cormorant font-semibold text-2xl text-ink break-all">{receipt.reference}</p>
            {receipt.paidAt && (
              <p className="font-dm text-xs text-ink-light mt-1">
                Paid {new Date(receipt.paidAt).toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}
              </p>
            )}
            {receipt.order && (
              <div className="mt-5 border-t border-sand-dark pt-4 space-y-3">
                {receipt.order.lines.map((l, i) => (
                  <div key={i} className="flex justify-between gap-4">
                    <div>
                      <p className="font-dm text-sm text-ink">{l.name} × {l.quantity}</p>
                      <p className="font-dm text-xs text-ink-light">{describeLine(l)}</p>
                    </div>
                    <p className="font-dm text-sm text-ink flex-shrink-0">{formatPrice(l.unitPrice * l.quantity)}</p>
                  </div>
                ))}
                <div className="flex justify-between border-t border-sand-dark pt-3">
                  <span className="font-dm text-sm text-ink-mid">Delivery</span>
                  <span className="font-dm text-sm text-ink">{formatPrice(receipt.order.delivery)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-cormorant font-semibold text-lg text-ink">Total paid</span>
                  <span className="font-cormorant font-semibold text-lg text-ink">{formatPrice(receipt.order.total)}</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center print:hidden">
            <button onClick={() => window.print()} className="font-dm text-sm border border-clay text-clay hover:bg-clay hover:text-cream px-8 py-3.5 transition-all duration-300">
              Print / Save Receipt
            </button>
            <Link href="/shop" className="text-center font-dm text-sm bg-clay hover:bg-clay-dark text-cream px-8 py-3.5 transition-all duration-300">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 lg:pt-24 min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <h1 className="font-cormorant font-semibold text-4xl lg:text-5xl text-ink mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 lg:gap-16 items-start">
          {/* LEFT: Form */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-8">
              <h2 className="font-cormorant font-semibold text-2xl text-ink mb-6">Contact Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="font-dm text-xs uppercase tracking-widest text-ink-mid block mb-1.5">Full Name *</label>
                  <input type="text" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} className={inputClass('fullName')} placeholder="Jane Smith" />
                  {errors.fullName && <p className="font-dm text-xs text-accent mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="font-dm text-xs uppercase tracking-widest text-ink-mid block mb-1.5">Email Address *</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputClass('email')} placeholder="jane@example.com" />
                  {errors.email && <p className="font-dm text-xs text-accent mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="font-dm text-xs uppercase tracking-widest text-ink-mid block mb-1.5">Phone Number *</label>
                  <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputClass('phone')} placeholder="071 000 0000" />
                  {errors.phone && <p className="font-dm text-xs text-accent mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="font-cormorant font-semibold text-2xl text-ink mb-6">Delivery Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="font-dm text-xs uppercase tracking-widest text-ink-mid block mb-1.5">Street Address *</label>
                  <input type="text" value={form.street} onChange={e => setForm(f => ({ ...f, street: e.target.value }))} className={inputClass('street')} placeholder="12 Bree Street" />
                  {errors.street && <p className="font-dm text-xs text-accent mt-1">{errors.street}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-dm text-xs uppercase tracking-widest text-ink-mid block mb-1.5">Suburb *</label>
                    <input type="text" value={form.suburb} onChange={e => setForm(f => ({ ...f, suburb: e.target.value }))} className={inputClass('suburb')} placeholder="Gardens" />
                    {errors.suburb && <p className="font-dm text-xs text-accent mt-1">{errors.suburb}</p>}
                  </div>
                  <div>
                    <label className="font-dm text-xs uppercase tracking-widest text-ink-mid block mb-1.5">City *</label>
                    <input type="text" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className={inputClass('city')} placeholder="Cape Town" />
                    {errors.city && <p className="font-dm text-xs text-accent mt-1">{errors.city}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-dm text-xs uppercase tracking-widest text-ink-mid block mb-1.5">Province *</label>
                    <select value={form.province} onChange={e => setForm(f => ({ ...f, province: e.target.value }))} className={`${inputClass('province')} appearance-none`}>
                      <option value="">Select province</option>
                      {SA_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    {errors.province && <p className="font-dm text-xs text-accent mt-1">{errors.province}</p>}
                  </div>
                  <div>
                    <label className="font-dm text-xs uppercase tracking-widest text-ink-mid block mb-1.5">Postal Code *</label>
                    <input type="text" value={form.postalCode} onChange={e => setForm(f => ({ ...f, postalCode: e.target.value }))} className={inputClass('postalCode')} placeholder="8001" />
                    {errors.postalCode && <p className="font-dm text-xs text-accent mt-1">{errors.postalCode}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="font-cormorant font-semibold text-2xl text-ink mb-6">Special Instructions</h2>
              <div>
                <label className="font-dm text-xs uppercase tracking-widest text-ink-mid block mb-1.5">Notes (optional)</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={4} className="w-full font-dm text-sm text-ink border border-sand-dark px-4 py-3 bg-cream focus:outline-none focus:border-clay transition-colors duration-200 resize-none" placeholder="Any special requests or customisation notes..." />
              </div>
            </div>

            {paymentError && (
              <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200">
                <p className="font-dm text-sm text-red-600">{paymentError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 font-dm text-sm font-medium tracking-widest uppercase bg-clay hover:bg-clay-dark text-cream transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Redirecting to payment...' : 'Pay Now'}
            </button>

            <p className="font-dm text-xs text-ink-light text-center mt-4">
              Secured by Paystack · Your payment details are encrypted
            </p>
          </form>

          {/* RIGHT: Order Summary */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-sand p-6 lg:p-8">
              <h2 className="font-cormorant font-semibold text-2xl text-ink mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {cartItems.map(item => (
                  <div key={item.cartId} className="flex gap-4">
                    <div className="relative w-16 h-16 bg-cream flex-shrink-0 overflow-hidden">
                      <Image src={img(item.product.image)} alt={item.product.name} fill className="object-cover" sizes="64px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-cormorant font-semibold text-base text-ink leading-tight">{item.product.name}</p>
                      <p className="font-dm text-xs text-ink-light mt-0.5">
                        Size {item.size}{item.colour && ` · ${item.colour}`}{item.jute && ` · ${item.jute}`}{item.toe && ` · ${item.toe}`}
                      </p>
                      <p className="font-dm text-xs text-ink-mid mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-dm text-sm text-ink flex-shrink-0">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-sand-dark pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="font-dm text-sm text-ink-mid">Subtotal</span>
                  <span className="font-dm text-sm text-ink">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-dm text-sm text-ink-mid">Delivery</span>
                  <span className="font-dm text-sm text-ink">{formatPrice(delivery)}</span>
                </div>
                <div className="flex justify-between border-t border-sand-dark pt-3">
                  <span className="font-cormorant font-semibold text-lg text-ink">Total</span>
                  <span className="font-cormorant font-semibold text-lg text-ink">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
