<div align="center">

# Xcel — Frontend

Dashboard interface for managing AI-powered tweet automation.

> Built with Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui, and TanStack Query.

</div>

---

## Overview

The Xcel frontend is a Next.js dashboard that gives you full visibility and control over your automated X (Twitter) presence. From viewing tweet history to managing topics, tweaking posting schedules, and AI-enhancing drafts — everything is accessible from one clean interface.

> **Status:** 🚧 Under active development.

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.2.10 | React Framework (App Router) |
| React | 19.2.4 | UI Library |
| TypeScript | ^5 | Type Safety |
| Tailwind CSS | ^4 | Styling |
| shadcn/ui | ^4.13.0 | UI Component Library |
| TanStack Query | ^5.101.2 | Server State Management |
| Axios | ^1.18.1 | API Client |
| React Hook Form | ^7.81.0 | Form Management |
| Zod | ^4.4.3 | Schema Validation |
| Sonner | ^2.0.7 | Toast Notifications |
| Lucide React | ^1.24.0 | Icons |
| date-fns | ^4.4.0 | Date Formatting |

---

## Project Structure

```text
frontend/
│
├── src/
│   ├── app/
│   │   ├── (dashboard)/          # Protected dashboard layout group
│   │   │   ├── layout.tsx        # Sidebar + Navbar shell
│   │   │   ├── dashboard/        # Overview stats & recent tweets
│   │   │   ├── tweets/           # Tweet management
│   │   │   ├── queries/          # Topic management
│   │   │   ├── settings/         # Automation & posting settings
│   │   │   └── automation/       # Manual automation trigger
│   │   │
│   │   ├── layout.tsx            # Root layout (providers, fonts)
│   │   ├── page.tsx              # Landing / redirect
│   │   └── globals.css           # Global styles & CSS variables
│   │
│   ├── api/
│   │   ├── dashboard.ts          # Dashboard API calls
│   │   └── tweets/               # Tweet API calls
│   │
│   ├── components/
│   │   ├── ui/                   # shadcn/ui primitives
│   │   ├── layout/               # Sidebar, Navbar, Logo
│   │   ├── dashboard/            # StatsGrid, RecentTweets, UpcomingTweets
│   │   └── tweets/               # TweetTable, TweetForm, DeleteDialog
│   │
│   ├── hooks/
│   │   ├── useDashboard.ts
│   │   ├── useTweets.ts
│   │   ├── useCreateTweet.ts
│   │   ├── useUpdateTweet.ts
│   │   ├── useDeleteTweet.ts
│   │   └── useEnhanceTweet.ts
│   │
│   ├── providers/
│   │   └── QueryProvider.tsx     # TanStack Query client provider
│   │
│   ├── lib/
│   │   ├── axios.ts              # Configured Axios instance
│   │   └── utils.ts              # Utility helpers (cn, etc.)
│   │
│   ├── constants/
│   │   ├── navigation.ts         # Sidebar nav items
│   │   └── pageTitles.ts
│   │
│   └── types/
│       ├── tweets.ts
│       └── dashboard.ts
│
└── public/                       # Static assets
```

---

## Pages

| Route | Description |
|-------|-------------|
| `/dashboard` | Overview: stat cards, recent & upcoming tweets |
| `/tweets` | Full tweet management: create, edit, delete, AI-enhance |
| `/queries` | Manage automation topics (add, toggle active, delete) |
| `/settings` | Configure automation toggle, posting times, timezone |
| `/automation` | Manually trigger an automation cycle |

---

## Data Flow

```text
Page Component
      │
      ▼
TanStack Query Hook  (useTweets, useDashboard, …)
      │
      ▼
API Layer            (axios instance → backend REST API)
      │
      ▼
Xcel Backend         (http://localhost:8080)
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your value.

```env
# The URL of the running Xcel backend
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed
- Xcel backend running (see `/backend/README.md`)

### Setup

```bash
# From the project root
cd frontend

# Install dependencies
bun install

# Configure environment
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL to your backend URL

# Start the development server
bun run dev
```

The dashboard will be available at:

```
http://localhost:3000
```

### Other Scripts

```bash
# Build for production
bun run build

# Start production server
bun run start

# Run linter
bun run lint
```

---

## Development Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 — Foundation | App Router, Tailwind, shadcn/ui, Axios, TanStack Query | ✅ Done |
| 2 — Layout | Sidebar, Navbar, responsive navigation | ✅ Done |
| 3 — API Layer | API functions per feature | ✅ Done |
| 4 — React Query Hooks | Hooks for all features | ✅ Done |
| 5 — Dashboard | Stat cards, recent/upcoming tweets, skeletons | 🚧 In Progress |
| 6 — Tweets | Table, create, edit, delete, AI enhance, schedule | 🚧 In Progress |
| 7 — Queries | CRUD, active toggle | ⏳ Planned |
| 8 — Settings | Automation toggle, posting times, timezone | ⏳ Planned |
| 9 — Automation | Manual trigger, status display | ⏳ Planned |
| 10 — Polish | Toasts, empty states, confirm dialogs, responsive | ⏳ Planned |

---

## License

MIT License — feel free to fork and build upon this project.
