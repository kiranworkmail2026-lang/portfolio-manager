# Portfolio Management App

## Overview
A portfolio management application where users register/login, upload an Excel file of their stock holdings, and view an interactive dashboard with charts and analytics. Built for local development first, then deployed across three platforms.

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | Next.js 14+ (App Router) | TypeScript, Tailwind CSS, Recharts |
| Backend | Go (net/http + Chi router) | REST API, JSON responses |
| File Parsing | excelize (Go) | Parse .xlsx/.csv uploads in memory |
| Auth | bcrypt (Go) + JWT | httpOnly cookies for token storage |
| Database | MongoDB Atlas + Go mongo-driver | Free M0 tier, official Go driver |
| Frontend Host | Vercel | Git-push deploy |
| Backend Host | Render | Free tier web service |

## Project Structure

```
portfolio-app/
├── CLAUDE.md
├── client/                          # Next.js frontend
│   ├── app/
│   │   ├── layout.tsx               # Root layout with providers
│   │   ├── page.tsx                 # Landing/redirect
│   │   ├── login/
│   │   │   └── page.tsx             # Login form
│   │   ├── register/
│   │   │   └── page.tsx             # Registration form
│   │   ├── dashboard/
│   │   │   └── page.tsx             # Charts + holdings table
│   │   └── upload/
│   │       └── page.tsx             # Excel file upload
│   ├── components/
│   │   ├── Navbar.tsx               # Nav with auth state
│   │   ├── PrivateRoute.tsx         # Auth guard wrapper
│   │   ├── FileUpload.tsx           # Drag-drop upload zone
│   │   ├── PieChart.tsx             # Sector allocation chart
│   │   ├── BarChart.tsx             # Top holdings chart
│   │   ├── HoldingsTable.tsx        # Full holdings table
│   │   └── SummaryCards.tsx         # Total value, P&L cards
│   ├── context/
│   │   └── AuthContext.tsx          # JWT auth state management
│   ├── lib/
│   │   └── api.ts                   # Axios instance with interceptors
│   ├── .env.local                   # NEXT_PUBLIC_API_URL=http://localhost:8080
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── next.config.js
│   └── package.json
├── server/                          # Go backend
│   ├── main.go                      # Entry point, router setup, server start
│   ├── go.mod
│   ├── go.sum
│   ├── .env                         # MONGODB_URI, JWT_SECRET, CLIENT_URL, PORT
│   ├── config/
│   │   └── db.go                    # MongoDB connection + client init
│   ├── models/
│   │   ├── user.go                  # User struct + MongoDB collection
│   │   └── portfolio.go             # Portfolio + Holding structs
│   ├── middleware/
│   │   ├── auth.go                  # JWT verification middleware
│   │   └── cors.go                  # CORS configuration
│   ├── handlers/
│   │   ├── auth.go                  # Register, Login, Me handlers
│   │   └── portfolio.go             # Upload, List, Get, Delete handlers
│   └── utils/
│       ├── jwt.go                   # Token generation + validation
│       └── parser.go                # Excel file parsing with excelize
```

## Data Models

### User
```
{
  _id:       ObjectID    (auto)
  name:      string      (required)
  email:     string      (required, unique, lowercase)
  password:  string      (bcrypt hashed)
  createdAt: timestamp   (auto)
  updatedAt: timestamp   (auto)
}
```

### Portfolio
```
{
  _id:        ObjectID   (auto)
  userId:     ObjectID   (ref: User)
  name:       string     (default: "My Portfolio")
  holdings:   []Holding
  uploadedAt: timestamp
  createdAt:  timestamp  (auto)
  updatedAt:  timestamp  (auto)
}
```

### Holding (embedded in Portfolio)
```
{
  symbol:       string   (required, uppercase)
  name:         string   (company name)
  quantity:     float64  (required, > 0)
  buyPrice:     float64  (required, >= 0)
  currentPrice: float64  (default: 0)
  sector:       string   (default: "Other")
  assetType:    string   (Stock | ETF | Bond | Crypto | Other)
}
```

## API Endpoints

### Auth
- `POST /api/auth/register` — body: { name, email, password } → sets httpOnly JWT cookie, returns user
- `POST /api/auth/login` — body: { email, password } → sets httpOnly JWT cookie, returns user
- `POST /api/auth/logout` — clears the JWT cookie
- `GET  /api/auth/me` — requires auth → returns current user

### Portfolio
- `POST   /api/portfolio/upload` — requires auth, multipart form: file + optional name → parses Excel, saves portfolio
- `GET    /api/portfolio` — requires auth → returns all user portfolios
- `GET    /api/portfolio/:id` — requires auth → returns single portfolio
- `DELETE /api/portfolio/:id` — requires auth → deletes portfolio

## Expected Excel Format

The upload parser should handle flexible column headers (case-insensitive). Minimum required: symbol + quantity.

| Symbol | Name | Quantity | BuyPrice | CurrentPrice | Sector | AssetType |
|--------|------|----------|----------|--------------|--------|-----------|
| AAPL | Apple Inc | 50 | 142.50 | 178.20 | Technology | Stock |
| MSFT | Microsoft | 30 | 280.00 | 338.50 | Technology | Stock |
| VTI | Vanguard Total Market | 100 | 200.00 | 220.50 | Index | ETF |

Accepted column aliases:
- symbol: ticker, symbol
- name: company, stock, name
- quantity: qty, shares, quantity
- buyPrice: buy_price, price, cost, avgprice
- currentPrice: current_price, market_price, ltp
- sector: industry, sector
- assetType: asset_type, type

## Build Phases

### Phase 1 — Go backend scaffold + MongoDB connection
Set up the Go module, install dependencies (chi, mongo-driver, excelize, bcrypt, jwt-go, godotenv). Create main.go with Chi router, CORS middleware, and a health check endpoint at GET /api/health. Set up MongoDB connection in config/db.go. Create User and Portfolio model structs in models/. Test that the server starts and connects to MongoDB Atlas.

Dependencies:
- github.com/go-chi/chi/v5
- github.com/go-chi/cors
- go.mongodb.org/mongo-driver
- github.com/xuri/excelize/v2
- golang.org/x/crypto/bcrypt
- github.com/golang-jwt/jwt/v5
- github.com/joho/godotenv

### Phase 2 — Auth system
Build handlers/auth.go with Register and Login handlers. Register hashes the password with bcrypt, checks for duplicate emails, inserts into MongoDB, and sets an httpOnly JWT cookie. Login verifies credentials and sets the cookie. Build middleware/auth.go that reads the JWT from the cookie, validates it, and injects the user ID into the request context. Add a /api/auth/me endpoint that returns the current user. Add /api/auth/logout that clears the cookie.

### Phase 3 — Excel upload + portfolio CRUD
Build utils/parser.go that takes a multipart file, reads it with excelize, normalizes headers (case-insensitive), and returns a slice of Holding structs. Build handlers/portfolio.go with Upload (POST), List (GET), GetOne (GET /:id), and Delete (DELETE /:id) handlers. Upload handler uses the parser, validates holdings (symbol required, quantity > 0), and saves to MongoDB. All portfolio endpoints require auth middleware.

### Phase 4 — Next.js frontend scaffold
Create the Next.js app with TypeScript and Tailwind. Set up the App Router with layout.tsx. Create AuthContext that checks /api/auth/me on mount, stores user state, and provides login/logout/register functions. Create lib/api.ts with an Axios instance that points to NEXT_PUBLIC_API_URL with withCredentials: true for cookies. Build the Navbar component showing auth state.

### Phase 5 — Auth pages
Build login/page.tsx and register/page.tsx with forms. On submit, call the API through the Axios instance. On success, update AuthContext and redirect to /dashboard. Show error messages for invalid credentials or duplicate emails. Create PrivateRoute component that redirects to /login if not authenticated.

### Phase 6 — Upload page + Dashboard
Build upload/page.tsx with a file input (accept .xlsx, .csv). On submit, send as FormData to POST /api/portfolio/upload. Show upload progress and success/error states. Redirect to dashboard on success.

Build dashboard/page.tsx that fetches portfolios from GET /api/portfolio and renders:
1. SummaryCards — total invested (sum of quantity × buyPrice), current value (sum of quantity × currentPrice), total P&L (difference), P&L percentage
2. PieChart — sector allocation by current value (using Recharts PieChart)
3. BarChart — top 10 holdings by current value (using Recharts BarChart)
4. HoldingsTable — all holdings with columns: symbol, name, quantity, buy price, current price, P&L ($), P&L (%), sector

### Phase 7 — Local end-to-end testing
Test the complete flow locally:
1. Start Go server on :8080
2. Start Next.js on :3000
3. Register a new user
4. Login
5. Upload a sample Excel file
6. Verify dashboard renders charts correctly
7. Check MongoDB Atlas to confirm data

### Phase 8 — Deployment
Deploy backend to Render:
- Create Web Service, point to server/ directory
- Set environment: MONGODB_URI, JWT_SECRET, CLIENT_URL (Vercel URL), PORT=8080
- Build command: go build -o app main.go
- Start command: ./app

Deploy frontend to Vercel:
- Import client/ directory
- Set environment: NEXT_PUBLIC_API_URL (Render URL)
- Framework preset: Next.js

Post-deploy:
- Update Go CORS to allow Vercel domain
- Update JWT cookie settings: Secure=true, SameSite=None for cross-domain
- Test full flow on production URLs

## Local Development

### Prerequisites
- Go 1.21+
- Node.js 18+
- MongoDB Atlas account (free M0 cluster)

### Running locally
Terminal 1 (backend):
```bash
cd server
cp .env.example .env   # fill in MONGODB_URI and JWT_SECRET
go mod tidy
go run main.go          # starts on :8080
```

Terminal 2 (frontend):
```bash
cd client
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL=http://localhost:8080
npm install
npm run dev                  # starts on :3000
```

### Environment Variables

server/.env:
```
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/portfolio-app
JWT_SECRET=<random-64-char-string>
CLIENT_URL=http://localhost:3000
PORT=8080
```

client/.env.local:
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Coding Conventions
- Go: standard library formatting (gofmt), error handling with explicit returns, no panics in handlers
- TypeScript: strict mode, functional components, named exports
- All API responses: JSON with { data } on success, { message } on error
- HTTP status codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error
- MongoDB collection names: "users", "portfolios"
