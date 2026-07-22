<div align="center">

# Xcel

AI-powered automation for **X (Twitter)**.

Generate, schedule, and publish AI-generated tweets from topics that matter to you.

> Built with Bun, Express, Drizzle ORM, BullMQ, PostgreSQL, Gemini AI, Tavily Search, and Buffer API.

</div>

---

## Documentation

| Document | Description |
|----------|-------------|
| [API Reference](docs/API.md) | All REST endpoints — request/response shapes, params, and examples |
| [Architecture](docs/ARCHITECTURE.md) | System design, request lifecycle, worker flows, and layer responsibilities |
| [Database](docs/DATABASE.md) | Schema reference — tables, columns, enums, indexes, and ER diagram |

---

## What is Xcel?

Xcel is an AI-powered automation platform for X (formerly Twitter) that automates the entire content publishing workflow.

Instead of manually writing tweets every day, Xcel continuously searches the web for relevant information, generates context-aware tweets using Gemini AI, schedules them according to your preferred posting times, and publishes them automatically through Buffer.

The goal is simple:

> Stay consistent on X without spending hours creating content.

---

## Project Status

> **Personal Project**

Xcel is currently designed for personal use.

- ✅ Backend automation engine is production-ready.
- 🚧 Frontend dashboard is under active development.
- 🔒 Authentication and OAuth are intentionally not implemented.
- 👤 The current version supports a single-user workflow.

If you want to use Xcel for your own account or extend it into a multi-user SaaS, simply fork the repository and implement your preferred authentication provider.

---

## Features

### Automation

- AI tweet generation
- Automated publishing through Buffer
- Web search powered content discovery
- Topic-based content generation
- Dynamic posting schedules
- Dynamic automation schedules

### Tweet Management

- Draft tweets
- Custom tweets
- Automated tweets
- Scheduled tweets
- Post history
- Failed tweet retry support

### Backend

- Queue-based architecture
- Background workers
- Scheduled jobs
- Typed API
- Request validation
- Centralized error handling

### AI

- Gemini AI for tweet generation
- Tavily Search for real-time web search
- Structured JSON responses
- Prompt-driven generation

---

# System Architecture

```text
                              Xcel

                         ┌──────────────┐
                         │   Frontend   │
                         │   Next.js    │
                         └──────┬───────┘
                                │
                        REST API Requests
                                │
                                ▼
                     ┌─────────────────────┐
                     │  Express + Bun API  │
                     │   /api/v1/*         │
                     └─────────┬───────────┘
                               │
        ┌───────────────┬──────┴───────────────┬──────────────┐
        ▼               ▼                      ▼              ▼
   Controllers      Services              Validators      Middleware
        │               │
        └───────────────┼────────────────────────────────────┐
                        ▼                                    ▼
                 Business Logic                     Queue Scheduler
                        │                                    │
                        ▼                                    ▼
                  Drizzle ORM                         BullMQ Workers
                        │                                    │
                        ▼                                    ▼
                 PostgreSQL DB                  Automation / Posting
                        │                                    │
                        └──────────────┬─────────────────────┘
                                       ▼
                               External Services
                        ┌──────────┬──────────┬──────────┐
                        │ GeminiAI │ Tavily   │ Buffer   │
                        └──────────┴──────────┴──────────┘
                                       │
                                       ▼
                                 X (Twitter)
```

---

# Tweet Automation Flow

```text
User Topics
     │
     ▼
Queries Table
     │
     ▼
Automation Worker
     │
     ▼
Tavily Search
     │
     ▼
Gemini AI
     │
     ▼
Generated Tweet
     │
     ▼
Tweets Table
     │
     ▼
Posting Scheduler
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

# Database Schema

```text
┌────────────────────────────┐
│          queries           │
├────────────────────────────┤
│ id (uuidv7) PK            │
│ query                     │
│ active                    │
│ created_at                │
│ updated_at                │
└──────────────┬─────────────┘
               │
               │ query
               │
               ▼
┌────────────────────────────┐
│          tweets            │
├────────────────────────────┤
│ id (uuidv7) PK            │
│ content                   │
│ hashtags[]                │
│ query                     │
│ type                      │
│ status                    │
│ scheduled_for             │
│ posted_at                 │
│ created_at                │
│ updated_at                │
└────────────────────────────┘


┌────────────────────────────┐
│         settings           │
├────────────────────────────┤
│ id (uuidv7) PK            │
│ automation_enabled        │
│ posting_times (jsonb)     │
│ automation_times (jsonb)  │
│ timezone                  │
│ created_at                │
│ updated_at                │
└────────────────────────────┘
```

---

# Project Structure

```text
Xcel/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── jobs/
│   │   ├── middlewares/
│   │   ├── prompts/
│   │   ├── queues/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   └── workers/
│   │
│   └── drizzle/
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── providers/
│   │   ├── constants/
│   │   ├── lib/
│   │   └── types/
│   │
│   └── public/
│
└── README.md
```

---

# Backend Architecture

```text
Routes
   │
   ▼
Controllers
   │
   ▼
Services
   │
   ├──────────────► Gemini AI
   ├──────────────► Tavily Search
   ├──────────────► Buffer API
   ├──────────────► BullMQ
   │
   ▼
Drizzle ORM
   │
   ▼
PostgreSQL
```

---

# API Routes

## Tweets

| Method   | Endpoint                  | Description                            |
| -------- | ------------------------- | -------------------------------------- |
| `GET`    | `/api/v1/tweets`          | Get all tweets (paginated, filterable) |
| `POST`   | `/api/v1/tweets`          | Create a custom tweet                  |
| `PATCH`  | `/api/v1/tweets/:tweetId` | Update a tweet                         |
| `DELETE` | `/api/v1/tweets/:tweetId` | Delete a tweet                         |
| `POST`   | `/api/v1/tweets/enhance`  | AI-enhance tweet content via Gemini    |

## Queries

| Method   | Endpoint              | Description            |
| -------- | --------------------- | ---------------------- |
| `GET`    | `/api/v1/queries`     | Get all topics         |
| `POST`   | `/api/v1/queries`     | Add a new topic        |
| `PATCH`  | `/api/v1/queries/:id` | Toggle active / update |
| `DELETE` | `/api/v1/queries/:id` | Delete a topic         |

## Dashboard

| Method | Endpoint            | Description     |
| ------ | ------------------- | --------------- |
| `GET`  | `/api/v1/dashboard` | Aggregate stats |

## Settings

| Method  | Endpoint                      | Description          |
| ------- | ----------------------------- | -------------------- |
| `GET`   | `/api/v1/settings`            | Get current settings |
| `PATCH` | `/api/v1/settings/:settingId` | Update settings      |

## Automation

| Method | Endpoint                 | Description                          |
| ------ | ------------------------ | ------------------------------------ |
| `POST` | `/api/v1/automation/run` | Manually trigger an automation cycle |

---

# Tech Stack

## Frontend

| Technology      | Version | Purpose                 |
| --------------- | ------- | ----------------------- |
| Next.js         | 16.2.10 | React Framework         |
| React           | 19.2.4  | UI Library              |
| TypeScript      | ^5      | Type Safety             |
| Tailwind CSS    | ^4      | Styling                 |
| shadcn/ui       | 4.13.0  | UI Components           |
| TanStack Query  | 5.101.2 | Server State Management |
| Axios           | 1.18.1  | API Client              |
| React Hook Form | 7.81.0  | Forms                   |
| Zod             | 4.4.3   | Validation              |
| Sonner          | 2.0.7   | Toast Notifications     |
| Lucide React    | 1.24.0  | Icons                   |

---

## Backend

| Technology  | Version    | Purpose               |
| ----------- | ---------- | --------------------- |
| Bun         | Latest     | JavaScript Runtime    |
| Express     | 5.2.1      | REST API              |
| TypeScript  | ^5         | Type Safety           |
| Drizzle ORM | 1.0.0-rc.4 | ORM                   |
| Drizzle Kit | 1.0.0-rc.4 | Migrations            |
| PostgreSQL  | Latest     | Database              |
| BullMQ      | 5.80.0     | Background Jobs       |
| ioredis     | 5.10.1     | Redis Client          |
| Pino        | 10.3.1     | Logging               |
| Zod         | 4.4.3      | Request Validation    |
| Dotenv      | 17.4.2     | Environment Variables |

---

## AI & External APIs

| Service           | Purpose              |
| ----------------- | -------------------- |
| Gemini API        | AI Tweet Generation  |
| Tavily Search API | Real-time Web Search |
| Buffer API        | Tweet Publishing     |
| Neon PostgreSQL   | Cloud Database       |
| Upstash Redis     | Queue Storage        |
| Render            | Deployment           |

---

# Development Phases

## ✅ Phase 1 — Backend Foundation _(Completed)_

- Express + Bun backend
- Drizzle ORM setup
- PostgreSQL integration
- Redis connection
- Logging
- Error handling
- Validation
- Environment configuration

---

## ✅ Phase 2 — AI Automation Engine _(Completed)_

- Gemini AI integration
- Tavily Search integration
- AI tweet generation
- Prompt engineering
- Structured JSON responses
- Topic-based automation

---

## ✅ Phase 3 — Scheduling System _(Completed)_

- BullMQ queues
- Automation worker
- Posting worker
- Dynamic posting schedules
- Dynamic automation schedules
- Retry support

---

## ✅ Phase 4 — Tweet Management _(Completed)_

- Create custom tweets
- Draft tweets
- Scheduled tweets
- Pending queue
- Failed tweets
- Dashboard APIs

---

## 🚧 Phase 5 — Frontend Dashboard _(In Progress)_

- Dashboard UI
- Tweet management
- Query management
- Settings page
- Analytics cards
- Responsive layout

---

## 📋 Phase 6 — Future Plans

- User Authentication
- OAuth
- Multi-user support
- Thread generation
- AI tweet enhancement
- Tweet analytics
- Multiple X accounts
- LinkedIn automation
- Instagram automation
- YouTube Shorts automation
- Email notifications
- Webhooks
- Docker support
- CI/CD pipeline

---

# Current Progress

| Module                 | Status         |
| ---------------------- | -------------- |
| Backend                | ✅ Complete    |
| REST API               | ✅ Complete    |
| AI Integration         | ✅ Complete    |
| Automation Engine      | ✅ Complete    |
| Queue Workers          | ✅ Complete    |
| Scheduler              | ✅ Complete    |
| Database               | ✅ Complete    |
| Frontend               | 🚧 In Progress |
| Authentication         | ⏳ Planned     |
| OAuth                  | ⏳ Planned     |
| Analytics              | ⏳ Planned     |
| Multi Platform Support | ⏳ Planned     |

# Running Locally

### Clone the repository

```bash
git clone https://github.com/Anos714/Xcel.git

cd Xcel
```

---

### Backend

```bash
cd backend

bun install

cp .env.example .env

bun run db:generate
bun run db:migrate

bun run dev
```

---

### Frontend

```bash
cd frontend

bun install

bun run dev
```

The frontend will be available at:

```
http://localhost:3000
```

The backend will be available at:

```
http://localhost:8080
```

---

# Environment Variables

## Backend

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

## Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

# Contributing

Contributions are welcome.

If you'd like to improve Xcel, you can:

- Build the frontend
- Add authentication
- Add OAuth
- Improve AI prompts
- Support additional social media platforms
- Improve scheduling
- Optimize worker performance
- Report bugs
- Submit feature requests

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/amazing-feature
```

3. Commit your changes

```bash
git commit -m "feat: add amazing feature"
```

4. Push the branch

```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request

---

# Acknowledgements

Xcel is built using several amazing open-source projects.

- Bun
- Next.js
- Express
- Drizzle ORM
- BullMQ
- PostgreSQL
- Redis
- Gemini AI
- Tavily Search
- Buffer API

Huge thanks to the maintainers and contributors of these projects.

---

# License

MIT License

Feel free to fork, modify, and build upon this project.
