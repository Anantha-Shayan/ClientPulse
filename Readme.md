# ClientPulse

ClientPulse is a full-stack SaaS-style project tracker for digital transformation agencies managing many concurrent client engagements. It gives internal teams a delivery workspace, admins a portfolio analytics layer, and clients a read-only portal for their own project.

## Feature List

- JWT authentication with httpOnly cookie support and inactive-account checks.
- Role-based access control for `admin`, `member`, and `client`.
- PostgreSQL relational model for users, projects, assignments, milestones, tasks, comments, and tags.
- MongoDB audit trail for write-heavy activity events.
- Project health score computed from milestone completion, task completion, and overdue penalties.
- Admin dashboard with portfolio stats, health distribution, utilization charts, users, and logs.
- Member workspace scoped to assigned projects.
- Client portal scoped to one linked project, with budget/internal details hidden.
- Swagger docs mounted at `/api/v1/docs`.
- Docker Compose for Postgres, MongoDB, backend, and frontend.

## Screenshots

The app includes screenshot-ready views for the reviewer flow:

| View | What it demonstrates |
| --- | --- |
| Login | Seeded role shortcuts for admin, member, and client evaluation. |
| Admin dashboard | Portfolio KPIs, project health pie chart, and recent audit activity. |
| Project detail | Milestones plus kanban task board with role-scoped actions. |
| Client portal | Read-only project, milestones, tasks, and privacy-filtered team display. |

## Tech Stack

| Area | Stack |
| --- | --- |
| Backend | Node.js 20, Express, Prisma, Mongoose, JWT, bcrypt, Zod |
| Databases | PostgreSQL 15, MongoDB 7 |
| Security | Helmet, CORS, express-rate-limit, httpOnly cookies |
| Logging/Docs | Winston, Swagger |
| Frontend | React 18, Vite, TailwindCSS, React Router, Axios |
| UX | Recharts, Framer Motion, react-hot-toast, lucide-react |

## Database Design

ClientPulse uses two databases intentionally:

- PostgreSQL stores relational entities where consistency and joins matter: users, project ownership, team assignments, milestones, tasks, comments, and tags.
- MongoDB stores activity logs because audit events are append-heavy and metadata differs by action type.

This mirrors a production agency platform where delivery data needs ACID behavior while timeline events need flexible, indexed querying.

## Health Score Algorithm

Each project has a persisted `healthScore` from 0 to 100:

```text
milestoneScore  = (completedMilestones / totalMilestones) * 50
taskScore       = (completedTasks / totalTasks) * 30
timelinePenalty = overdueCount * 5
healthScore     = clamp(milestoneScore + taskScore - timelinePenalty, 0, 100)
```

Labels:

- `80-100`: On Track
- `50-79`: At Risk
- `0-49`: Critical

The backend recalculates health after milestone or task status changes.

## Architecture

```text
React + Tailwind UI
       |
Axios API client with credentials
       |
Express routes /api/v1
       |
Auth + RBAC + Zod validation
       |
Controllers -> Services -> Repositories
       |                    |
       |                    +-- Prisma -> PostgreSQL
       +-- Audit service -----> Mongoose -> MongoDB
```

## Local Setup

1. Create backend env:

```bash
cp backend/.env.example backend/.env
```

2. Start databases:

```bash
docker compose up -d postgres mongo
```

3. Install dependencies:

```bash
cd backend && npm install
cd ../frontend && npm install
```

4. Run Prisma and seed:

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

5. Start apps:

```bash
cd backend && npm run dev
cd frontend && npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000/api/v1`  
Swagger: `http://localhost:5000/api/v1/docs`

## Docker Setup

```bash
docker compose up --build
```

Then run migrations and seed inside the backend container:

```bash
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npm run seed
```

## Seed Accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@clientpulse.dev` | `Admin@123` |
| Member | `alice@clientpulse.dev` | `Member@123` |
| Member | `bob@clientpulse.dev` | `Member@123` |
| Client | `client@acmecorp.com` | `Client@123` |

## Future Improvements

- Socket.io notifications for assignments and milestone completions.
- Gantt timeline view for project delivery planning.
- One-time client invitation token flow.
- CSV export for analytics.
- Dark mode with persisted preference.
