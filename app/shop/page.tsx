import { getAllProducts } from '@/lib/products'
import ProductGrid from '@/components/shop/ProductGrid'

export const metadata = {
  title: 'Shop — Lynux Espadrilles',
  description: 'Browse our full collection of handcrafted espadrilles.',
}

export default function ShopPage() {
  const products = getAllProducts()

  return (
    <div className="pt-20 lg:pt-24 min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <p className="font-dm text-xs tracking-[0.25em] uppercase text-clay font-medium mb-3">
            All Styles
          </p>
          <h1 className="font-cormorant font-semibold text-4xl lg:text-5xl text-ink mb-4">
            The Collection
          </h1>
          <p className="font-dm text-sm text-ink-light">
            {products.length} styles, all handcrafted to order
          </p>
        </div>
        <ProductGrid products={products} />
      </div>
    </div>
  )
}
