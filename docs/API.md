<div align="center">

# Xcel API Reference

REST API documentation for the Xcel backend.

> Base URL: `http://localhost:8080`

</div>

---

## Response Format

All endpoints return a consistent JSON envelope.

**Success**
```json
{
  "success": true,
  "message": "Human-readable description",
  "data": { }
}
```

**Error**
```json
{
  "success": false,
  "message": "Human-readable description",
  "error": "Validation details or error message"
}
```

---

## Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/tweets` | List tweets (paginated, filterable) |
| `POST` | `/api/v1/tweets` | Create a custom tweet |
| `PATCH` | `/api/v1/tweets/:tweetId` | Update a tweet |
| `DELETE` | `/api/v1/tweets/:tweetId` | Delete a tweet |
| `POST` | `/api/v1/tweets/enhance` | AI-enhance tweet content |
| `GET` | `/api/v1/queries` | List all automation topics |
| `POST` | `/api/v1/queries` | Add a new topic |
| `PATCH` | `/api/v1/queries/:id` | Toggle active status of a topic |
| `DELETE` | `/api/v1/queries/:id` | Delete a topic |
| `GET` | `/api/v1/dashboard` | Aggregate dashboard stats |
| `GET` | `/api/v1/settings` | Get current settings |
| `PATCH` | `/api/v1/settings/:settingId` | Update settings |
| `POST` | `/api/v1/automation/run` | Manually trigger an automation cycle |

---

## Tweets

### `GET /api/v1/tweets`

Fetch a paginated, optionally filtered list of tweets.

**Query Parameters**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | `number` | No | `1` | Page number (min: 1) |
| `limit` | `number` | No | `10` | Results per page (min: 1, max: 100) |
| `status` | `string` | No | — | Filter by status: `draft` \| `pending` \| `posted` \| `failed` |
| `type` | `string` | No | — | Filter by type: `automation` \| `custom` |

**Example Request**
```
GET /api/v1/tweets?page=1&limit=10&status=pending&type=automation
```

**Example Response** `200 OK`
```json
{
  "success": true,
  "message": "Tweets fetched successfully",
  "data": [
    {
      "id": "01930000-0000-7000-0000-000000000001",
      "content": "AI is transforming how developers write code...",
      "hashtags": ["AI", "Dev"],
      "query": "Artificial Intelligence",
      "type": "automation",
      "status": "pending",
      "scheduledFor": "2026-07-23T10:00:00.000Z",
      "postedAt": null,
      "createdAt": "2026-07-22T00:05:00.000Z",
      "updatedAt": "2026-07-22T00:05:00.000Z"
    }
  ]
}
```

---

### `POST /api/v1/tweets`

Create a new custom tweet (draft, immediate post, or scheduled).

**Request Body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `content` | `string` | **Yes** | Tweet text (max 280 chars, or 250 if hashtags are included) |
| `postType` | `"now" \| "scheduled"` | **Yes** | Post immediately or schedule for later |
| `hashtags` | `string[]` | No | Hashtags without the `#` prefix |
| `scheduledFor` | `ISO 8601 date string` | Conditional | Required when `postType` is `"scheduled"`. Must be a future date |

**Validation Rules**
- `postType: "scheduled"` → `scheduledFor` is required and must be in the future
- `postType: "now"` → `scheduledFor` must **not** be provided
- If hashtags are included, combined tweet length must be ≤ 250 characters
- Without hashtags, content must be ≤ 280 characters

**Example Request — Scheduled**
```json
{
  "content": "TypeScript 5 brings major improvements to type inference.",
  "postType": "scheduled",
  "hashtags": ["TypeScript", "Dev"],
  "scheduledFor": "2026-07-23T14:00:00.000Z"
}
```

**Example Request — Immediate**
```json
{
  "content": "Just discovered a great trick for React performance!",
  "postType": "now"
}
```

**Example Response** `200 OK`
```json
{
  "success": true,
  "message": "Tweet created successfully",
  "data": {
    "id": "01930000-0000-7000-0000-000000000002",
    "content": "TypeScript 5 brings major improvements to type inference.",
    "hashtags": ["TypeScript", "Dev"],
    "type": "custom",
    "status": "pending",
    "scheduledFor": "2026-07-23T14:00:00.000Z",
    "createdAt": "2026-07-22T15:00:00.000Z",
    "updatedAt": "2026-07-22T15:00:00.000Z"
  }
}
```

---

### `PATCH /api/v1/tweets/:tweetId`

Update an existing tweet's content, hashtags, or scheduled time.

**URL Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `tweetId` | `uuidv7` | ID of the tweet to update |

**Request Body** (at least one field required)

| Field | Type | Description |
|-------|------|-------------|
| `content` | `string` | New tweet text (min: 1, max: 250 chars) |
| `hashtags` | `string[] \| null` | New hashtags array, or `null` to clear |
| `scheduledFor` | `ISO 8601 date \| null` | New scheduled time, or `null` to clear |

**Example Request**
```json
{
  "content": "Updated: TypeScript 5 brings major improvements!",
  "scheduledFor": "2026-07-24T10:00:00.000Z"
}
```

**Example Response** `200 OK`
```json
{
  "success": true,
  "message": "Tweet updated successfully",
  "data": {
    "id": "01930000-0000-7000-0000-000000000002",
    "content": "Updated: TypeScript 5 brings major improvements!",
    "scheduledFor": "2026-07-24T10:00:00.000Z",
    "updatedAt": "2026-07-22T16:00:00.000Z"
  }
}
```

---

### `DELETE /api/v1/tweets/:tweetId`

Delete a tweet by ID.

**URL Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `tweetId` | `uuidv7` | ID of the tweet to delete |

**Example Response** `200 OK`
```json
{
  "success": true,
  "message": "Tweet deleted successfully",
  "data": {
    "id": "01930000-0000-7000-0000-000000000002"
  }
}
```

---

### `POST /api/v1/tweets/enhance`

Send tweet content to Gemini AI for enhancement.

**Request Body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `content` | `string` | **Yes** | Original tweet text (max 250 chars) |

**Example Request**
```json
{
  "content": "react is good for building UIs"
}
```

**Example Response** `200 OK`
```json
{
  "success": true,
  "message": "Query enhanced successfully",
  "data": {
    "content": "React's component model makes building complex UIs surprisingly elegant — compose small, focused pieces into something powerful. 🚀 #React #Frontend"
  }
}
```

---

## Queries (Automation Topics)

### `GET /api/v1/queries`

Fetch all automation topics.

**Example Response** `200 OK`
```json
{
  "success": true,
  "message": "Queries fetched successfully",
  "data": [
    {
      "id": "01930000-0000-7000-0000-000000000010",
      "query": "Artificial Intelligence",
      "active": true,
      "createdAt": "2026-07-10T12:00:00.000Z",
      "updatedAt": "2026-07-10T12:00:00.000Z"
    },
    {
      "id": "01930000-0000-7000-0000-000000000011",
      "query": "React",
      "active": false,
      "createdAt": "2026-07-10T12:00:00.000Z",
      "updatedAt": "2026-07-15T09:00:00.000Z"
    }
  ]
}
```

---

### `POST /api/v1/queries`

Add a new automation topic. Topics must be unique.

**Request Body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `query` | `string` | **Yes** | The topic text (e.g. `"Next.js"`) |

**Example Request**
```json
{
  "query": "Next.js"
}
```

**Example Response** `201 Created`
```json
{
  "success": true,
  "message": "Query created successfully",
  "data": {
    "id": "01930000-0000-7000-0000-000000000012",
    "query": "Next.js",
    "active": true,
    "createdAt": "2026-07-22T15:00:00.000Z",
    "updatedAt": "2026-07-22T15:00:00.000Z"
  }
}
```

---

### `PATCH /api/v1/queries/:id`

Toggle a topic's active status.

**URL Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `uuidv7` | ID of the query to update |

**Request Body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `active` | `boolean` | **Yes** | `true` to enable, `false` to disable |

**Example Request**
```json
{
  "active": false
}
```

**Example Response** `200 OK`
```json
{
  "success": true,
  "message": "Query updated successfully",
  "data": {
    "id": "01930000-0000-7000-0000-000000000012",
    "query": "Next.js",
    "active": false,
    "updatedAt": "2026-07-22T16:00:00.000Z"
  }
}
```

---

### `DELETE /api/v1/queries/:id`

Delete an automation topic by ID.

**URL Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | `uuidv7` | ID of the query to delete |

**Example Response** `200 OK`
```json
{
  "success": true,
  "message": "Query deleted successfully",
  "data": {
    "id": "01930000-0000-7000-0000-000000000012"
  }
}
```

---

## Dashboard

### `GET /api/v1/dashboard`

Returns aggregate stats, the 5 most recent tweets, and the next 5 upcoming scheduled tweets.

**Example Response** `200 OK`
```json
{
  "success": true,
  "message": "dashboard info retrieved successfully",
  "data": {
    "stats": {
      "totalTweets": 42,
      "pendingTweets": 8,
      "postedTweets": 30,
      "failedTweets": 4,
      "activeQueries": 6
    },
    "recentTweets": [
      {
        "id": "01930000-0000-7000-0000-000000000001",
        "type": "automation",
        "content": "AI is reshaping how we build software...",
        "status": "posted",
        "createdAt": "2026-07-22T10:00:00.000Z"
      }
    ],
    "upcomingTweets": [
      {
        "id": "01930000-0000-7000-0000-000000000005",
        "content": "Scheduled insight on TypeScript...",
        "scheduledFor": "2026-07-23T10:00:00.000Z",
        "status": "pending"
      }
    ]
  }
}
```

---

## Settings

### `GET /api/v1/settings`

Retrieve the current automation and scheduling settings.

**Example Response** `200 OK`
```json
{
  "success": true,
  "message": "Settings fetched successfully",
  "data": {
    "id": "01930000-0000-7000-0000-000000000020",
    "automationEnabled": true,
    "postingTimes": ["10:00", "14:00", "18:00", "22:00"],
    "automationTimes": ["00:00", "01:00", "02:00"],
    "timezone": "Asia/Kolkata",
    "createdAt": "2026-07-09T15:00:00.000Z",
    "updatedAt": "2026-07-20T08:00:00.000Z"
  }
}
```

---

### `PATCH /api/v1/settings/:settingId`

Update one or more settings fields. At least one field must be provided.

**URL Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `settingId` | `uuidv7` | ID of the settings record |

**Request Body** (at least one field required)

| Field | Type | Description |
|-------|------|-------------|
| `automationEnabled` | `boolean` | Enable or disable automated tweet generation |
| `postingTimes` | `string[]` | Array of 24h time strings (e.g. `["10:00", "14:00"]`) |
| `automationTimes` | `string[]` | Array of 24h time strings for when automation runs |
| `timezone` | `string` | IANA timezone string (e.g. `"Asia/Kolkata"`) |

**Example Request**
```json
{
  "automationEnabled": false,
  "postingTimes": ["09:00", "13:00", "17:00"],
  "timezone": "America/New_York"
}
```

**Example Response** `200 OK`
```json
{
  "success": true,
  "message": "Settings updated successfully",
  "data": {
    "id": "01930000-0000-7000-0000-000000000020",
    "automationEnabled": false,
    "postingTimes": ["09:00", "13:00", "17:00"],
    "automationTimes": ["00:00", "01:00", "02:00"],
    "timezone": "America/New_York",
    "updatedAt": "2026-07-22T16:30:00.000Z"
  }
}
```

---

## Automation

### `POST /api/v1/automation/run`

Manually trigger a full automation cycle. Picks active queries, searches Tavily, generates tweets with Gemini, and saves them as pending.

> Useful for testing or generating tweets on demand without waiting for the cron schedule.

**Request Body**

None required.

**Example Response** `200 OK`
```json
{
  "success": true,
  "message": "Automation completed successfully",
  "data": {
    "tweetsGenerated": 4
  }
}
```

---

## Error Codes

| HTTP Status | Meaning |
|-------------|---------|
| `200` | Success |
| `201` | Resource created |
| `400` | Validation error — check the `error` field for details |
| `404` | Resource not found |
| `500` | Internal server error |

---

## Data Types

### Tweet Object

| Field | Type | Notes |
|-------|------|-------|
| `id` | `string` (uuidv7) | Unique identifier |
| `content` | `string` | Tweet body text |
| `hashtags` | `string[] \| null` | Without `#` prefix |
| `query` | `string \| null` | Topic used for automation tweets |
| `type` | `"automation" \| "custom"` | How the tweet was created |
| `status` | `"draft" \| "pending" \| "posted" \| "failed"` | Lifecycle state |
| `scheduledFor` | `ISO 8601 \| null` | Scheduled posting time |
| `postedAt` | `ISO 8601 \| null` | Actual time posted |
| `createdAt` | `ISO 8601` | Record creation timestamp |
| `updatedAt` | `ISO 8601` | Last update timestamp |

### Query Object

| Field | Type | Notes |
|-------|------|-------|
| `id` | `string` (uuidv7) | Unique identifier |
| `query` | `string` | Topic text (unique) |
| `active` | `boolean` | Whether it's used in automation |
| `createdAt` | `ISO 8601` | Record creation timestamp |
| `updatedAt` | `ISO 8601` | Last update timestamp |

### Settings Object

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `id` | `string` (uuidv7) | — | Unique identifier |
| `automationEnabled` | `boolean` | `true` | Global automation toggle |
| `postingTimes` | `string[]` | `["10:00","14:00","18:00","22:00"]` | 24h format |
| `automationTimes` | `string[]` | `["00:00","01:00","02:00"]` | 24h format |
| `timezone` | `string` | `"Asia/Kolkata"` | IANA timezone |
| `createdAt` | `ISO 8601` | — | |
| `updatedAt` | `ISO 8601` | — | |
