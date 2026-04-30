# 🎬 Movie Ticketing System API

A production-ready backend-only REST API for a Movie Ticketing System built with **Node.js, TypeScript, Express, TypeORM, and PostgreSQL**.

This system is designed with a strong focus on **correctness under concurrency**, ensuring no double booking of seats even under high load.

---

## 🚀 Features

### Core Features
- **Admin Management**: Movies, Screens, Showtimes
- **Customer Booking Flow**: Browse → Select Seats → Reserve → Confirm
- **Seat Inventory**: Dynamic inventory generation per showtime
- **Two-step Booking**: Hold (10 min) + Confirm (Payment)

### System Highlights & Correctness
- **Concurrency Control**: Pessimistic Locking (`SELECT ... FOR UPDATE`) with `NOWAIT` for fail-fast behavior.
- **Timezone Standardization**: Global standardization to **Indian Standard Time (IST - Asia/Kolkata)** using `Luxon`, while maintaining **UTC** in the database.
- **Deadlock Prevention**: Deterministic row-locking (ordered by ID) to prevent circular wait conditions.
- **Idempotency**: `Idempotency-Key` support for seat reservations to prevent double-booking on network retries.
- **Background Jobs**: Optimized cron jobs using `SKIP LOCKED` to clean up expired holds without blocking active users.
- **Authentication**: Secure JWT (Access + Refresh Tokens) with RBAC.
- **Rate Limiting**: Tiered limits for Auth, Bookings, and General APIs.
- **API Documentation**: Interactive Swagger/OpenAPI 3.0 docs.

---

## 🏗️ Tech Stack

| Layer | Technology |
|------|----------|
| Runtime | Node.js 20+ |
| Language | TypeScript |
| Framework | Express.js |
| ORM | TypeORM |
| Database | PostgreSQL |
| Date/Time | Luxon |
| Testing | Jest + Supertest |
| Docs | Swagger (OpenAPI 3.0) |

---

## ⚙️ Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/BirjuSavani/movie-ticketing-system.git
cd movie-ticketing-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
cp .env.example .env
```
Update all required environment variables.

### 4. Database Setup
```sql
CREATE DATABASE movie_ticketing;
CREATE DATABASE movie_ticketing_test;
```

Run migrations:
```bash
npm run migration:run
```

(Optional seed data)
```bash
npm run seed
```

### 5. Run Application
**Development**
```bash
npm run dev
```

**Production**
```bash
npm run build
npm start
```

---

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server Port |
| `NODE_ENV` | Environment (development/production/test) |
| `DB_HOST` | Database Host |
| `DB_NAME` | Main Database Name |
| `ACCESS_TOKEN_SECRET` | JWT Access Secret |
| `REFRESH_TOKEN_SECRET`| JWT Refresh Secret |
| `SEAT_HOLD_DURATION_MINUTES` | Seat Hold Duration (default: 10) |

---

## 📚 API Overview

Swagger documentation available at:
`GET /api/docs`

### Endpoint Groups
| Group | Description |
|-------|-------------|
| `/api/v1/auth` | Registration, Login, Token Refresh |
| `/api/v1/movies` | Movie Browsing & Management |
| `/api/v1/screens` | Screen & Seat Configuration |
| `/api/v1/showtimes`| Showtime Management & Seat Availability |
| `/api/v1/bookings` | Seat Reservation & Payment Confirmation |

---

## 👥 Role-Based Access Control (RBAC)
- **Admin**: Full access to manage movies, screens, and showtimes.
- **Customer**: Access to browse movies, view showtimes, and book seats.
- Unauthorized access returns `403 Forbidden`.

---

## 💰 Pricing Logic
- **Standard Seats**: `basePrice`
- **Premium Seats**: `basePrice × 1.5`
- **VIP Seats**: `basePrice × 2.0`

---

## 🎟️ Booking Flow

### Step 1 — Reserve Seats
`POST /bookings/reserve`
- Validates seat availability.
- Acquires pessimistic locks on selected seats.
- Sets status to `held` with a 10-minute expiry.
- Uses **Idempotency Key** to handle retries safely.

### Step 2 — Confirm Booking
`POST /bookings/:id/confirm`
- Validates that the hold is still active.
- Updates seat status to `booked`.
- Transitions booking to `confirmed`.
- Generates payment reference.

---

## ⏱️ Background Job (Hold Expiry)
Runs every minute to:
- Identify expired seat holds using `SKIP LOCKED` (non-blocking).
- Revert seats to `available`.
- Mark associated pending bookings as `expired`.

---

## ⚠️ Error Handling
All error responses follow a standardized format:
```json
{
  "success": false,
  "error": {
    "code": "SEAT_UNAVAILABLE",
    "message": "One or more selected seats are no longer available.",
    "details": []
  }
}
```

### Common Error Codes
- `SEAT_UNAVAILABLE`: Seat is already held or booked.
- `SHOWTIME_EXPIRED`: Booking attempted within 5 mins of showtime start.
- `HIGH_CONTENTION`: Database lock timeout (fail-fast).
- `IDEMPOTENCY_CONFLICT`: Retried request with different parameters.

---

## 🧪 Testing

**Run all tests:**
```bash
npm test
```

**Coverage:**
```bash
npm run test:coverage
```

**Concurrency Test:**
*(Verifies 1 success, 9 failures for 10 simultaneous requests for the same seat)*
```bash
npm run test:concurrency
```

---

## 🔥 Concurrency Strategy

### Pessimistic Locking (`SELECT ... FOR UPDATE`)
- **Why?** Prevents double-booking at the database level.
- **Safety**: Uses `NOWAIT` to avoid thundering herd and connection pool exhaustion.
- **Deterministic Order**: Locks seats in ascending order of ID to prevent deadlocks.
- **Integrity**: Backed by a partial unique index on `SeatInventory` for defense-in-depth.

---

## 🚀 Future Improvements
- **Redis Integration**: Distributed caching for movie lists and showtimes.
- **WebSocket**: Real-time seat map updates.
- **Payment Gateway**: Integration with Stripe or Razorpay.

---

## 📦 Project Structure
```text
src/
  config/    # Environment & DB configuration
  database/  # TypeORM entities (Data Models), Migrations, Seeds
  docs/      # API Documentation (Swagger/OpenAPI)
  jobs/      # Cron jobs (Hold expiry)
  messages/  # Error messages and success messages
  middleware/# Auth, Validation, Error, Rate limiting
  modules/   # Feature-based modules (Auth, Movies, Bookings, etc.)
  routes/    # API routes for modules
  utils/     # Time, AppError, Logger helpers
  app.ts     # Express app configuration
  server.ts  # Server entry point & graceful shutdown
```

---

## ✅ Submission Checklist
- [x] Swagger available at `/api/docs`
- [x] Concurrency strategy documented & tested
- [x] IST Timezone standardization implemented
- [x] Idempotency support added
- [x] No hardcoded secrets
- [x] TypeScript compiles cleanly

---

**🎯 Key Focus**: This system prioritizes **correctness under concurrency** and **production-grade robustness**.
