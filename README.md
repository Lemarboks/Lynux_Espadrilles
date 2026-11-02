# Lynux Espadrilles

Static Next.js storefront on Cloudflare Pages, with a few small server functions in `functions/api/` for payments. Payments go through **Paystack** (popup checkout, ZAR). Orders can also be placed over WhatsApp from the cart page.

## How checkout works

1. The browser sends only product ids, sizes, options and quantities to `POST /api/checkout`.
2. The server prices the cart from `lib/products.ts` (+ R65 delivery) and creates the Paystack transaction with the **secret** key. Customers can't change the price.
3. The Paystack popup takes the payment.
4. The success page calls `GET /api/verify`, which asks Paystack whether the payment really succeeded *and* that the amount matches the items. Only then does it show "Payment Successful" and an on-screen receipt the customer can print or save as a PDF.
5. Paystack calls `POST /api/paystack-webhook` (signature checked). It emails you the order and emails the customer a branded receipt.

Shared logic lives in `lib/order.ts` (pricing) and `lib/payments.ts` (Paystack + emails, server-only).

## Local development

```bash
npm install
npm run dev            # site only, checkout won't work (no /api)
```

To test checkout locally with the functions:

```bash
npm run build
npx wrangler pages dev out --binding PAYSTACK_SECRET_KEY=sk_test_...
```

Paystack test card: `4084 0840 8408 4081`, any future expiry, CVV `408`, PIN `0000`, OTP `123456`.

## 1. Paystack setup

1. Finish **business verification** at https://dashboard.paystack.com (needed for live payments).
2. **Settings → API Keys & Webhooks**: copy the **Secret Key** (`sk_test_...` for testing, `sk_live_...` for real payments).
3. In the same page set **Webhook URL** to `https://lynuxespadrilles.co.za/api/paystack-webhook`.
4. **Settings → Preferences**: make sure customers receive Paystack's email receipts, and that you get notified of successful payments.

> The secret key goes **only** in Cloudflare as an encrypted secret. Never commit it and never prefix it with `NEXT_PUBLIC_`.

## 2. Hosting (Cloudflare Pages)

The site rebuilds automatically on every push to `main`. The domain `lynuxespadrilles.co.za` is registered at xneelo; its nameservers point to Cloudflare.

| Setting | Value |
|---|---|
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `out` |

**Settings → Variables and Secrets** (type **Secret**), then redeploy:

| Name | Value |
|---|---|
| `PAYSTACK_SECRET_KEY` | `sk_live_...` |
| `RESEND_API_KEY` | optional, from https://resend.com (enables order + receipt emails) |
| `ORDER_EMAIL_FROM` | e.g. `Lynux Espadrilles <orders@lynuxespadrilles.co.za>` (domain must be verified in Resend) |
| `ORDER_NOTIFY_EMAIL` | the inbox that should receive new orders |

`NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` is no longer used and can be deleted.

Node version comes from `.node-version`. Security headers live in `public/_headers`.

## Seeing orders

- **Paystack dashboard → Transactions → click a payment.** Items, name, phone, address and notes appear as labelled fields.
- **Email**: if Resend is set up, every paid order is emailed to `ORDER_NOTIFY_EMAIL`. If the amount ever doesn't match the items, the subject starts with **⚠️ CHECK**. Don't ship those until you've looked.
