# Activate direct project inquiry email

The form now posts to /api/inquiry and sends the brief through Resend. Visitors do not need an email application. Success is shown only after the provider returns an accepted email ID; provider acceptance is not a guarantee of inbox delivery.

## One-time setup in the EXISTING Vercel project

1. Create and verify a Resend account using mohsabmdr@gmail.com at https://resend.com/signup . The recipient is fixed to that address in server code. Do not use a different signup email for the initial setup below.
2. In Resend > API Keys create a sending key. Enter it directly in Vercel > your existing project > environment variables as RESEND_API_KEY. Type: Secret. Enable Production and Preview as needed. Never upload the key to GitHub or use a NEXT_PUBLIC_ prefix.
3. For the initial setup, the default sender is Me4qan Portfolio <onboarding@resend.dev>. Resend restricts this sender to your own verified account email. This works for testing the portfolio-to-owner flow when the account email matches the fixed recipient. For a branded production sender, verify a domain you own in Resend and set INQUIRY_FROM_EMAIL to an address on it, such as Me4qan <hello@yourdomain.com>. Your Vercel subdomain is not a domain you own for email verification; do not put a Gmail address in the sender field.
4. Upload the updated files to the same GitHub repository and commit to main. Vercel deploys the updated source. If you add/change the key after deployment, redeploy again. The website domain does not need to change.
5. Submit a clearly labelled test inquiry on the live site and verify it appears in Resend > Emails and in your Gmail inbox (check spam). Reply should address the visitor email. Do not declare setup complete before receipt is confirmed. No real email was sent by the local automated tests.

The API validates fields on the server, rejects cross-origin browser submissions, fixes the recipient, uses a honeypot, and reuses idempotency keys for retries. A per-instance attempt limit reduces repeated requests but is not a distributed rate limiter; provider quotas still apply and persistent high abuse would need a shared limiter or bot challenge. Request details are transmitted to Resend and the recipient mailbox; no inquiry database is used. The server logs a generic failure, not the visitor's brief or API key.

Local checks: npm run test:inquiry, npm run typecheck, npm run lint. Set RESEND_API_KEY in .env.local to test real sending yourself. Without it, the form shows a configuration error and retains entered details.

Provider references:
https://resend.com/docs/api-reference/emails/send-email
https://resend.com/docs/api-reference/errors
