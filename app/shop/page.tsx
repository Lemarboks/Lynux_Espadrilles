import { getAllProducts } from '@/lib/products'
import ProductGrid from '@/components/shop/ProductGrid'

export const metadata = {
  title: 'Shop — Lynux Espadrilles',
  description: 'Browse our full collection of handcrafted espadrilles.',
}

export default function ShopPage() {
  return (
    <>
      <section className="lx-banner font-dm">
        <h1 className="lx-page-title text-ink">Shop Our Collection</h1>
        <p>Find your perfect pair</p>
      </section>
      <ProductGrid products={getAllProducts()} />
    </>
  )
}
