# QueueFlow - Day 1 Work Environment

This is a deliberately incomplete internal product codebase for your simulated junior full-stack job.

Your first assignment is **CUS-101: Customer Directory**.

## Read these first

1. `SCENARIO.txt` - what happened before you joined, what is happening now, and why this ticket exists.
2. `TICKET-CUS-101.md` - the actual engineering ticket.
3. Explore the existing code before changing anything.

Do not treat this repository as a tutorial. The existing code is the codebase you inherited from the team.

## Stack

- Next.js + React + TypeScript
- Node.js + Express + TypeScript
- MongoDB + Mongoose

## Prerequisites

- Node.js 22+
- npm
- MongoDB running locally, or a MongoDB Atlas connection string

## Setup

From the project root:

```bash
npm install
```

Create local environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

If you use MongoDB Atlas, replace `MONGODB_URI` in `backend/.env`.

Seed the development database:

```bash
npm run seed
```

Start both applications:

```bash
npm run dev
```

Open:

- Web app: http://localhost:3000
- API health check: http://localhost:5000/api/health
- Existing stats endpoint: http://localhost:5000/api/stats/summary

## Before starting CUS-101

Verify the existing system works before you modify it:

- Home page loads.
- API health endpoint returns 200.
- Dashboard summary can read seeded customer counts.
- `/customers` currently shows a feature-not-implemented state. That is intentional.

## Git workflow

Keep Git completely local/private if you prefer.

```bash
git init
git add .
git commit -m "chore: initial QueueFlow training codebase"
git checkout -b feat/CUS-101-customer-directory
```

Then implement the ticket.

## Important

The customer directory feature is intentionally NOT implemented for you.

You are expected to decide:

- API response shape
- query parsing/validation approach
- server-side search implementation
- server-side pagination implementation
- frontend component structure
- data-fetching approach
- error/loading/empty states
- mobile presentation

The codebase gives you context and existing patterns, not the solution.
