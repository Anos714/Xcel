# Frontend Roadmap (Next.js + TypeScript)

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Axios
- React Hook Form
- Zod
- Sonner
- Lucide React

## Git Branch Strategy

Branch Purpose

---
```
main Stable releases
develop Integration branch
feat/project-setup Providers, config, layout
feat/dashboard Dashboard page
feat/tweets Tweet management
feat/queries Query management
feat/settings Settings page
feat/automation Automation page
feat/ui-polish Skeletons, dialogs, toasts
docs/readme Documentation
```

## Milestones

### Phase 1 -- Foundation

- Configure App Router
- Configure Tailwind
- Configure shadcn/ui
- Configure Axios instance
- Configure TanStack Query provider
- Environment variables
- Folder structure

### Phase 2 -- Layout

- Root layout
- Sidebar
- Navbar
- Responsive navigation
- Protected layout

### Phase 3 -- API Layer

Create: - services/dashboard.ts - services/tweets.ts -
services/queries.ts - services/settings.ts - services/automation.ts

### Phase 4 -- React Query Hooks

Create hooks for: - Dashboard - Tweets - Queries - Settings - Automation

### Phase 5 -- Dashboard

- Stat cards
- Recent tweets
- Upcoming tweets
- Loading skeletons
- Error state

### Phase 6 -- Tweets

- Table
- Search
- Create
- Edit
- Delete
- AI Enhance
- Post Now
- Schedule

### Phase 7 -- Queries

- CRUD
- Active toggle

### Phase 8 -- Settings

- Automation toggle
- Posting times
- Timezone

### Phase 9 -- Automation

- Manual generation
- Status

### Phase 10 -- Polish

- Toasts
- Empty states
- Confirm dialogs
- Responsive testing

## Suggested Commit Flow

1.  chore: initialize frontend architecture
2.  feat: add application layout
3.  feat: configure axios and react-query
4.  feat: build dashboard
5.  feat: implement tweet management
6.  feat: implement query management
7.  feat: implement settings page
8.  feat: implement automation page
9.  refactor: improve component structure
10. docs: update README

## Immediate Next Tasks

1.  Configure QueryProvider.
2.  Configure Axios instance.
3.  Create global providers in app/layout.tsx.
4.  Build Sidebar + Navbar.
5.  Create empty routes:
    - /dashboard
    - /tweets
    - /queries
    - /settings
    - /automation
6.  Connect dashboard API first.

