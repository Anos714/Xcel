<div align="center">

# Xcel — Backend

AI-powered automation engine for **X (Twitter)**.

> Built with Bun, Express, Drizzle ORM, BullMQ, Gemini AI, Tavily Search, and Buffer API.

</div>

---

## Overview

The Xcel backend is a queue-driven REST API that powers the full tweet automation lifecycle. It continuously searches the web for relevant content using Tavily, generates context-aware tweets with Gemini AI, stores them in PostgreSQL, and publishes them to X (Twitter) via Buffer — all on a configurable schedule.

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Bun | Latest | JavaScript Runtime |
| Express | ^5.2.1 | REST API Framework |
| TypeScript | ^5 | Type Safety |
| Drizzle ORM | ^1.0.0-rc.4 | ORM |
| Drizzle Kit | ^1.0.0-rc.4 | Database Migrations |
| PostgreSQL (Neon) | Latest | Cloud Database |
| BullMQ | ^5.80.0 | Queue & Background Jobs |
| ioredis (Upstash) | 5.10.1 | Redis Client |
| Pino | ^10.3.1 | Structured Logging |
| Zod | ^4.4.3 | Request Validation |
| Dotenv | ^17.4.2 | Environment Variables |
| `@google/genai` | ^2.10.0 | Gemini AI SDK |
| `@tavily/core` | ^0.7.6 | Tavily Search SDK |

---

## Architecture

```text
Routes
   │
   ▼
Controllers        (request parsing, calling services, returning response)
   │
   ▼
Services           (all business logic)
   │
   ├──────────────► Gemini AI    (tweet generation)
   ├──────────────► Tavily       (real-time web search)
   ├──────────────► Buffer API   (tweet publishing)
   ├──────────────► BullMQ       (job enqueue)
   │
   ▼
Drizzle ORM
   │
   ▼
PostgreSQL (Neon)
```

---

## Automation Flow

```text
User Topics (queries table)
         │
         ▼
Automation Worker (BullMQ)
         │
         ▼
Tavily Search — fetch real-time articles
         │
         ▼
Gemini AI — generate tweet from results
         │
         ▼
Tweets Table — status: pending
         │
         ▼
Posting Scheduler (BullMQ cron)
         │
         ▼
Posting Worker
         │
         ▼
Buffer API
         │
         ▼
X (Twitter)
```

---

## Project Structure

```text
backend/
│
├── src/
│   ├── app.ts                    # Express app setup
│   ├── server.ts                 # Entry point
│   │
│   ├── config/
│   │   ├── env.ts                # Validated environment variables
│   │   ├── gemini.ts             # Gemini AI client
│   │   ├── redis.ts              # Upstash Redis client
│   │   └── tavily.ts             # Tavily Search client
│   │
│   ├── controllers/
│   │   ├── automation.controller.ts
│   │   ├── dashboard.controller.ts
│   │   ├── query.controller.ts
│   │   ├── settings.controllers.ts
│   │   └── tweet.controller.ts
│   │
│   ├── db/
│   │   ├── index.ts              # Drizzle + Neon connection
│   │   └── schema.ts             # Table definitions
│   │
│   ├── jobs/
│   │   └── scheduler.ts          # BullMQ repeatable job registration
│   │
│   ├── lib/
│   │   └── logger.ts             # Pino logger instance
│   │
│   ├── middlewares/
│   │   ├── error.middleware.ts   # Global error handler
│   │   └── validate.middleware.ts
│   │
│   ├── prompts/
│   │   └── generateTweet.prompt.ts
│   │
│   ├── queues/
│   │   ├── automation.queue.ts
│   │   └── posting.queue.ts
│   │
│   ├── routes/
│   │   ├── automation.routes.ts
│   │   ├── dashboard.route.ts
│   │   ├── dev.route.ts
│   │   ├── query.route.ts
│   │   ├── settings.route.ts
│   │   └── tweet.route.ts
│   │
│   ├── services/
│   │   ├── automation.service.ts
│   │   ├── buffer.service.ts
│   │   ├── dashboard.service.ts
│   │   ├── gemini.service.ts
│   │   ├── query.service.ts
│   │   ├── settings.service.ts
│   │   ├── tavily.service.ts
│   │   └── tweet.service.ts
│   │
│   ├── utils/
│   │   ├── AppError.ts
│   │   ├── catchAsync.ts
│   │   ├── formatSearchResults.ts
│   │   └── sendResponse.ts
│   │
│   ├── validators/
│   │   ├── query.validator.ts
│   │   ├── settings.validator.ts
│   │   └── tweet.validator.ts
│   │
│   └── workers/
│       ├── automation.worker.ts
│       └── posting.worker.ts
│
└── drizzle/                      # Auto-generated migration files
```

---

## Database Schema

```text
┌────────────────────────────┐
│          queries           │
├────────────────────────────┤
│ id (uuidv7)   PK          │
│ query                      │
│ active                     │
│ created_at                 │
│ updated_at                 │
└──────────────┬─────────────┘
               │ query (FK reference in tweets)
               ▼
┌────────────────────────────┐
│          tweets            │
├────────────────────────────┤
│ id (uuidv7)   PK          │
│ content                    │
│ hashtags[]                 │
│ query                      │
│ type          (auto/custom)│
│ status        (pending/    │
│               posted/failed│
│ scheduled_for              │
│ posted_at                  │
│ created_at                 │
│ updated_at                 │
└────────────────────────────┘

┌────────────────────────────┐
│         settings           │
├────────────────────────────┤
│ id (uuidv7)   PK          │
│ automation_enabled         │
│ posting_times   (jsonb)    │
│ automation_times (jsonb)   │
│ timezone                   │
│ created_at                 │
│ updated_at                 │
└────────────────────────────┘
```

---

## API Routes

### Tweets

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/tweets` | Get all tweets (paginated, filterable) |
| `POST` | `/api/v1/tweets` | Create a custom tweet |
| `PATCH` | `/api/v1/tweets/:tweetId` | Update a tweet |
| `DELETE` | `/api/v1/tweets/:tweetId` | Delete a tweet |
| `POST` | `/api/v1/tweets/enhance` | AI-enhance tweet content via Gemini |

### Queries (Topics)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/queries` | Get all topics |
| `POST` | `/api/v1/queries` | Add a new topic |
| `PATCH` | `/api/v1/queries/:id` | Toggle active / update |
| `DELETE` | `/api/v1/queries/:id` | Delete a topic |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/dashboard` | Aggregate stats |

### Settings

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/settings` | Get current settings |
| `PATCH` | `/api/v1/settings/:settingId` | Update settings |

### Automation

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/automation/run` | Manually trigger the automation cycle |

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values.

```env
# Server
PORT=8080
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database (Neon PostgreSQL)
DATABASE_URL=<your_neon_connection_string>

# Redis (Upstash)
UPSTASH_REDIS_URL=<your_upstash_redis_url>

# AI
GEMINI_API_KEY=<your_gemini_api_key>
TAVILY_API_KEY=<your_tavily_api_key>

# Publishing
BUFFER_ACCESS_TOKEN=<your_buffer_access_token>
BUFFER_CHANNEL_ID=<your_buffer_channel_id>
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed
- A [Neon](https://neon.tech) PostgreSQL database
- An [Upstash](https://upstash.com) Redis instance
- A [Gemini API](https://aistudio.google.com) key
- A [Tavily API](https://tavily.com) key
- A [Buffer](https://buffer.com) account with a channel access token

### Setup

```bash
# From the project root
cd backend

# Install dependencies
bun install

# Configure environment
cp .env.example .env
# Fill in your values in .env

# Run database migrations
bun run db:generate
bun run db:migrate

# Start the development server
bun run dev
```

The API will be available at:

```
http://localhost:8080
```

### Other Scripts

```bash
# Start production server
bun run start

# Open Drizzle Studio (database GUI)
bun run db:studio
```

---

## BullMQ Workers

The backend runs two background workers:

| Worker | Trigger | Responsibility |
|--------|---------|----------------|
| `automation.worker` | Scheduled cron | Search Tavily → Generate tweet via Gemini → Save to DB |
| `posting.worker` | Scheduled cron | Fetch pending tweet → Publish via Buffer → Update status |

Schedules are user-configurable via the Settings API and stored in the `settings` table as JSONB.

---

## License

MIT License — feel free to fork and build upon this project.
