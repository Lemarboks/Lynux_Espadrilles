export interface Colour {
  name: string
  hex: string | null
  image?: string | null
}

export interface Review {
  author: string
  rating: number
  date: string
  comment: string
}

export interface Product {
  id: number
  slug: string
  name: string
  price: number
  priceRange: { min: number; max: number } | null
  description: string
  features: string[]
  sizes: number[]
  juteOptions: string[]
  toeOptions: string[]
  colours: Colour[]
  image: string
  images: string[]
  category: string
  featured: boolean
  rating: number | null
  reviewCount: number
  reviews?: Review[]
}

export interface CartItem {
  product: Product
  size: number
  colour: string
  jute: string
  toe: string
  quantity: number
  cartId: string
  colourImage: string | null
}
