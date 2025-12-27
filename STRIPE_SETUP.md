# Stripe Setup & Configuration Guide for CSOAI

**Last Updated**: December 27, 2025  
**Status**: Ready for Production Setup  
**Project**: CSOAI - Council of Safety of AI

## Overview

This comprehensive guide walks through claiming your Stripe test sandbox, rebranding the account to CSOAI, configuring products and pricing, and setting up payment processing for the platform.

## Current Status

- **Stripe Test Sandbox**: Created but not yet claimed
- **Deadline to Claim**: February 22, 2026 (11:11:40 UTC)
- **Status**: ⚠️ Action Required - Claim before deadline

## Step 1: Claim Your Stripe Test Sandbox

### 1.1 Access the Claim Link

Your Stripe test sandbox has been created and is ready to claim. Visit the claim link:

```
https://dashboard.stripe.com/claim_sandbox/YWNjdF8xU2hqaTFEdUVnNUhha2dQLDE3NjcxNzU5MDAv100KvIhTQkB
```

**IMPORTANT**: This link expires on February 22, 2026. Claim your sandbox before this date.

### 1.2 Complete the Claim Process

1. Click the claim link above
2. Sign in with your Stripe account (or create one at https://dashboard.stripe.com/register)
3. Review the sandbox details
4. Click "Claim Sandbox"
5. You'll be redirected to your Stripe Dashboard

### 1.3 Verify Sandbox Access

After claiming, verify you can access:

- Dashboard: https://dashboard.stripe.com
- API Keys page: https://dashboard.stripe.com/apikeys
- Products page: https://dashboard.stripe.com/products
- Customers page: https://dashboard.stripe.com/customers

## Step 2: Rebrand Stripe Account to CSOAI

### 2.1 Update Account Name

1. Go to https://dashboard.stripe.com/settings/account
2. Under "Account Settings", update:
   - **Account Name**: "CSOAI - Council of Safety of AI"
   - **Business Name**: "CSOAI"
   - **Website**: "https://councilof.ai"
3. Click "Save"

### 2.2 Update Business Information

1. Go to https://dashboard.stripe.com/settings/business_profile
2. Fill in:
   - **Business Name**: "CSOAI"
   - **Website**: "https://councilof.ai"
   - **Support Email**: "support@csoai.org"
   - **Support Phone**: "+1-XXX-XXX-XXXX"
   - **Support URL**: "https://councilof.ai/support"
3. Click "Save"

### 2.3 Update Branding

1. Go to https://dashboard.stripe.com/settings/branding
2. Upload CSOAI logo (PNG, JPG, or SVG)
3. Set brand colors:
   - **Primary Color**: #0066CC (CSOAI Blue)
   - **Accent Color**: #FF6B35 (CSOAI Orange)
4. Click "Save"

## Step 3: Configure Products & Pricing

### 3.1 Create Training Products

Create the following products in Stripe:

#### Product 1: CEASAI Fundamentals

```
Product Name: CEASAI Fundamentals
Description: 8-module AI Safety certification program
Type: Recurring (Subscription)
Recurring Billing Period: Monthly
```

**Pricing Options**:
- Monthly: €49/month
- Quarterly: €139/quarter (save €8)
- Annual: €449/year (save €139)

#### Product 2: CEASAI Professional

```
Product Name: CEASAI Professional
Description: 20-module advanced AI Safety certification
Type: Recurring (Subscription)
Recurring Billing Period: Monthly
```

**Pricing Options**:
- Monthly: €99/month
- Quarterly: €279/quarter (save €18)
- Annual: €899/year (save €289)

#### Product 3: CEASAI Specialist

```
Product Name: CEASAI Specialist
Description: 30-module expert AI Safety certification with capstone
Type: Recurring (Subscription)
Recurring Billing Period: Monthly
```

**Pricing Options**:
- Monthly: €199/month
- Quarterly: €549/quarter (save €48)
- Annual: €1,799/year (save €589)

### 3.2 Create Enterprise Products

#### Product 4: Enterprise Compliance Audit

```
Product Name: Enterprise Compliance Audit
Description: Comprehensive AI system compliance assessment
Type: One-time (One-off payment)
```

**Pricing**: €5,000

#### Product 5: Enterprise Subscription

```
Product Name: Enterprise Subscription
Description: Ongoing compliance monitoring and support
Type: Recurring (Subscription)
Recurring Billing Period: Monthly
```

**Pricing**: €2,000/month

### 3.3 Create API Access Products

#### Product 6: API Starter

```
Product Name: API Starter
Description: API access for developers (100 requests/minute)
Type: Recurring (Subscription)
Recurring Billing Period: Monthly
```

**Pricing**: €99/month

#### Product 7: API Professional

```
Product Name: API Professional
Description: API access for teams (1,000 requests/minute)
Type: Recurring (Subscription)
Recurring Billing Period: Monthly
```

**Pricing**: €499/month

#### Product 8: API Enterprise

```
Product Name: API Enterprise
Description: Unlimited API access with dedicated support
Type: Recurring (Subscription)
Recurring Billing Period: Monthly
```

**Pricing**: €999/month

### 3.4 How to Create Products in Stripe

1. Go to https://dashboard.stripe.com/products
2. Click "+ Add Product"
3. Fill in product details:
   - **Name**: Product name (e.g., "CEASAI Fundamentals")
   - **Description**: Product description
   - **Type**: Select "Recurring" or "One-time"
   - **Billing Period**: Select "Monthly", "Quarterly", or "Annual"
4. Under "Pricing", click "+ Add Price"
5. Enter the price in EUR (€)
6. Click "Save Product"

## Step 4: Configure Webhooks

### 4.1 Add Webhook Endpoint

1. Go to https://dashboard.stripe.com/webhooks
2. Click "+ Add Endpoint"
3. Enter your webhook URL:
   ```
   https://councilof.ai/api/webhooks/stripe
   ```
4. Select the following events to listen for:
   - `charge.succeeded`
   - `charge.failed`
   - `customer.created`
   - `customer.updated`
   - `customer.deleted`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `invoice.created`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `subscription.created`
   - `subscription.updated`
   - `subscription.deleted`
5. Click "Add Endpoint"

### 4.2 Copy Webhook Secret

After creating the webhook:

1. Click on the webhook endpoint
2. Copy the "Signing Secret"
3. Add to your environment variables:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

## Step 5: Get API Keys

### 5.1 Retrieve API Keys

1. Go to https://dashboard.stripe.com/apikeys
2. You'll see two keys:
   - **Publishable Key** (starts with `pk_test_`)
   - **Secret Key** (starts with `sk_test_`)

### 5.2 Add to Environment Variables

Add the following to your `.env` file:

```env
# Stripe API Keys (Test Mode)
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Frontend Stripe Key (for Stripe.js)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
```

### 5.3 Verify Keys in Application

The application already has Stripe integration configured. Verify:

1. Check `/server/routers/stripe.ts` for Stripe router
2. Check `/client/src/components/PaymentForm.tsx` for payment UI
3. Check `/server/index.ts` for webhook handler

## Step 6: Test Stripe Integration

### 6.1 Use Test Card Numbers

Stripe provides test card numbers for different scenarios:

**Successful Payment**:
```
Card Number: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/25)
CVC: Any 3 digits (e.g., 123)
```

**Declined Payment**:
```
Card Number: 4000 0000 0000 0002
Expiry: Any future date
CVC: Any 3 digits
```

**Requires Authentication**:
```
Card Number: 4000 0025 0000 3155
Expiry: Any future date
CVC: Any 3 digits
```

### 6.2 Test Payment Flow

1. Go to your application's payment page
2. Enter a test card number (4242 4242 4242 4242)
3. Complete the payment
4. Verify in Stripe Dashboard:
   - https://dashboard.stripe.com/payments
   - You should see the test payment listed

### 6.3 Test Subscription Flow

1. Go to your application's subscription page
2. Select a subscription plan
3. Enter a test card number
4. Complete the subscription
5. Verify in Stripe Dashboard:
   - https://dashboard.stripe.com/subscriptions
   - You should see the test subscription listed

## Step 7: Set Up Stripe Billing Portal

### 7.1 Configure Billing Portal

1. Go to https://dashboard.stripe.com/billing/portal/settings
2. Under "Branding", upload CSOAI logo
3. Under "Customer Portal", enable:
   - [ ] Allow customers to update their payment method
   - [ ] Allow customers to update their email
   - [ ] Allow customers to view invoices
   - [ ] Allow customers to cancel subscriptions
   - [ ] Allow customers to view billing history
4. Click "Save"

### 7.2 Generate Billing Portal Link

In your application code:

```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create a billing portal session
const session = await stripe.billingPortal.sessions.create({
  customer: customerId,
  return_url: 'https://councilof.ai/dashboard',
});

// Redirect user to billing portal
window.location.href = session.url;
```

## Step 8: Set Up Stripe Reporting

### 8.1 Enable Reporting

1. Go to https://dashboard.stripe.com/reports
2. Enable the following reports:
   - Revenue Recognition
   - Payouts
   - Disputes
   - Refunds
   - Tax Transactions

### 8.2 Schedule Reports

1. Go to https://dashboard.stripe.com/reports/scheduled
2. Create scheduled reports for:
   - Daily revenue summary
   - Weekly payout report
   - Monthly financial summary

## Step 9: Production Migration

### 9.1 When Ready for Production

When you're ready to go live:

1. Contact Stripe support to enable live mode
2. Request live API keys
3. Update environment variables with live keys:
   ```env
   STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
   STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
   STRIPE_WEBHOOK_SECRET=whsec_live_xxxxxxxxxxxxx
   ```
4. Update webhook endpoint URL to production domain
5. Test with real payment methods
6. Monitor for issues

### 9.2 Stripe Compliance

Before going live, ensure:

- [ ] PCI DSS compliance (handled by Stripe)
- [ ] Privacy policy updated with Stripe terms
- [ ] Terms of service updated with payment terms
- [ ] Refund policy clearly stated
- [ ] Tax configuration complete (VAT, sales tax)

## Step 10: Troubleshooting

### Issue: "Invalid API Key"

**Solution**: Verify you're using the correct key format:
- Publishable key starts with `pk_test_` or `pk_live_`
- Secret key starts with `sk_test_` or `sk_live_`

### Issue: "Webhook Signature Verification Failed"

**Solution**: Verify webhook secret:
1. Go to https://dashboard.stripe.com/webhooks
2. Copy the correct signing secret
3. Update `STRIPE_WEBHOOK_SECRET` in environment

### Issue: "Customer Not Found"

**Solution**: Ensure customer was created in Stripe:
```typescript
const customer = await stripe.customers.create({
  email: userEmail,
  name: userName,
});
```

### Issue: "Subscription Not Found"

**Solution**: Verify subscription was created:
```typescript
const subscription = await stripe.subscriptions.create({
  customer: customerId,
  items: [{ price: priceId }],
});
```

## Support

For Stripe support:

- **Documentation**: https://stripe.com/docs
- **Support**: https://support.stripe.com
- **Status**: https://status.stripe.com

For CSOAI support:

- **Email**: support@csoai.org
- **Phone**: +1-XXX-XXX-XXXX
- **Chat**: https://councilof.ai/support

---

**Next Steps**:
1. Claim your Stripe sandbox (before Feb 22, 2026)
2. Rebrand account to CSOAI
3. Create products and pricing
4. Configure webhooks
5. Test payment flows
6. Deploy to production

**Timeline**: 2-3 hours for complete setup
