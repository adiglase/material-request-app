# Material Request Application

Material Request management system built with NestJS, Next.js, and PostgreSQL for my technical take home test.

## Tech Stack

- **Backend**: NestJS with TypeORM
- **Frontend**: Next.js (App Router)
- **Database**: PostgreSQL

## Prerequisites

- Node.js 18+ (tested in Node.js 24)
- PostgreSQL 14+ (tested in Postgres 17)

## Repository Structure

```
backend/    NestJS API (port 3001)
frontend/   Next.js application (port 3000)
database/   SQL schema and seed files
```

## Database Setup

Create the database first (replace `<user>` with your PostgreSQL username):

```bash
psql -U <user> -c "CREATE DATABASE material_request_db;"
```

Then run the schema and (optionally) the seed data:

```bash
psql -h localhost -U <user> -d material_request_db -f database/schema.sql
psql -h localhost -U <user> -d material_request_db -f database/seed.sql
```

## Backend Setup

```bash
cd backend
cp .env.example .env   # then edit .env with your database credentials
npm install
npm run start:dev
```

The API will be available at `http://localhost:3001`.

**Environment variables (`backend/.env`):**

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | Port the API listens on |
| `DATABASE_HOST` | `localhost` | PostgreSQL host |
| `DATABASE_PORT` | `5432` | PostgreSQL port |
| `DATABASE_USER` | `postgres` | PostgreSQL user |
| `DATABASE_PASSWORD` | `postgres` | PostgreSQL password |
| `DATABASE_NAME` | `material_request_db` | Database name |

## Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

**Environment variables (`frontend/.env`):**

| Variable | Default | Description |
|---|---|---|
| `API_BASE_URL` | `http://localhost:3001` | Backend API base URL |

## What Is Implemented

- Create a material request with one or more material detail rows
- List requests with server-side filtering by request number, requester name, and date range
- Paginated list response with total count and page metadata
- Edit an existing request and its detail rows (the edit form also serves as the detail view)
- Delete a request (cascades to its detail rows automatically)
- Field validation on both the backend (DTOs) and the frontend form

## API Overview

Base URL: `http://localhost:3001`

| Method | Path | Description |
|---|---|---|
| `GET` | `/material-requests` | List requests with filtering and pagination |
| `GET` | `/material-requests/:id` | Get one request with all its detail rows |
| `POST` | `/material-requests` | Create a new request |
| `PUT` | `/material-requests/:id` | Replace an existing request and its details |
| `DELETE` | `/material-requests/:id` | Delete a request (returns 204) |

**List query parameters (`GET /material-requests`):**

| Parameter | Type | Description |
|---|---|---|
| `requestNumber` | string | Partial, case-insensitive match |
| `requesterName` | string | Partial, case-insensitive match |
| `requestDateFrom` | YYYY-MM-DD | Inclusive lower bound on request date |
| `requestDateTo` | YYYY-MM-DD | Inclusive upper bound on request date |
| `page` | integer (min 1) | Page number, default `1` |
| `pageSize` | integer (1–50) | Results per page, default `10` |

**List response shape:**

```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "pageSize": 10,
    "total": 37,
    "totalPages": 4
  }
}
```

## Schema Overview

Two tables with a one-to-many relationship:

**`material_requests`** (request header)

| Column | Type | Notes |
|---|---|---|
| `id` | serial | Primary key |
| `request_number` | varchar(30) | Unique, required |
| `request_date` | date | Required |
| `requester_name` | varchar(100) | Required |
| `purpose` | text | Required |
| `notes` | text | Optional |
| `created_at` | timestamptz | Auto-set |
| `updated_at` | timestamptz | Auto-set |

**`material_details`** (one request → many detail rows)

| Column | Type | Notes |
|---|---|---|
| `id` | serial | Primary key |
| `request_id` | integer | FK to `material_requests.id`, cascades on delete |
| `name` | varchar(150) | Required |
| `description` | text | Required |
| `category` | varchar(50) | Required |
| `specification` | text | Optional |
| `quantity` | numeric(12,2) | Required, must be > 0 |
| `unit` | varchar(30) | Required |
| `remarks` | text | Optional |
| `created_at` | timestamptz | Auto-set |
| `updated_at` | timestamptz | Auto-set |

## Key Technical Decisions

**Server-side filtering and offset pagination**: All filtering and pagination happens in the database query. Offset pagination (`LIMIT` / `OFFSET`) was chosen over cursor-based pagination because the dataset is small.

**No ORM migrations**: Schema is managed through plain SQL files in `database/`. `synchronize: false` in TypeORM ensures the ORM never auto-modifies the database schema. This is based on the test description that require to include the DB schema.

**Database indexes**: Three indexes are defined to support the actual query patterns:

- `(request_date DESC, id DESC)` on `material_requests`: matches the default sort order of the list query exactly, so PostgreSQL can satisfy the sort without a separate sort step
- `(requester_name)` on `material_requests`: supports the requester name filter which uses a `ILIKE` pattern match
- `(request_id)` on `material_details`: speeds up the join when fetching a single request with all its detail rows

## Tradeoffs and Non-Goals

- No authentication or authorization, out of scope, not enough time
- No file uploads, approval workflows, or real-time features
- No complex client-side state management for simplicity
- No automated tests to save time