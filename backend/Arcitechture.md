# AI Twitter Automation SaaS - Architecture

## Tech Stack

### Backend

- Bun
- Express.js
- PostgreSQL (Neon)
- Drizzle ORM
- Redis (Upstash)
- BullMQ
- Tavily API (Web Search)
- Gemini 3.5 Flash (Tweet Generation & Enhancement)
- Buffer API (Publishing Tweets)

### Frontend

- Next.js
- Tailwind CSS
- React Query
- Shadcn UI

---

# High Level Architecture

```
                           +----------------------+
                           |      Next.js App     |
                           +----------+-----------+
                                      |
                                  REST API
                                      |
                                      ▼
                        +---------------------------+
                        |     Express (Bun) API     |
                        +---------------------------+
                        | Routes                    |
                        | Controllers               |
                        | Services                  |
                        +-------------+-------------+
                                      |
        -------------------------------------------------------------
        |              |               |               |             |
        ▼              ▼               ▼               ▼             ▼
 PostgreSQL         BullMQ         Tavily API     Gemini API    Buffer API
 (Drizzle)      Redis (Upstash)    Web Search      AI Model     Tweet Posting
```

---

# Project Structure

```
twitter-automation/

src/

├── config/
│   ├── env.ts
│   ├── drizzle.ts
│   ├── redis.ts
│   ├── bullmq.ts
│   ├── tavily.ts
│   ├── gemini.ts
│   └── buffer.ts
│
├── routes/
│   ├── automation.routes.ts
│   ├── tweet.routes.ts
│   ├── schedule.routes.ts
│   └── auth.routes.ts
│
├── controllers/
│   ├── automation.controller.ts
│   ├── tweet.controller.ts
│   ├── schedule.controller.ts
│   └── auth.controller.ts
│
├── services/
│   ├── automation.service.ts
│   ├── tavily.service.ts
│   ├── gemini.service.ts
│   ├── tweet.service.ts
│   ├── buffer.service.ts
│   ├── schedule.service.ts
│   └── aiEnhance.service.ts
│
├── queues/
│   ├── dailyGenerator.queue.ts
│   ├── tweetPosting.queue.ts
│   └── queueNames.ts
│
├── workers/
│   ├── dailyGenerator.worker.ts
│   └── tweetPosting.worker.ts
│
├── jobs/
│   ├── dailyGenerator.job.ts
│   └── tweetPosting.job.ts
│
├── db/
│   ├── schema/
│   │   ├── tweets.ts
│   │   ├── queries.ts
│   │   ├── schedules.ts
│   │   └── users.ts
│   │
│   └── migrations/
│
├── middleware/
│
├── validators/
│
├── prompts/
│   ├── generateTweet.prompt.ts
│   └── enhanceTweet.prompt.ts
│
├── utils/
│
├── types/
│
├── app.ts
└── index.ts
```

---

# Folder Responsibilities

## config/

Stores configuration for external services.

```
Database

Redis

BullMQ

Gemini

Tavily

Buffer
```

---

## routes/

Defines all API endpoints.

```
POST /tweet/custom

POST /tweet/enhance

POST /tweet/post

POST /automation/run

GET /tweet/history
```

---

## controllers/

Responsible only for

- Request validation
- Calling services
- Returning response

No business logic.

---

## services/

Contains all business logic.

Responsible for

- Database queries
- Calling Gemini
- Calling Tavily
- Calling Buffer
- Tweet scheduling
- AI enhancement

---

## queues/

Contains BullMQ queue instances.

Example

```
dailyGeneratorQueue

tweetPostingQueue
```

---

## workers/

Consumes BullMQ jobs.

```
Daily Generator Worker

Tweet Posting Worker
```

---

## jobs/

Registers repeatable jobs.

```
Generate Tweets Daily

Post Tweets at Fixed Time
```

---

## prompts/

Stores Gemini prompts.

```
Generate Tweet Prompt

Enhance Tweet Prompt
```

---

## db/schema/

Contains Drizzle schemas.

```
tweets

queries

users

schedules
```

---

# Database Design

## users

```
id

name

email

bufferAccessToken

createdAt
```

---

## queries

Stores topics for automation.

```
id

query

active

createdAt
```

Example

```
Artificial Intelligence

React

Next.js

OpenAI

JavaScript

Programming
```

---

## tweets

```
id

content

sourceLinks

status

isCustom

generatedAt

scheduledFor

postedAt

createdAt
```

Status

```
pending

posted

failed
```

---

## schedules

```
id

time

active
```

Example

```
10:00

14:00

18:00

22:00
```

---

# Services

---

## automationService

Responsibilities

```
Pick random queries

Search Tavily

Merge results

Generate tweet

Save tweet in database
```

---

## tavilyService

Responsibilities

```
Search internet

Return structured search results
```

---

## geminiService

Responsibilities

```
Generate Tweet

Enhance Tweet
```

---

## tweetService

Responsibilities

```
Create custom tweet

Get pending tweet

Save generated tweet

Update status

Tweet history
```

---

## bufferService

Responsibilities

```
Publish Tweet

Handle API errors
```

---

## scheduleService

Responsibilities

```
Register BullMQ jobs

Manage repeatable jobs
```

---

# Controllers

---

## automationController

```
generateDailyTweets()
```

Calls

```
automationService
```

---

## tweetController

```
createCustomTweet()

enhanceTweet()

postCustomTweet()

getHistory()
```

---

## scheduleController

```
startScheduler()

pauseScheduler()

resumeScheduler()
```

---

# Routes

## Automation

```
POST /automation/run
```

Manual testing only.

---

## Tweet

```
POST /tweet/custom

POST /tweet/enhance

POST /tweet/post

GET /tweet/history
```

---

## Scheduler

```
POST /scheduler/start

POST /scheduler/pause

POST /scheduler/resume
```

---

# BullMQ Jobs

## Job 1

### Daily Generator

Runs every day

```
12:05 AM
```

Flow

```
Generate four tweets

Store them as pending
```

---

## Job 2

### Morning Posting

Runs

```
10:00 AM
```

Flow

```
Get oldest pending tweet

Send to Buffer

Update status
```

---

## Job 3

Runs

```
2:00 PM
```

Same flow.

---

## Job 4

Runs

```
6:00 PM
```

Same flow.

---

## Job 5

Runs

```
10:00 PM
```

Same flow.

---

# Complete Automation Flow

```
12:05 AM

BullMQ Daily Generator

        │
        ▼

Repeat 4 Times

        │
        ▼

Pick 3 Random Queries

        │
        ▼

Tavily Search

Query 1

Query 2

Query 3

        │
        ▼

Merge Search Results

        │
        ▼

Gemini Prompt

        │
        ▼

Generate Tweet

        │
        ▼

Save Tweet

status = pending

        │
        ▼

Repeat Until

4 Tweets Generated
```

---

# Posting Flow

```
10AM

BullMQ Job

        │
        ▼

Fetch Oldest Pending Tweet

        │
        ▼

Buffer API

        │
        ▼

Twitter

        │
        ▼

Success ?

     │

 ┌───┴─────┐
 │         │
Yes        No
 │         │
 ▼         ▼

Update     failed

status     retry

postedAt
```

Same flow runs at

- 2 PM
- 6 PM
- 10 PM

---

# Custom Tweet Flow

```
User

      │

      ▼

Frontend

      │

      ▼

POST /tweet/custom

      │

      ▼

Store Draft

      │

(Optional)

      ▼

AI Enhance

      │

      ▼

Gemini

      │

      ▼

Improved Tweet

      │

      ▼

POST /tweet/post

      │

      ▼

Buffer

      │

      ▼

Twitter
```

---

# AI Enhance Flow

```
User writes tweet

      │

      ▼

Click AI Enhance

      │

      ▼

Gemini

      │

      ▼

Enhanced Tweet

      │

      ▼

Return to Frontend
```

---

# Overall Application Flow

```
                            USER
                              │
                ┌─────────────┴─────────────┐
                │                           │
                │                           │
      Daily Automation              Custom Tweet
                │                           │
                ▼                           ▼
         BullMQ Generator          User Writes Tweet
                │                           │
                ▼                           ▼
      Pick 3 Random Queries        AI Enhance (Optional)
                │                           │
                ▼                           ▼
          Tavily Search              Final Tweet Ready
                │                           │
                ▼                           ▼
         Merge Search Results        Buffer API
                │                           │
                ▼                           ▼
       Gemini Generates Tweet      Twitter Published
                │
                ▼
       Save as Pending Tweet
                │
                ▼
──────────────────────────────────────────────────────────

10:00 AM → Publish Pending Tweet

2:00 PM → Publish Pending Tweet

6:00 PM → Publish Pending Tweet

10:00 PM → Publish Pending Tweet

──────────────────────────────────────────────────────────
                │
                ▼
            Buffer API
                │
                ▼
             Twitter
                │
                ▼
      Update Status = Posted
```

---

# Request Lifecycle

```
Client

↓

Route

↓

Controller

↓

Service

↓

Database / External APIs

↓

Controller

↓

JSON Response
```

---

# External Integrations

| Service           | Purpose                                 |
| ----------------- | --------------------------------------- |
| PostgreSQL (Neon) | Store users, tweets, schedules, queries |
| Drizzle ORM       | Database ORM                            |
| Redis (Upstash)   | BullMQ backend                          |
| BullMQ            | Scheduling & background jobs            |
| Tavily            | Search latest web content               |
| Gemini 3.5 Flash  | Generate & enhance tweets               |
| Buffer            | Publish tweets to Twitter/X             |

---

# Future Improvements

- Multi-user support
- Multiple social platforms (LinkedIn, Threads, Bluesky)
- Analytics dashboard
- Tweet approval workflow
- Draft management
- Retry queue for failed posts
- AI-generated hashtags
- AI-generated images
- Rate limiting
- Notifications
- Admin dashboard
- Webhooks
- Team workspaces
- Content calendar
