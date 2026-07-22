<div align="center">

# Xcel — Architecture

Technical architecture reference for the Xcel monorepo.

</div>

---

## Monorepo Structure

```text
xolo/
├── backend/          # Express + Bun API, workers, scheduler
├── frontend/         # Next.js dashboard
├── docs/             # Architecture, API, and database documentation
└── README.md         # Project overview
```

---

## High-Level System Diagram

```text
                              Xcel

                         ┌──────────────┐
                         │   Frontend   │
                         │   Next.js    │
                         └──────┬───────┘
                                │
                        REST API (HTTP)
                                │
                                ▼
                     ┌─────────────────────┐
                     │  Express + Bun API  │
                     │   /api/v1/*         │
                     └─────────┬───────────┘
                               │
        ┌──────────────┬───────┴─────────────┬──────────────┐
        ▼              ▼                     ▼              ▼
   Controllers      Services            Validators      Middleware
        │              │
        └──────────────┼──────────────────────────────────────┐
                       ▼                                      ▼
                Business Logic                      BullMQ Scheduler
                       │                                      │
                       ▼                                      ▼
                 Drizzle ORM                      Automation / Posting
                       │                                Workers
                       ▼                                      │
                PostgreSQL (Neon)                             │
                       │                                      │
                       └──────────────┬───────────────────────┘
                                      ▼
                               External APIs
                    ┌──────────┬──────────┬──────────┐
                    │ Gemini AI│  Tavily  │  Buffer  │
                    └──────────┴──────────┴──────────┘
                                      │
                                      ▼
                                X (Twitter)
```

---

## Backend Architecture

### Request Lifecycle

Every HTTP request flows through a strict, single-direction pipeline:

```text
Incoming Request
       │
       ▼
  CORS + Body Parsing Middleware
       │
       ▼
  Route Handler  (express Router)
       │
       ▼
  Zod Validation  (via validator schema)
       │
       ▼
  Controller  (parse request → call service → return response)
       │
       ▼
  Service  (all business logic, DB queries, external API calls)
       │
       ├────────────► Drizzle ORM → PostgreSQL (Neon)
       ├────────────► Gemini AI   (tweet generation / enhancement)
       ├────────────► Tavily      (web search)
       ├────────────► Buffer API  (tweet publishing)
       └────────────► BullMQ      (enqueue jobs)
       │
       ▼
  sendResponse()  (consistent JSON envelope)
       │
       ▼
  Error Middleware  (catches any thrown errors)
```

### Layer Responsibilities

| Layer | File(s) | Responsibility |
|-------|---------|----------------|
| **Config** | `src/config/` | Initialize and export external clients (Gemini, Tavily, Redis) |
| **Routes** | `src/routes/` | Define URL paths and attach controllers |
| **Controllers** | `src/controllers/` | Validate request, call service, return response. No business logic |
| **Services** | `src/services/` | All business logic: DB queries, AI calls, Buffer publishing |
| **Validators** | `src/validators/` | Zod schemas for request body/query/param validation |
| **Workers** | `src/workers/` | BullMQ consumers — run automation and posting jobs |
| **Queues** | `src/queues/` | BullMQ queue instances shared between services and workers |
| **Jobs** | `src/jobs/` | Register repeatable cron jobs on startup |
| **Middleware** | `src/middlewares/` | Global error handler, validation helpers |
| **Utils** | `src/utils/` | `sendResponse`, `catchAsync`, `AppError`, result formatters |
| **Prompts** | `src/prompts/` | Gemini AI prompt templates |
| **DB** | `src/db/` | Drizzle client instance and schema definitions |

---

## Background Job Architecture

The scheduler and workers run alongside the HTTP server in the same Bun process.

### Job Initialization Flow

```text
server.ts starts
       │
       ▼
app.ts registers routes
       │
       ▼
scheduler.ts registers repeatable BullMQ jobs
       │
       ├── Automation jobs  (based on settings.automationTimes)
       └── Posting jobs     (based on settings.postingTimes)
```

### Workers

| Worker | Queue | Cron | Job |
|--------|-------|------|-----|
| `automation.worker` | `automationQueue` | `settings.automationTimes` | Search → Generate → Save tweets |
| `posting.worker` | `postingQueue` | `settings.postingTimes` | Fetch pending → Post to Buffer → Update status |

### Automation Worker Flow

```text
BullMQ triggers automation job
          │
          ▼
Pick active queries from DB
          │
          ▼
For each query:
  ├── Search Tavily (real-time web results)
  ├── Format search results
  ├── Build Gemini prompt
  ├── Call Gemini API → structured JSON tweet
  └── Save to tweets table (status: pending)
```

### Posting Worker Flow

```text
BullMQ triggers posting job
          │
          ▼
Fetch oldest pending tweet from DB
          │
          ▼
Call Buffer API → publish to X (Twitter)
          │
     ┌────┴────┐
     ▼         ▼
 Success      Failed
     │         │
Update status  BullMQ retry
  posted         │
  postedAt    Update status: failed
                (after max retries)
```

---

## Automation Tweet Generation Flow

```text
User Topics (queries table)
        │  active = true
        ▼
Automation Worker picks random queries
        │
        ▼
Tavily Search API
  - Real-time web articles
  - Structured results per query
        │
        ▼
formatSearchResults()
  - Merge results from multiple queries
  - Trim to relevant content
        │
        ▼
generateTweet.prompt.ts
  - Inject formatted results into prompt template
        │
        ▼
Gemini AI (gemini-2.0-flash)
  - Returns structured JSON: { content, hashtags }
        │
        ▼
tweets table
  - type: "automation"
  - status: "pending"
  - query: "<source topic>"
```

---

## Custom Tweet Flow

```text
User (Frontend)
      │
      ▼
POST /api/v1/tweets
      │
      ▼
tweetSchema validation (Zod)
  - postType: "now" | "scheduled"
  - scheduledFor required if postType = "scheduled"
      │
      ▼
tweetService.createTweet()
  - Insert into tweets table
  - type: "custom"
  - status: "pending" (or "draft")
      │
  (Optional)
      ▼
POST /api/v1/tweets/enhance
  - Pass content to Gemini AI
  - Returns improved tweet text
      │
      ▼
User edits and confirms
      │
      ▼
Posting Worker picks up at scheduled time
      │
      ▼
Buffer API → X (Twitter)
```

---

## Frontend Architecture

### Data Flow

```text
Page Component
      │
      ▼
TanStack Query Hook      (useTweets, useDashboard, …)
  - Caches server state
  - Handles loading / error states
      │
      ▼
API Layer                (src/api/)
  - Axios instance (src/lib/axios.ts)
  - Configured with NEXT_PUBLIC_API_URL base URL
      │
      ▼
Xcel Backend             (Express REST API)
```

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| TanStack Query for server state | Automatic caching, background refetch, and stale-while-revalidate |
| Axios instance with base URL | Single configuration point; easy to swap environments |
| App Router route groups | `(dashboard)` group shares layout (sidebar + navbar) without affecting the URL |
| Zod + React Hook Form | Co-locate frontend validation schema with form logic |
| shadcn/ui | Unstyled, accessible components with full Tailwind customisation |

---

## External Services

| Service | SDK | Usage |
|---------|-----|-------|
| **Gemini AI** | `@google/genai` | Generate tweets from search results; AI-enhance user drafts |
| **Tavily Search** | `@tavily/core` | Real-time web search to gather source material per topic |
| **Buffer API** | REST (fetch) | Publish approved tweets to the connected X (Twitter) account |
| **Neon PostgreSQL** | `@neondatabase/serverless` + Drizzle ORM | Primary database |
| **Upstash Redis** | `ioredis` | BullMQ job queue and result storage |

---

## Configuration

All environment-specific values are validated at startup via `src/config/env.ts` using Zod. The app will not start if any required variable is missing.

```text
.env
  │
  ▼
src/config/env.ts   (Zod parse → typed env object)
  │
  ├── src/config/gemini.ts    (GoogleGenAI client)
  ├── src/config/redis.ts     (ioredis client → Upstash)
  └── src/config/tavily.ts    (TavilyClient)
```

---

## Error Handling

All route handlers are wrapped with `catchAsync()` — a higher-order function that forwards any thrown error to Express's next error middleware.

```text
Controller (wrapped in catchAsync)
      │
      ▼ (throws AppError or any Error)
errorHandler middleware
      │
      ▼
JSON error response: { success: false, message, error }
```

`AppError` is a custom error class that carries an HTTP status code alongside the message.

---

## Logging

Structured logging is handled by **Pino** via `src/lib/logger.ts`. In development, `pino-pretty` formats output for readability. In production, JSON logs are emitted for ingestion by log aggregators.

---

## Deployment Targets

| Component | Platform |
|-----------|---------|
| Backend | Render (or any Node/Bun-compatible host) |
| Frontend | Vercel (recommended for Next.js) |
| Database | Neon (serverless PostgreSQL) |
| Redis | Upstash (serverless Redis) |
