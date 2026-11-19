# Asri Online Store

Asri Online Store is a React-based storefront for Asri Collection, featuring a product catalog, shopping cart, checkout, and Midtrans Snap payment integration.

## Features

- Product catalog with category navigation.
- Shopping cart and quantity management.
- Customer and shipping information form.
- Checkout through Midtrans Snap.
- Payment status page.
- Supabase integration reference for order and payment processing.

> **Note:** The current product catalog and shipping fee are sample data. The shipping fee is currently fixed at IDR 25,000.

## Payment Flow

The application uses Midtrans Snap with Supabase Edge Functions.

1. Customer selects products and proceeds to checkout.
2. The frontend sends order information to the backend.
3. The backend validates product information and calculates the transaction amount.
4. The backend requests a Snap transaction token from Midtrans using the Server Key.
5. The frontend opens the Midtrans Snap payment interface using the token and Client Key.
6. Midtrans sends payment notifications to the backend.
7. The backend verifies the payment and updates the order status.
8. The frontend retrieves the order status from the backend.

**Important:** Payment status must be determined by backend verification, not by frontend callbacks alone.

## Required Configuration

### Frontend

Configure the following public environment variables:

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `VITE_MIDTRANS_CLIENT_KEY` | Midtrans Client Key |

The Client Key is intended for frontend use.

### Supabase Secrets

Configure these secrets in Supabase:

| Secret | Description |
|---|---|
| `MIDTRANS_SERVER_KEY` | Midtrans Server Key |
| `MIDTRANS_IS_PRODUCTION` | `false` for Sandbox, `true` for Production |

**Never expose the Midtrans Server Key or Supabase Service Role Key in frontend code.**

## Required Backend Functions

The application includes reference code for these Supabase Edge Functions:

| Function | Purpose |
|---|---|
| `create-midtrans-transaction` | Validates an order and creates a Snap transaction token. |
| `midtrans-notification` | Receives and verifies payment notifications. |
| `get-order-status` | Retrieves the backend payment status of an order. |

The function code shown inside `App.jsx` is reference code. It must be deployed and configured in Supabase before it can be used by the application.

## Midtrans Configuration

Use the matching environment for both backend API requests and Snap.js.

| Environment | Snap API | Snap.js |
|---|---|---|
| Sandbox | `https://app.sandbox.midtrans.com/snap/v1/transactions` | `https://app.sandbox.midtrans.com/snap/snap.js` |
| Production | `https://app.midtrans.com/snap/v1/transactions` | `https://app.midtrans.com/snap/snap.js` |

Configure the Midtrans Payment Notification URL to point to the deployed `midtrans-notification` Edge Function.

The backend must verify notification signatures and validate payment status before marking an order as paid.

## Testing

1. Configure Sandbox credentials.
2. Deploy the required Supabase Edge Functions.
3. Configure the Midtrans Notification URL.
4. Complete a test checkout using Midtrans Sandbox.
5. Confirm that the backend receives the notification and updates the order status.

Do not use Production credentials until the complete payment flow has been tested.

## Current Limitations

- Product data currently includes demo products.
- Shipping cost uses a fixed sample value.
- Supabase schema and Edge Function code are embedded as reference material in `App.jsx`.
- Repository build and installation instructions are not included because project configuration files have not been verified.
- Production payment readiness has not been verified.

## Official Documentation

- [Midtrans Snap Integration Guide](https://docs.midtrans.com/docs/snap-snap-integration-guide)
- [Midtrans Snap.js Reference](https://docs.midtrans.com/reference/snap-js)
- [Midtrans HTTP Notifications / Webhooks](https://docs.midtrans.com/docs/https-notification-webhooks)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
