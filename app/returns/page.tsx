export const metadata = {
  title: 'Returns — Lynux Espadrilles',
  description: 'Our returns and exchange policy.',
}

export default function ReturnsPage() {
  return (
    <div className="pt-20 lg:pt-24 min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <p className="font-dm text-xs tracking-[0.25em] uppercase text-clay font-medium mb-4">Policy</p>
        <h1 className="font-cormorant font-semibold text-5xl text-ink mb-10">Returns &amp; Exchanges</h1>

        <div className="space-y-10">
          <div>
            <h2 className="font-cormorant font-semibold text-2xl text-ink mb-4">Made to Order</h2>
            <p className="font-dm text-sm text-ink-light leading-relaxed">
              As all our espadrilles are handcrafted to order, we do not accept returns for change of mind. Please ensure you select the correct size and customisation options before placing your order.
            </p>
          </div>

          <div>
            <h2 className="font-cormorant font-semibold text-2xl text-ink mb-4">Manufacturing Defects</h2>
            <p className="font-dm text-sm text-ink-light leading-relaxed">
              If you receive a pair with a manufacturing defect, we will arrange a free exchange at no cost to you. We cover the courier for all defect exchanges.
            </p>
          </div>

          <div>
            <h2 className="font-cormorant font-semibold text-2xl text-ink mb-4">How to Contact Us</h2>
            <p className="font-dm text-sm text-ink-light leading-relaxed mb-4">
              For any returns or exchange queries, please reach out to us:
            </p>
            <a
              href="mailto:info@lynuxespadrilles.co.za"
              className="font-dm text-sm text-clay hover:text-clay-dark transition-colors duration-200"
            >
              info@lynuxespadrilles.co.za
            </a>
          </div>

          <div className="bg-sand p-8">
            <h2 className="font-cormorant font-semibold text-xl text-ink mb-3">Our Promise</h2>
            <p className="font-dm text-sm text-ink-light leading-relaxed">
              Your satisfaction is our priority. We stand behind the quality of every pair we make. If something isn&apos;t right, we want to make it right.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
