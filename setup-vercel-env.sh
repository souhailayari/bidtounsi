#!/bin/bash
# Script to add environment variables to Vercel

echo "Adding environment variables to Vercel..."

vercel env add MONGODB_URI --yes < /dev/null
vercel env add JWT_SECRET --yes < /dev/null
vercel env add ADMIN_KEY --yes < /dev/null
vercel env add EMAIL_USER --yes < /dev/null
vercel env add GMAIL_APP_PASSWORD --yes < /dev/null
vercel env add FRONTEND_URL --yes < /dev/null
vercel env add NODE_ENV --yes < /dev/null
vercel env add DEBUG --yes < /dev/null
vercel env add TZ --yes < /dev/null

echo "Environment variables added!"
echo "Redeploying..."
vercel --prod --skip-domain

echo "Done!"
