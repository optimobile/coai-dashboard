# Stripe Integration Setup Guide

## Overview

Your COAI Dashboard project has been configured with Stripe payment processing integration. A test sandbox environment has been created and is ready to be claimed.

## Current Status

- **Stripe Test Sandbox**: Created but not yet claimed
- **Deadline**: February 22, 2026 (11:11:40 UTC)
- **Status**: ⚠️ Action Required

## Step 1: Claim Your Stripe Test Sandbox

To activate your Stripe test environment and begin testing payments, you must claim the sandbox before the deadline.

### Instructions:

1. **Navigate to Stripe Sandbox Claim Page**
   - Visit: https://dashboard.stripe.com/claim_sandbox/YWNjdF8xU2hqaTFEdUVnNUhha2dQLDE3NjcxNzU5MDAv100KvIhTQkB
   - This link is unique to your account and expires on **February 22, 2026**

2. **Sign in to Stripe**
   - Use your Stripe account credentials
   - If you don't have a Stripe account, create one at https://dashboard.stripe.com/register

3. **Confirm Sandbox Claim**
   - Follow the on-screen prompts to claim the test environment
   - You'll receive confirmation once the sandbox is active

4. **Verify Activation**
   - After claiming, your test API keys will be available in the Stripe Dashboard
   - The `STRIPE_SECRET_KEY` environment variable is already configured in your project

## Step 2: Verify Stripe Integration in Your Project

Your project has the following Stripe configuration already set up:

### Environment Variables

The following secrets are automatically injected into your application:

```
STRIPE_SECRET_KEY         # Test mode secret key (sk_test_...)
STRIPE_WEBHOOK_SECRET     # Webhook signing secret for test mode
VITE_STRIPE_PUBLISHABLE_KEY  # Frontend publishable key for Stripe.js
```

### Backend Integration

Stripe payment processing is available through the MCP server:

```bash
# List available Stripe tools
manus-mcp-cli tool list --server stripe

# Available operations:
# - Create and manage customers
# - Create and manage subscriptions
# - Generate and manage invoices
# - Create and manage payment intents
# - Process refunds
# - Create payment links
# - Manage products and prices
# - Create and list coupons
# - Handle disputes
# - Retrieve account and balance information
```

### Frontend Integration

The Stripe publishable key is available in your frontend environment as `VITE_STRIPE_PUBLISHABLE_KEY`.

## Step 3: Test Payment Processing

Once your sandbox is claimed, you can test payments using Stripe's test card numbers:

### Test Cards

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | Visa - Successful payment |
| `4000 0000 0000 0002` | Visa - Card declined |
| `4000 0025 0000 3155` | Visa - Requires authentication (3D Secure) |
| `5555 5555 5555 4444` | Mastercard - Successful payment |

**Expiry Date**: Any future date (e.g., 12/25)  
**CVC**: Any 3-digit number (e.g., 123)

## Step 4: Configure Webhook Endpoints (Optional but Recommended)

For production, set up webhook endpoints to handle Stripe events:

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

## Step 5: Enable Payment Features in Your Application

Once the sandbox is claimed and verified, enable payment features:

### Billing Page

Your application includes a billing page at `/settings/billing` where users can:
- View billing history
- Manage payment methods
- Update subscription settings

### Payment Success/Failure Pages

Redirect pages are configured for payment outcomes:
- Success: `/payment-success`
- Failure: `/payment-failure`

## Important Notes

⚠️ **Before Production Deployment**:

1. **Switch to Live Mode**: After testing, switch from test keys to live keys in Stripe Dashboard
2. **Update Secrets**: Update `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` with live keys
3. **SSL Certificate**: Ensure your domain has a valid SSL certificate
4. **PCI Compliance**: Review Stripe's PCI compliance requirements
5. **Test Thoroughly**: Complete end-to-end payment testing before going live

## Troubleshooting

### Issue: "Invalid API Key"
- Verify the `STRIPE_SECRET_KEY` is correctly set in your environment
- Ensure you're using the test key (starts with `sk_test_`) for development
- Check that the key hasn't expired or been revoked

### Issue: "Webhook signature verification failed"
- Verify the `STRIPE_WEBHOOK_SECRET` matches the endpoint signing secret in Stripe Dashboard
- Ensure the webhook endpoint is publicly accessible

### Issue: "Payment intent creation failed"
- Check that the amount is in the smallest currency unit (cents for USD)
- Verify the currency code is valid (e.g., 'usd', 'eur')
- Ensure the customer ID exists if using an existing customer

## Support Resources

- **Stripe Documentation**: https://docs.stripe.com
- **Stripe API Reference**: https://docs.stripe.com/api
- **Stripe Testing Guide**: https://docs.stripe.com/testing
- **Stripe Dashboard**: https://dashboard.stripe.com

## Next Steps

1. ✅ Claim your Stripe sandbox using the link above
2. ✅ Verify the sandbox is active in Stripe Dashboard
3. ✅ Test payment processing with test cards
4. ✅ Review the billing page implementation
5. ✅ Plan production deployment strategy

---

**Last Updated**: December 27, 2025  
**Project**: COAI Dashboard  
**Stripe Integration Status**: Ready for Testing
