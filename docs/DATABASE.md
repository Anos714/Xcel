<div align="center">

# Xcel — Database Reference

PostgreSQL schema documentation for the Xcel backend.

> ORM: Drizzle ORM &nbsp;|&nbsp; Database: Neon (serverless PostgreSQL)

</div>

---

## Overview

Xcel uses three tables to manage its full automation and content lifecycle:

| Table | Purpose |
|-------|---------|
| `queries` | Automation topics — what the AI searches for |
| `tweets` | All tweets: AI-generated, custom drafts, and scheduled |
| `settings` | Global automation configuration (a single-row table) |

All primary keys use **UUIDv7** — time-ordered UUIDs that are both unique and sortable by creation time without an extra `ORDER BY created_at`.

---

## Enums

```sql
CREATE TYPE tweet_type   AS ENUM ('automation', 'custom');
CREATE TYPE tweet_status AS ENUM ('draft', 'pending', 'posted', 'failed');
```

| Enum | Values | Description |
|------|--------|-------------|
| `tweet_type` | `automation`, `custom` | How the tweet was created |
| `tweet_status` | `draft`, `pending`, `posted`, `failed` | Lifecycle state of a tweet |

---

## Tables

### `queries`

Stores the topics used to drive automated tweet generation.
Active topics are picked by the automation worker when it runs.

```sql
CREATE TABLE queries (
  id          UUID        PRIMARY KEY DEFAULT uuidv7(),
  query       TEXT        NOT NULL,
  active      BOOLEAN     NOT NULL DEFAULT true,
  created_at  TIMESTAMP   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX queries_query_unique ON queries (query);
```

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `uuid` | No | `uuidv7()` | Primary key |
| `query` | `text` | No | — | Topic text (unique) |
| `active` | `boolean` | No | `true` | Whether this topic is used in automation |
| `created_at` | `timestamp` | No | `NOW()` | Record creation time |
| `updated_at` | `timestamp` | No | `NOW()` | Auto-updated on every change |

**Indexes**
- `queries_query_unique` — unique index on `query` to prevent duplicate topics

**Example rows**

| id | query | active |
|----|-------|--------|
| `0193…` | `Artificial Intelligence` | `true` |
| `0193…` | `React` | `false` |
| `0193…` | `Next.js` | `true` |

---

### `tweets`

Stores every tweet managed by Xcel — whether AI-generated, custom drafts, or scheduled posts. The automation worker inserts rows here; the posting worker reads and updates them.

```sql
CREATE TABLE tweets (
  id            UUID              PRIMARY KEY DEFAULT uuidv7(),
  content       TEXT              NOT NULL,
  hashtags      TEXT[],
  query         VARCHAR(255),
  type          tweet_type        NOT NULL,
  status        tweet_status      NOT NULL DEFAULT 'pending',
  scheduled_for TIMESTAMP,
  posted_at     TIMESTAMP,
  created_at    TIMESTAMP         NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP         NOT NULL DEFAULT NOW()
);

CREATE INDEX tweets_status_idx   ON tweets (status);
CREATE INDEX tweets_schedule_idx ON tweets (scheduled_for);
```

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `uuid` | No | `uuidv7()` | Primary key |
| `content` | `text` | No | — | Tweet body text |
| `hashtags` | `text[]` | Yes | — | Array of hashtags (without `#`) |
| `query` | `varchar(255)` | Yes | — | Topic that triggered this tweet (automation only) |
| `type` | `tweet_type` | No | — | `automation` or `custom` |
| `status` | `tweet_status` | No | `pending` | Current lifecycle state |
| `scheduled_for` | `timestamp` | Yes | — | When to post (if scheduled) |
| `posted_at` | `timestamp` | Yes | — | When actually posted via Buffer |
| `created_at` | `timestamp` | No | `NOW()` | Record creation time |
| `updated_at` | `timestamp` | No | `NOW()` | Auto-updated on every change |

**Indexes**
- `tweets_status_idx` — for fast filtering by status (`pending`, `posted`, etc.)
- `tweets_schedule_idx` — for fast ordering/filtering by `scheduled_for`

**Tweet Status Lifecycle**

```text
           Create custom tweet
                  │
                  ▼
              [ draft ]
                  │
          User confirms / schedules
                  │
                  ▼
             [ pending ]  ◄──── AI-generated tweets start here
                  │
         Posting worker picks up
                  │
          ┌───────┴───────┐
          ▼               ▼
       [ posted ]      [ failed ]
                           │
                      BullMQ retry
                           │
                        [ pending ]
```

**Tweet Type Comparison**

| Field | `automation` | `custom` |
|-------|-------------|---------|
| `query` | Set to source topic | `null` |
| `type` | `automation` | `custom` |
| Initial `status` | `pending` | `draft` or `pending` |
| Created by | Automation worker | User via API |

---

### `settings`

A single-row configuration table. Controls whether automation is active, when tweets are posted, and when the automation worker runs.

```sql
CREATE TABLE settings (
  id                  UUID      PRIMARY KEY DEFAULT uuidv7(),
  automation_enabled  BOOLEAN   NOT NULL DEFAULT true,
  posting_times       JSONB     NOT NULL DEFAULT '["10:00","14:00","18:00","22:00"]',
  automation_times    JSONB     NOT NULL DEFAULT '["00:00","01:00","02:00"]',
  timezone            TEXT      NOT NULL DEFAULT 'Asia/Kolkata',
  created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMP NOT NULL DEFAULT NOW()
);
```

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | `uuid` | No | `uuidv7()` | Primary key |
| `automation_enabled` | `boolean` | No | `true` | Global on/off switch for automation |
| `posting_times` | `jsonb` (`string[]`) | No | `["10:00","14:00","18:00","22:00"]` | Times (24h) when posting worker runs |
| `automation_times` | `jsonb` (`string[]`) | No | `["00:00","01:00","02:00"]` | Times (24h) when generation worker runs |
| `timezone` | `text` | No | `"Asia/Kolkata"` | IANA timezone string |
| `created_at` | `timestamp` | No | `NOW()` | Record creation time |
| `updated_at` | `timestamp` | No | `NOW()` | Auto-updated on every change |

> **Note:** This table holds a single row. The row is seeded on first run and updated in-place via `PATCH /api/v1/settings/:settingId`.

---

## Entity Relationship Diagram

```text
┌────────────────────────────┐          ┌────────────────────────────┐
│          queries           │          │          tweets            │
├────────────────────────────┤          ├────────────────────────────┤
│ id (uuidv7)   PK          │          │ id (uuidv7)   PK          │
│ query         UNIQUE       │──────────│ query         VARCHAR(255) │
│ active        BOOLEAN      │  topic   │ content       TEXT         │
│ created_at                 │  name    │ hashtags      TEXT[]       │
│ updated_at                 │          │ type          ENUM         │
└────────────────────────────┘          │ status        ENUM         │
                                        │ scheduled_for TIMESTAMP    │
┌────────────────────────────┐          │ posted_at     TIMESTAMP    │
│         settings           │          │ created_at                 │
├────────────────────────────┤          │ updated_at                 │
│ id (uuidv7)   PK          │          └────────────────────────────┘
│ automation_enabled BOOLEAN │
│ posting_times   JSONB      │
│ automation_times JSONB     │
│ timezone        TEXT       │
│ created_at                 │
│ updated_at                 │
└────────────────────────────┘
```

> `queries.query` and `tweets.query` are linked by value (the topic text), not a foreign key, since automation tweets store a snapshot of the topic name at generation time.

---

## Migrations

Migrations are managed by **Drizzle Kit** and live in `backend/drizzle/`.

```bash
# Generate a new migration from schema changes
bun run db:generate

# Apply pending migrations
bun run db:migrate

# Open Drizzle Studio (visual DB browser)
bun run db:studio
```

Migration files are numbered and timestamped:

```text
drizzle/
├── 20260709150038_kind_shiver_man/
│   ├── migration.sql
│   └── snapshot.json
├── 20260709155850_absent_black_cat/
│   ├── migration.sql
│   └── snapshot.json
└── ...
```

---

## Connection

The backend connects to Neon PostgreSQL via the `@neondatabase/serverless` driver, configured through Drizzle ORM.

```ts
// src/db/index.ts
import { drizzle } from 'drizzle-orm/neon-serverless';

export const db = drizzle(process.env.DATABASE_URL);
```

Set `DATABASE_URL` in your `.env` file:

```env
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require&channel_binding=require
```
