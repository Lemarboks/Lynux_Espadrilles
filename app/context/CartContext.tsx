'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Product, CartItem } from '@/types'

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: Product, size: number, colour: string, jute: string, toe: string, quantity: number, colourImage: string | null) => void
  removeFromCart: (cartId: string) => void
  updateQuantity: (cartId: string, quantity: number) => void
  clearCart: () => void
  cartCount: number
  cartTotal: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const addToCart = (product: Product, size: number, colour: string, jute: string, toe: string, quantity: number, colourImage: string | null) => {
    const cartId = `${product.id}-${size}-${colour}-${jute}-${toe}`
    setCartItems(prev => {
      const existing = prev.find(item => item.cartId === cartId)
      if (existing) {
        return prev.map(item =>
          item.cartId === cartId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { product, size, colour, jute, toe, quantity, cartId, colourImage }]
    })
  }

  const removeFromCart = (cartId: string) => {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId))
  }

  const clearCart = () => setCartItems([])

  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartId)
      return
    }
    setCartItems(prev =>
      prev.map(item => item.cartId === cartId ? { ...item, quantity } : item)
    )
  }

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
