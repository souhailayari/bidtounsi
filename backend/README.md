# BidTounsi Backend

Minimal Express + TypeScript backend for the BidTounsi project.

Features:
- MongoDB via Mongoose
- Auth (register/login) with JWT
- Vehicles CRUD endpoints

Setup:
1. Copy `.env.example` to `.env` and set `MONGODB_URI` and `JWT_SECRET`.
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`

Endpoints:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/vehicles
- POST /api/vehicles

