# ClientPulse — Full Coding Agent Specification
> Digital Transformation Project Tracker · Tailored for Avidus Interactive
> Stack: Node.js · Express · PostgreSQL · MongoDB · React · TailwindCSS

---

## 0. AGENT INSTRUCTIONS

Read this file top to bottom before writing any code.

- Follow every schema, route, folder, and naming convention exactly as specified.
- Do NOT rename fields, routes, or collections unless explicitly noted.
- Use the dual-database pattern: PostgreSQL for relational data, MongoDB for event/activity logs.
- Apply RBAC middleware to every protected route — no exceptions.
- All responses must follow the standard API response envelope defined in Section 5.
- Build backend first (models → repositories → services → controllers → routes), then frontend.

---

## 1. PROJECT OVERVIEW

**Product Name:** ClientPulse  
**Tagline:** "How digital agencies manage 25+ client engagements without chaos."  
**Purpose:** A full-stack SaaS-style platform for digital transformation agencies (like Avidus Interactive) to manage client projects, track delivery milestones, assign team members, and give clients a read-only self-service portal — all with role-based access and a full audit trail.

**Core Problem Solved:**  
Agencies managing 20+ concurrent client projects across multiple countries lose visibility. Milestones are tracked in spreadsheets, client updates go through email threads, and there's no single system of record. ClientPulse fixes this.

---

## 2. USER ROLES & PERMISSIONS

### 2.1 Role Definitions

| Role          | Description                                                  |
|---------------|--------------------------------------------------------------|
| `admin`       | Internal agency staff with full system access               |
| `member`      | Internal team member assigned to specific projects           |
| `client`      | External client user — read-only portal access to own project|

### 2.2 Permissions Matrix

| Action                          | admin | member | client |
|---------------------------------|-------|--------|--------|
| Create / delete projects        | ✅    | ❌     | ❌     |
| Update project details          | ✅    | ✅     | ❌     |
| View all projects               | ✅    | ❌     | ❌     |
| View assigned projects only     | ✅    | ✅     | ❌     |
| View own project (client portal)| ❌    | ❌     | ✅     |
| Create / manage milestones      | ✅    | ✅     | ❌     |
| View milestones                 | ✅    | ✅     | ✅     |
| Create tasks                    | ✅    | ✅     | ❌     |
| View tasks                      | ✅    | ✅     | ✅     |
| Manage users                    | ✅    | ❌     | ❌     |
| View activity logs              | ✅    | ❌     | ❌     |
| View own activity               | ✅    | ✅     | ✅     |
| Access analytics dashboard      | ✅    | ❌     | ❌     |
| View project health score       | ✅    | ✅     | ✅     |

---

## 3. TECH STACK

### 3.1 Backend
| Layer         | Technology              | Reason                                                   |
|---------------|-------------------------|----------------------------------------------------------|
| Runtime       | Node.js 20+             | Async-first, consistent with Avidus stack                |
| Framework     | Express.js              | Required by assignment                                   |
| Primary DB    | PostgreSQL 15+          | Relational data: users, projects, milestones, tasks      |
| Secondary DB  | MongoDB 7+              | Flexible event storage: activity logs, audit trail       |
| ORM           | Prisma (PostgreSQL)     | Type-safe queries, migrations, clean schema management   |
| ODM           | Mongoose (MongoDB)      | Schema-enforced documents for activity logs              |
| Auth          | JWT (jsonwebtoken)      | Stateless, role-encoded tokens                           |
| Password hash | bcrypt                  | Industry standard                                        |
| Validation    | Zod                     | Schema-first input validation                            |
| Logging       | Winston                 | Structured request + error logging                       |
| Security      | Helmet, cors, express-rate-limit | HTTP hardening                               |
| API Docs      | Swagger (swagger-jsdoc + swagger-ui-express) | Auto-generated docs           |
| Config        | dotenv                  | Environment variable management                          |

### 3.2 Frontend
| Layer        | Technology              | Reason                                      |
|--------------|-------------------------|---------------------------------------------|
| Framework    | React 18 (Vite)         | Required by assignment                      |
| Styling      | TailwindCSS             | Utility-first, production-grade UI          |
| Charts       | Recharts                | Analytics dashboards                        |
| State        | React Context + useReducer | Lightweight, no Redux needed            |
| API Layer    | Axios + custom hooks    | Centralized API calls with interceptors     |
| Routing      | React Router v6         | Protected routes, nested layouts            |
| Animations   | Framer Motion           | Professional transitions                    |
| Toasts       | react-hot-toast         | Notifications                               |
| Forms        | react-hook-form + zod   | Validated, accessible forms                 |

---

## 4. DATABASE DESIGN

### 4.1 WHY DUAL DATABASE

**PostgreSQL** → Users, Projects, Milestones, Tasks, Assignments  
Reason: These entities are relational — a project has many milestones, a milestone has many tasks, users are assigned to projects. ACID compliance and JOIN queries are critical here.

**MongoDB** → Activity Logs, Audit Events  
Reason: Event logs are write-heavy, schema-flexible, and append-only. Each event type (task_created, milestone_updated, user_invited) has different metadata shapes. MongoDB's document model handles this without schema migrations. Also enables time-series-style queries for the audit timeline.

---

### 4.2 PostgreSQL Schemas (Prisma)

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  name          String
  email         String    @unique
  password      String
  role          Role      @default(MEMBER)
  status        Status    @default(ACTIVE)
  avatarUrl     String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  assignedProjects  ProjectMember[]
  createdProjects   Project[]       @relation("CreatedBy")
  tasksAssigned     Task[]          @relation("AssignedTo")
  tasksCreated      Task[]          @relation("CreatedBy")
  milestonesCreated Milestone[]
  clientProject     Project?        @relation("ClientOf")
}

enum Role {
  ADMIN
  MEMBER
  CLIENT
}

enum Status {
  ACTIVE
  INACTIVE
}

model Project {
  id              String    @id @default(uuid())
  name            String
  description     String?
  status          ProjectStatus @default(PLANNING)
  healthScore     Int       @default(100)  // 0–100, computed field
  startDate       DateTime
  endDate         DateTime?
  budget          Float?
  clientId        String?   @unique       // One client user per project
  createdById     String
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  client          User?         @relation("ClientOf", fields: [clientId], references: [id])
  createdBy       User          @relation("CreatedBy", fields: [createdById], references: [id])
  members         ProjectMember[]
  milestones      Milestone[]
  tags            ProjectTag[]
}

enum ProjectStatus {
  PLANNING
  IN_PROGRESS
  ON_HOLD
  COMPLETED
  CANCELLED
}

model ProjectMember {
  id         String   @id @default(uuid())
  projectId  String
  userId     String
  role       String   @default("member")  // e.g. "lead", "member"
  joinedAt   DateTime @default(now())

  project    Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([projectId, userId])
}

model Milestone {
  id          String          @id @default(uuid())
  projectId   String
  title       String
  description String?
  status      MilestoneStatus @default(PENDING)
  dueDate     DateTime
  completedAt DateTime?
  createdById String
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  project     Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  createdBy   User      @relation(fields: [createdById], references: [id])
  tasks       Task[]
}

enum MilestoneStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  OVERDUE
}

model Task {
  id            String      @id @default(uuid())
  milestoneId   String
  title         String
  description   String?
  status        TaskStatus  @default(TODO)
  priority      Priority    @default(MEDIUM)
  assignedToId  String?
  createdById   String
  dueDate       DateTime?
  completedAt   DateTime?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  milestone     Milestone   @relation(fields: [milestoneId], references: [id], onDelete: Cascade)
  assignedTo    User?       @relation("AssignedTo", fields: [assignedToId], references: [id])
  createdBy     User        @relation("CreatedBy", fields: [createdById], references: [id])
  comments      Comment[]
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  IN_REVIEW
  DONE
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  CRITICAL
}

model Comment {
  id        String   @id @default(uuid())
  taskId    String
  authorId  String
  content   String
  createdAt DateTime @default(now())

  task      Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)
}

model ProjectTag {
  id        String   @id @default(uuid())
  projectId String
  label     String

  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
}
```

---

### 4.3 MongoDB Schema (Mongoose)

```javascript
// src/models/ActivityLog.model.js

const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        'USER_LOGIN',
        'USER_LOGOUT',
        'USER_CREATED',
        'USER_STATUS_CHANGED',
        'PROJECT_CREATED',
        'PROJECT_UPDATED',
        'PROJECT_DELETED',
        'MILESTONE_CREATED',
        'MILESTONE_UPDATED',
        'MILESTONE_COMPLETED',
        'TASK_CREATED',
        'TASK_UPDATED',
        'TASK_ASSIGNED',
        'TASK_COMPLETED',
        'TASK_DELETED',
        'COMMENT_ADDED',
        'MEMBER_ADDED',
        'MEMBER_REMOVED',
        'CLIENT_INVITED',
      ],
    },
    performedBy: {
      userId: { type: String, required: true },
      name:   { type: String, required: true },
      role:   { type: String, required: true },
    },
    targetEntity: {
      type:       { type: String },  // 'project' | 'milestone' | 'task' | 'user'
      id:         { type: String },
      name:       { type: String },
    },
    projectId:  { type: String, index: true },  // for scoped log queries
    metadata:   { type: mongoose.Schema.Types.Mixed },  // flexible extra data
    ipAddress:  { type: String },
    userAgent:  { type: String },
  },
  {
    timestamps: true,
    collection: 'activity_logs',
  }
);

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ projectId: 1, createdAt: -1 });
activityLogSchema.index({ 'performedBy.userId': 1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
```

---

## 5. API DESIGN

### 5.1 Standard Response Envelope

```json
// Success
{
  "success": true,
  "data": { },
  "message": "Optional human-readable message"
}

// Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "email is required",
    "details": [ ]
  }
}

// Paginated
{
  "success": true,
  "data": [ ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 87,
    "totalPages": 5
  }
}
```

### 5.2 API Routes

#### AUTH  `/api/v1/auth`
| Method | Path        | Access  | Description               |
|--------|-------------|---------|---------------------------|
| POST   | /register   | Public  | Register (admin creates accounts; clients are invited) |
| POST   | /login      | Public  | Login, returns JWT        |
| POST   | /logout     | Private | Invalidate session (log event) |
| GET    | /me         | Private | Get current user profile  |
| PATCH  | /me         | Private | Update own profile        |

#### USERS  `/api/v1/users`
| Method | Path           | Access | Description                  |
|--------|----------------|--------|------------------------------|
| GET    | /              | admin  | List all users (paginated, filterable) |
| GET    | /:id           | admin  | Get single user              |
| PATCH  | /:id/status    | admin  | Activate / deactivate user   |
| DELETE | /:id           | admin  | Delete user                  |
| POST   | /invite-client | admin  | Invite a client user to a project |

#### PROJECTS  `/api/v1/projects`
| Method | Path              | Access         | Description                         |
|--------|-------------------|----------------|-------------------------------------|
| POST   | /                 | admin          | Create project                      |
| GET    | /                 | admin          | List all projects (with filters)    |
| GET    | /my              | member         | List projects assigned to me        |
| GET    | /client-portal    | client         | Get my project (client view)        |
| GET    | /:id             | admin, member  | Get project detail                  |
| PATCH  | /:id             | admin, member  | Update project                      |
| DELETE | /:id             | admin          | Delete project                      |
| POST   | /:id/members     | admin          | Add team member to project          |
| DELETE | /:id/members/:userId | admin      | Remove team member                  |

#### MILESTONES  `/api/v1/projects/:projectId/milestones`
| Method | Path   | Access                   | Description              |
|--------|--------|--------------------------|--------------------------|
| POST   | /      | admin, member            | Create milestone         |
| GET    | /      | admin, member, client    | List milestones          |
| GET    | /:id   | admin, member, client    | Get milestone detail     |
| PATCH  | /:id   | admin, member            | Update milestone         |
| DELETE | /:id   | admin                    | Delete milestone         |

#### TASKS  `/api/v1/milestones/:milestoneId/tasks`
| Method | Path         | Access                | Description           |
|--------|--------------|-----------------------|-----------------------|
| POST   | /            | admin, member         | Create task           |
| GET    | /            | admin, member, client | List tasks            |
| GET    | /:id         | admin, member, client | Get task detail       |
| PATCH  | /:id         | admin, member         | Update task           |
| DELETE | /:id         | admin                 | Delete task           |
| POST   | /:id/comments| admin, member         | Add comment to task   |

#### ACTIVITY LOGS  `/api/v1/logs`
| Method | Path          | Access | Description                       |
|--------|---------------|--------|-----------------------------------|
| GET    | /             | admin  | All logs (paginated, filterable)  |
| GET    | /project/:id  | admin, member | Logs for a specific project |
| GET    | /me           | all    | Current user's own activity       |

#### ANALYTICS  `/api/v1/analytics`
| Method | Path              | Access | Description                    |
|--------|-------------------|--------|--------------------------------|
| GET    | /overview         | admin  | Platform-wide stats            |
| GET    | /projects         | admin  | Project health breakdown       |
| GET    | /team             | admin  | Team member utilization        |
| GET    | /project/:id      | admin, member | Single project metrics  |

#### HEALTH  `/api/v1/health`
| Method | Path | Access | Description          |
|--------|------|--------|----------------------|
| GET    | /    | Public | Health check endpoint|

---

## 6. HEALTH SCORE ALGORITHM

The `healthScore` (0–100) on a Project is a computed metric updated whenever milestones or tasks change.

```
FORMULA:
  milestoneScore  = (completedMilestones / totalMilestones) * 50
  taskScore       = (completedTasks / totalTasks) * 30
  timelinePenalty = overdueCount * 5          // subtract per overdue item
  healthScore     = clamp(milestoneScore + taskScore - timelinePenalty, 0, 100)

THRESHOLDS:
  80–100 → "On Track"   (green)
  50–79  → "At Risk"    (amber)
  0–49   → "Critical"   (red)
```

Recalculate and persist to PostgreSQL on every milestone/task status change via a service helper `recalculateProjectHealth(projectId)`.

---

## 7. BACKEND FOLDER STRUCTURE

```
backend/
├── src/
│   ├── config/
│   │   ├── db.postgres.js       # Prisma client singleton
│   │   ├── db.mongo.js          # Mongoose connection
│   │   ├── swagger.js           # Swagger definition
│   │   └── env.js               # Zod-validated env vars
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── project.controller.js
│   │   ├── milestone.controller.js
│   │   ├── task.controller.js
│   │   ├── log.controller.js
│   │   └── analytics.controller.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── project.service.js
│   │   ├── milestone.service.js
│   │   ├── task.service.js
│   │   ├── log.service.js
│   │   ├── analytics.service.js
│   │   └── health.service.js    # recalculateProjectHealth()
│   │
│   ├── repositories/
│   │   ├── user.repo.js
│   │   ├── project.repo.js
│   │   ├── milestone.repo.js
│   │   ├── task.repo.js
│   │   └── log.repo.js          # MongoDB queries only
│   │
│   ├── middleware/
│   │   ├── authenticate.js      # JWT verification → attaches req.user
│   │   ├── authorize.js         # authorize('admin', 'member') factory
│   │   ├── validateBody.js      # Zod schema validation wrapper
│   │   ├── errorHandler.js      # Global error handler
│   │   ├── requestLogger.js     # Winston request logger
│   │   └── rateLimiter.js       # express-rate-limit config
│   │
│   ├── models/
│   │   └── ActivityLog.model.js # Mongoose model (MongoDB)
│   │   # PostgreSQL models are in prisma/schema.prisma
│   │
│   ├── routes/
│   │   ├── index.js             # Mounts all routers under /api/v1
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── project.routes.js
│   │   ├── milestone.routes.js
│   │   ├── task.routes.js
│   │   ├── log.routes.js
│   │   └── analytics.routes.js
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── user.validator.js
│   │   ├── project.validator.js
│   │   ├── milestone.validator.js
│   │   └── task.validator.js
│   │
│   ├── utils/
│   │   ├── ApiResponse.js       # Standard response helpers: success(), error(), paginated()
│   │   ├── ApiError.js          # Custom error class with status code + error code
│   │   ├── asyncHandler.js      # try/catch wrapper for async controllers
│   │   ├── paginate.js          # Pagination helper for Prisma queries
│   │   └── jwt.js               # signToken(), verifyToken()
│   │
│   ├── logs/                    # Winston output directory (gitignored)
│   │   ├── error.log
│   │   └── combined.log
│   │
│   └── app.js                   # Express app setup (middleware stack, routes, swagger)
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── server.js                    # Entry point: connects DBs, starts server
├── .env
├── .env.example
├── package.json
└── Dockerfile
```

---

## 8. FRONTEND FOLDER STRUCTURE

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/                  # Reusable primitives
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Skeleton.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── Avatar.jsx
│   │   │   ├── HealthBadge.jsx  # On Track / At Risk / Critical
│   │   │   └── EmptyState.jsx
│   │   │
│   │   ├── layout/
│   │   │   ├── AdminSidebar.jsx
│   │   │   ├── MemberSidebar.jsx
│   │   │   ├── ClientSidebar.jsx
│   │   │   ├── TopBar.jsx
│   │   │   └── PageWrapper.jsx
│   │   │
│   │   ├── projects/
│   │   │   ├── ProjectCard.jsx
│   │   │   ├── ProjectForm.jsx
│   │   │   ├── ProjectHealthBar.jsx
│   │   │   └── MemberChips.jsx
│   │   │
│   │   ├── milestones/
│   │   │   ├── MilestoneList.jsx
│   │   │   ├── MilestoneCard.jsx
│   │   │   └── MilestoneForm.jsx
│   │   │
│   │   ├── tasks/
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   ├── KanbanBoard.jsx
│   │   │   └── CommentThread.jsx
│   │   │
│   │   └── analytics/
│   │       ├── StatCard.jsx
│   │       ├── ProjectStatusPie.jsx
│   │       ├── TeamUtilizationBar.jsx
│   │       ├── MilestoneTimeline.jsx
│   │       └── ActivityFeed.jsx
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   └── UnauthorizedPage.jsx
│   │   │
│   │   ├── admin/
│   │   │   ├── DashboardPage.jsx      # Analytics overview
│   │   │   ├── ProjectsPage.jsx       # All projects list
│   │   │   ├── ProjectDetailPage.jsx  # Milestones + tasks + health
│   │   │   ├── UsersPage.jsx          # User management
│   │   │   ├── ActivityLogsPage.jsx   # Full audit log
│   │   │   └── AnalyticsPage.jsx      # Charts + BI-style views
│   │   │
│   │   ├── member/
│   │   │   ├── MyProjectsPage.jsx     # Assigned projects only
│   │   │   ├── ProjectDetailPage.jsx  # Same as admin but scoped
│   │   │   └── ProfilePage.jsx
│   │   │
│   │   └── client/
│   │       ├── ClientPortalPage.jsx   # Their project only
│   │       ├── MilestonesPage.jsx
│   │       └── ProfilePage.jsx
│   │
│   ├── layouts/
│   │   ├── AuthLayout.jsx             # Centered login layout
│   │   ├── AdminLayout.jsx            # Admin sidebar + topbar
│   │   ├── MemberLayout.jsx
│   │   └── ClientLayout.jsx
│   │
│   ├── routes/
│   │   ├── index.jsx                  # Root router
│   │   ├── ProtectedRoute.jsx         # Redirects unauthenticated
│   │   └── RoleRoute.jsx              # Redirects wrong role
│   │
│   ├── context/
│   │   ├── AuthContext.jsx            # user, token, login(), logout()
│   │   └── ToastContext.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useProjects.js
│   │   ├── useMilestones.js
│   │   ├── useTasks.js
│   │   ├── useAnalytics.js
│   │   └── usePagination.js
│   │
│   ├── services/
│   │   ├── api.js                     # Axios instance with auth interceptor
│   │   ├── auth.api.js
│   │   ├── user.api.js
│   │   ├── project.api.js
│   │   ├── milestone.api.js
│   │   ├── task.api.js
│   │   └── analytics.api.js
│   │
│   ├── utils/
│   │   ├── formatDate.js
│   │   ├── getHealthColor.js          # Returns Tailwind color class by score
│   │   └── constants.js
│   │
│   └── App.jsx
│
├── index.html
├── vite.config.js
├── tailwind.config.js
├── .env
└── .env.example
```

---

## 9. FULL FEATURE LIST

### 9.1 Authentication
- [x] Register (admin-created accounts only; client invite flow separate)
- [x] Login with email + password → returns signed JWT with `{ id, role, name }`
- [x] Logout → logs event to MongoDB
- [x] JWT expiry: 7 days; refresh not required for v1
- [x] bcrypt password hashing (saltRounds: 12)
- [x] Inactive account check on login

### 9.2 User Management (Admin)
- [x] List all users with pagination, role filter, status filter, search by name/email
- [x] Activate / deactivate user accounts
- [x] Delete user (with guard: cannot delete self, cannot delete assigned project lead)
- [x] Invite client: creates a CLIENT role user and links them to a project

### 9.3 Project Management
- [x] Create project with name, description, start date, optional end date, budget, tags
- [x] Assign team members to a project (many-to-many via ProjectMember)
- [x] Link exactly one client user per project
- [x] Project status transitions: PLANNING → IN_PROGRESS → ON_HOLD → COMPLETED
- [x] Auto-compute and persist `healthScore` on every status change (see Section 6)
- [x] Admin sees all projects; Member sees only assigned; Client sees only their own
- [x] Soft filter by status, tag, date range
- [x] Search projects by name

### 9.4 Milestone Management
- [x] Create milestones scoped to a project
- [x] Set due date, description, and status
- [x] Mark milestone as COMPLETED → triggers `recalculateProjectHealth()`
- [x] Overdue detection: cron-free, computed on read (dueDate < now && status != COMPLETED)
- [x] Client can view milestones of their own project

### 9.5 Task Management
- [x] Create tasks scoped to a milestone
- [x] Set priority (LOW / MEDIUM / HIGH / CRITICAL)
- [x] Assign task to a team member
- [x] Kanban board view: columns = TODO / IN_PROGRESS / IN_REVIEW / DONE
- [x] Move task between statuses → logs event → recalculates health
- [x] Add comments to a task (admin + member only)
- [x] Client can view tasks but not comment

### 9.6 Activity Log & Audit Trail
- [x] Every significant action is logged to MongoDB with performer, target, timestamp, metadata
- [x] Admin can view full log: filterable by action type, project, user, date range
- [x] Member can view logs scoped to their assigned projects
- [x] Client can view their own project's public-facing activity (filtered: no internal actions)
- [x] Audit timeline UI: vertical timeline with action icons

### 9.7 Analytics Dashboard (Admin)
- [x] Overview stats: total users, active users, total projects, active projects, completed projects
- [x] Project health distribution: pie chart (On Track / At Risk / Critical)
- [x] Milestone completion rate: completed vs pending vs overdue (stacked bar)
- [x] Task velocity: tasks completed per week (line chart)
- [x] Team utilization: tasks assigned per member (horizontal bar)
- [x] Recent activity feed: last 20 events across platform

### 9.8 Client Portal
- [x] Dedicated read-only UI for CLIENT role
- [x] Shows their project details, health score, milestones, and tasks
- [x] Cannot see team member names beyond first name + role (privacy)
- [x] Cannot see budget or internal notes
- [x] Activity timeline scoped to their project (milestone updates, completions only)

### 9.9 Security & Infrastructure
- [x] Helmet for HTTP header hardening
- [x] CORS configured to allow only frontend origin
- [x] Rate limiting: 100 req/15min on auth routes, 500 req/15min on all others
- [x] Input sanitization via Zod on all request bodies
- [x] JWT stored in httpOnly cookie (not localStorage)
- [x] `.env` validation via Zod on server startup — fails fast on missing vars
- [x] Winston logging: request log + error log → `/src/logs/`
- [x] `/api/v1/health` endpoint returns DB connectivity status
- [x] Swagger docs at `/api/v1/docs`

### 9.10 DevOps (Bonus)
- [x] `Dockerfile` for backend
- [x] `docker-compose.yml` for postgres + mongo + backend + frontend
- [x] PM2 `ecosystem.config.js` for production process management
- [x] `.env.example` for both backend and frontend

---

## 10. ENVIRONMENT VARIABLES

### Backend `.env.example`
```
NODE_ENV=development
PORT=5000

# PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/clientpulse

# MongoDB
MONGO_URI=mongodb://localhost:27017/clientpulse_logs

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=500
```

### Frontend `.env.example`
```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

---

## 11. SEED DATA

Create a `prisma/seed.js` that provisions:

| Role   | Email                       | Password    | Notes                          |
|--------|-----------------------------|-------------|--------------------------------|
| admin  | admin@clientpulse.dev       | Admin@123   | Full access                    |
| member | alice@clientpulse.dev       | Member@123  | Assigned to Project Alpha      |
| member | bob@clientpulse.dev         | Member@123  | Assigned to Project Alpha      |
| client | client@acmecorp.com         | Client@123  | Linked to Project Alpha portal |

Seed also creates:
- 1 project "Project Alpha" (status: IN_PROGRESS)
- 3 milestones with varying statuses
- 6 tasks across milestones, some assigned
- 10 sample activity log documents in MongoDB

---

## 12. BONUS FEATURES (IMPLEMENT IF TIME ALLOWS)

Priority order:

1. **Real-time notifications** via Socket.io — task assigned, milestone completed → notify relevant users instantly
2. **Project timeline Gantt view** — milestones plotted on a horizontal timeline (use a lightweight lib or custom SVG)
3. **Client email invitation** — generate a one-time invite token; client sets their own password on first login
4. **CSV export** of analytics data (admin only)
5. **Dark mode** — Tailwind `dark:` class support, toggled via localStorage preference

---

## 13. README MUST COVER

1. Project overview + problem statement
2. Feature list with screenshots
3. Tech stack table
4. DB design decisions (why PostgreSQL + MongoDB)
5. Health score algorithm explanation
6. Architecture diagram (ASCII or image)
7. Setup instructions (local + Docker)
8. API documentation link (Swagger)
9. Seed instructions
10. Future improvements

---

## 14. EVALUATION SIGNALS TO MAXIMISE

| Signal                     | How ClientPulse Demonstrates It                            |
|----------------------------|------------------------------------------------------------|
| System design thinking     | Dual DB with clear justification; health score algorithm   |
| RBAC depth                 | 3 roles, fine-grained permission matrix, client portal     |
| Security                   | JWT in httpOnly cookie, Helmet, rate limiting, Zod         |
| Architecture               | Controller → Service → Repository layering; clean DI       |
| Production readiness       | Winston logs, health endpoint, Swagger, Docker, .env guard |
| UI polish                  | Tailwind + Framer Motion + Recharts + Kanban board         |
| Scalability thinking       | Pagination everywhere, indexed MongoDB queries             |
| Creativity                 | Client portal, health score, agency-specific angle         |
| Domain relevance           | Built specifically for Avidus's own operational problem    |
