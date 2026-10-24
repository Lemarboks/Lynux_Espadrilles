# Lynux Espadrilles

Static Next.js storefront. Payments go through **Paystack** (popup checkout, ZAR). Orders can also be placed over WhatsApp from the cart page.

## Local development

```bash
npm install
cp .env.example .env.local   # then paste your pk_test_... key
npm run dev
```

## 1. Paystack setup

1. Create an account at https://dashboard.paystack.com and finish **business verification** (needed before live payments).
2. **Settings → API Keys & Webhooks**: copy the **Test Public Key** (`pk_test_...`).
3. Put it in `.env.local` as `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...`.
4. Test a payment with Paystack's test card: `4084 0840 8408 4081`, any future expiry, CVV `408`, PIN `0000`, OTP `123456`.
5. When everything works, switch to the **Live Public Key** (`pk_live_...`) and rebuild.

> Only ever use the **public** key (`pk_...`). The **secret** key (`sk_...`) must never be put in this project. Everything here ends up in the browser.

### Before you ship any order

This site has no backend, so the browser works out the order total. A technical customer could change prices before paying. **For every order, open it in the Paystack dashboard and check the amount paid matches the items in its metadata** before you post anything.

## 2. Hosting (Cloudflare Pages)

The site is hosted on Cloudflare Pages and rebuilds automatically on every push to `main`. The domain `lynuxespadrilles.co.za` is registered at xneelo; its nameservers point to Cloudflare.

Cloudflare Pages project settings:

| Setting | Value |
|---|---|
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `out` |
| Environment variable | `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` = your `pk_live_...` key |

Node version comes from `.node-version`. Security headers live in `public/_headers`.

To change the Paystack key: Cloudflare → your Pages project → **Settings → Variables and Secrets**, then redeploy (**Deployments → ⋯ → Retry deployment**).
