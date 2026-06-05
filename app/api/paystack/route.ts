import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { email, amount, reference, metadata } = body

  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount: Math.round(amount * 100), // Paystack uses kobo/cents
      reference,
      currency: 'ZAR',
      metadata,
    }),
  })

  const data = await response.json()

  if (!response.ok || !data.status) {
    return NextResponse.json({ error: data.message || 'Payment initialization failed' }, { status: 400 })
  }

  return NextResponse.json({ authorizationUrl: data.data.authorization_url, reference: data.data.reference })
}
