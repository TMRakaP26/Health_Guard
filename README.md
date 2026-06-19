# HealthGuard — Insurance Claims Management System

A full-stack web application for managing insurance claims with two portals: **Client Portal** (for members to submit and track claims) and **Analyst Portal** (for claim analysts to review and process claims). Built with React + Vite frontend and Laravel backend.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Frontend Routes](#frontend-routes)
- [Backend API Endpoints](#backend-api-endpoints)
- [Database Schema](#database-schema)
- [State Management](#state-management)
- [Authentication Flow](#authentication-flow)
- [Setup & Running](#setup--running)
- [Vite Dev Proxy Configuration](#vite-dev-proxy-configuration)
- [Key Implementation Details](#key-implementation-details)

---

## Project Structure

```
c:\RAKA\Kuliah\
├── Random\                          ← Frontend (React + Vite)
│   ├── src\
│   │   ├── app\
│   │   │   ├── api\client.ts        ← Axios instance with interceptors
│   │   │   ├── components\          ← Shared UI components
│   │   │   │   ├── ui\              ← shadcn/ui components (46 files)
│   │   │   │   ├── Header.tsx       ← Top nav bar with search, notifications, profile avatar
│   │   │   │   ├── Sidebar.tsx      ← Client sidebar navigation
│   │   │   │   ├── AnalystSidebar.tsx ← Analyst sidebar navigation
│   │   │   │   ├── Layout.tsx       ← Client layout wrapper
│   │   │   │   ├── AnalystLayout.tsx ← Analyst layout wrapper
│   │   │   │   ├── NotificationBell.tsx ← Real-time notification dropdown
│   │   │   │   └── ProtectedRoute.tsx  ← Role-based route guard
│   │   │   ├── pages\
│   │   │   │   ├── Login.tsx        ← Login + Quick Sign In
│   │   │   │   ├── Register.tsx     ← Account registration
│   │   │   │   ├── Dashboard.tsx    ← Client claims dashboard
│   │   │   │   ├── ClientClaimForm.tsx ← 4-step claim submission wizard
│   │   │   │   ├── Profile.tsx      ← Client profile page
│   │   │   │   ├── Guide.tsx        ← User guide page
│   │   │   │   ├── AnalystDashboard.tsx ← Analyst claims overview
│   │   │   │   ├── AnalystReview.tsx   ← Claim review & status update
│   │   │   │   ├── UnassignedClaims.tsx ← Unassigned claims list
│   │   │   │   ├── MyAssignments.tsx   ← Analyst's assigned claims
│   │   │   │   ├── Settings.tsx     ← Account settings (profile photo, editable fields, password)
│   │   │   │   └── EmptyState.tsx   ← 404 / empty placeholder
│   │   │   ├── state\
│   │   │   │   ├── AuthContext.tsx   ← Authentication state (user, token, login, register, logout)
│   │   │   │   └── ClaimContext.tsx  ← Claims CRUD state with API integration
│   │   │   ├── utils\
│   │   │   │   └── cookies.ts       ← Quick Sign In cookie management (hg_quick_user)
│   │   │   ├── routes.tsx           ← React Router v7 route definitions
│   │   │   └── App.tsx              ← Root component (providers + router)
│   │   ├── styles\                  ← Tailwind CSS + custom theme
│   │   └── main.tsx                 ← Entry point
│   ├── screen2\                     ← Standalone Figma-converted screen (unused in main app)
│   ├── screen3\                     ← Standalone Figma-converted screen (unused in main app)
│   ├── screen4\                     ← Standalone Figma-converted screen (unused in main app)
│   ├── _gen\                        ← Temp directory for PHP file generation (copy-to-backend pattern)
│   ├── vite.config.ts               ← Vite config with API/storage proxy
│   ├── package.json
│   └── index.html
│
└── healthguard-api\                 ← Backend (Laravel 11)
    ├── app\
    │   ├── Http\Controllers\
    │   │   ├── AuthController.php       ← Register, login, logout, profile CRUD, photo upload
    │   │   ├── ClaimController.php      ← Claims CRUD, assignment, status updates, auto-notifications
    │   │   ├── DocumentController.php   ← File upload/download for claim documents
    │   │   └── NotificationController.php ← Notification list, unread count, mark as read
    │   ├── Http\Middleware\
    │   │   └── RoleMiddleware.php       ← Role-based access middleware
    │   └── Models\
    │       ├── User.php                 ← User model (name, email, username, phone, address, role, profile_photo)
    │       ├── Claim.php                ← Claim model (claim_id, client_name, type, provider, amount, status)
    │       ├── Document.php             ← Document model (file_name, file_path, file_size, mime_type)
    │       └── Notification.php         ← Notification model (type, title, body, claim_id, read_at)
    ├── database\migrations\             ← 11 migration files
    ├── routes\api.php                   ← API route definitions
    └── storage\app\public\              ← Uploaded files (profile photos, claim documents)
```

---

## Technology Stack

### Frontend (`c:\RAKA\Kuliah\Random`)

| Category | Technology |
|---|---|
| Framework | React 18.3 |
| Build Tool | Vite 6.3 |
| Language | TypeScript |
| Routing | react-router v7 (Browser Router via `createBrowserRouter`) |
| Styling | Tailwind CSS v4 with `@tailwindcss/vite` plugin |
| UI Components | shadcn/ui (46 components) built on Radix UI primitives |
| Icons | Lucide React |
| HTTP Client | Axios (with request/response interceptors) |
| State Management | React Context API (`AuthContext` + `ClaimContext`) |
| Animations | framer-motion (`motion`) + tw-animate-css |
| Charts | Recharts |
| Forms | react-hook-form |
| Date Handling | date-fns |

### Backend (`c:\RAKA\Kuliah\healthguard-api`)

| Category | Technology |
|---|---|
| Framework | Laravel 11 |
| PHP Version | 8.x (via Laragon) |
| Database | MySQL (hosted via Laragon at localhost:3306) |
| Authentication | Laravel Sanctum (token-based) |
| File Storage | Laravel public disk (`storage/app/public`) |
| Local Server | Laragon (Apache + MySQL + Node.js) |

---

## Features

### Authentication & Authorization
- **Email/password registration and login** via Laravel Sanctum tokens
- **Role-based access control**: `client` and `analyst` roles
- **Protected routes** with `ProtectedRoute` component — redirects unauthenticated users and enforces role-based routing
- **Quick Sign In**: Multi-user cookie-based fast login (`hg_quick_user` cookie stores up to 5 users with name, email, role, password). Users are automatically added to the Quick Sign In list on successful login/register
- **Session persistence**: Auth token and user data stored in `localStorage`

### Client Portal (`/client/*`)
- **Dashboard** — Lists user's claims with status badges (Pending/Approved/Rejected/Needs Info), total payouts in Rupiah (Rp), claim detail modal, search functionality
- **Submit Claim** — 4-step wizard:
  1. **Patient Info** — First name, last name, date of birth (auto-filled from logged-in user's name, all fields required)
  2. **Provider Details** — Date of service (auto-set to today), provider name, disease/condition (text input with optional dropdown from 16 common Indonesian diseases), billed amount in Rupiah (all required)
  3. **Upload Documents** — Multi-file upload (PDF/JPG/PNG up to 10MB), files are uploaded to backend after claim creation via `POST /claims/{id}/documents`
  4. **Review** — Summary of all data with document count, final submit
  - **Step validation**: Cannot advance if required fields are empty; shows error panel listing missing fields
- **Profile** — View account info with editable name and email
- **Guide** — User guide page

### Analyst Portal (`/analyst/*`)
- **Dashboard** — Overview of all claims with stats, search, claim detail modal, currency in Rupiah
- **Unassigned Claims** — Lists claims with `status=Pending` and `assigned_to=null`. "Manage" button assigns the claim to the current analyst via `POST /claims/{id}/assign`
- **My Assignments** — Lists claims assigned to the current analyst. Click to navigate to review page
- **Review** (`/analyst/review/:id`) — Detailed claim view with document viewer, status update (Approved/Rejected/Needs Info/Pending) with notes, billed amount in Rupiah
- **Settings** — Account settings page:
  - **Profile photo**: Upload/change/remove (JPG/PNG up to 2MB), shows camera overlay on hover
  - **Editable fields**: Name, username, email, phone, address
  - **Change password**: Current password verification, new password with confirmation
  - **Security info**: Shows auth method and session status

### Notifications (Both Portals)
- **Bell icon** replaced with `NotificationBell` component in the header
- Polls unread count every 30 seconds
- Dropdown shows notification list with type-specific icons, title, body, timestamp
- Mark individual as read on click, "Mark All as Read" button
- Notifications auto-created by backend on: claim submitted (to all analysts), claim assigned (to claim owner), status changed (to claim owner)

### Profile Photo (Both Portals)
- Stored in `storage/app/public/profile-photos/` via Laravel's public disk
- Displayed in: Settings page (large avatar with upload overlay), Header (small avatar), Profile page
- Served via `/storage/` path (proxied to Laravel in dev mode)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Vite)                       │
│                   localhost:5173                         │
│                                                         │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   Login   │  │ AuthContext   │  │  ClaimContext    │  │
│  │ Register  │  │ (user, token) │  │ (claims, CRUD)   │  │
│  └────┬─────┘  └──────┬───────┘  └───────┬──────────┘  │
│       │               │                   │             │
│  ┌────▼───────────────▼───────────────────▼──────────┐  │
│  │              Axios API Client                      │  │
│  │    (interceptors: auth token, 401 redirect)        │  │
│  └────────────────────┬──────────────────────────────┘  │
└───────────────────────│─────────────────────────────────┘
                        │ /api/* → localhost:8000
                        │ /storage/* → localhost:8000
┌───────────────────────▼─────────────────────────────────┐
│               Backend (Laravel 11)                       │
│                  localhost:8000                           │
│                                                         │
│  ┌────────────┐  ┌────────────┐  ┌──────────────────┐  │
│  │ AuthController│ │ClaimController│ │DocumentController│ │
│  │ (Sanctum)  │  │ (CRUD+assign)│  │ (file upload)   │  │
│  └─────┬──────┘  └──────┬─────┘  └───────┬──────────┘  │
│        │                │                  │             │
│  ┌─────▼────────────────▼──────────────────▼──────────┐ │
│  │              MySQL (Laragon)                        │ │
│  │     users | claims | documents | notifications      │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## Frontend Routes

Defined in `src/app/routes.tsx` using `createBrowserRouter`:

| Path | Component | Auth | Description |
|---|---|---|---|
| `/` | `Login` | Public | Login page with Quick Sign In |
| `/register` | `Register` | Public | Account registration |
| `/client` | `Dashboard` | client | Client claims dashboard |
| `/client/guide` | `Guide` | client | User guide |
| `/client/submit` | `ClientClaimForm` | client | 4-step claim submission |
| `/client/profile` | `Profile` | client | Client profile page |
| `/analyst` | `AnalystDashboard` | analyst | Analyst claims overview |
| `/analyst/review/:id` | `AnalystReview` | analyst | Claim review & status update |
| `/analyst/unassigned` | `UnassignedClaims` | analyst | Unassigned claims list |
| `/analyst/assignments` | `MyAssignments` | analyst | Analyst's assigned claims |
| `/analyst/settings` | `Settings` | analyst | Account settings |
| `*` | `EmptyState` | — | 404 Not Found |

All protected routes use `ProtectedRoute` with role enforcement. Unauthenticated users redirect to `/`. Wrong-role users redirect to their correct dashboard.

---

## Backend API Endpoints

Defined in `routes/api.php`. Base URL: `http://localhost:8000/api`.

### Public
| Method | Endpoint | Controller | Description |
|---|---|---|---|
| POST | `/register` | `AuthController@register` | Create account (name, email, password, role, username?, phone?, address?) |
| POST | `/login` | `AuthController@login` | Login with email + password, returns user + Sanctum token |
| GET | `/demo-users` | `AuthController@demoUsers` | List all users (for Quick Sign In) |

### Protected (requires `Authorization: Bearer {token}`)

**Auth**
| Method | Endpoint | Description |
|---|---|---|
| POST | `/logout` | Revoke current token |
| GET | `/user` | Get authenticated user |
| PUT | `/user` | Update profile (name, username, email, phone, address, password with current_password) |
| POST | `/user/photo` | Upload profile photo (multipart, `photo` field, image max 2MB) |
| DELETE | `/user/photo` | Remove profile photo |

**Claims**
| Method | Endpoint | Description |
|---|---|---|
| GET | `/claims` | List claims (paginated, filtered by role: clients see own, analysts see all) |
| POST | `/claims` | Create claim (client_name, type, provider_name, amount). Auto-notifies all analysts |
| GET | `/claims/unassigned` | List unassigned pending claims (analysts only) |
| GET | `/claims/my-assignments` | List claims assigned to current analyst |
| POST | `/claims/{id}/assign` | Assign claim to current analyst (analysts only). Notifies claim owner |
| GET | `/claims/{id}` | Get claim detail with documents |
| PUT | `/claims/{id}` | Update claim (resets status to Pending) |
| PATCH | `/claims/{id}/status` | Update status (Pending/Approved/Rejected/Needs Info) with optional notes. Notifies claim owner |

**Documents**
| Method | Endpoint | Description |
|---|---|---|
| GET | `/claims/{claimId}/documents` | List documents for a claim |
| POST | `/claims/{claimId}/documents` | Upload file (multipart, `file` field, pdf/jpg/png max 10MB) |
| GET | `/claims/{claimId}/documents/{documentId}/download` | Download document file |

**Notifications**
| Method | Endpoint | Description |
|---|---|---|
| GET | `/notifications` | List user notifications (paginated) |
| GET | `/notifications/unread-count` | Get unread notification count |
| POST | `/notifications/{id}/read` | Mark notification as read |
| POST | `/notifications/read-all` | Mark all notifications as read |

---

## Database Schema

### users
| Column | Type | Notes |
|---|---|---|
| id | bigint PK | Auto-increment |
| name | varchar(255) | Required |
| username | varchar(255) | Nullable, unique |
| email | varchar(255) | Required, unique |
| password | varchar(255) | Hashed |
| role | varchar(20) | `client` or `analyst`, default `client` |
| phone | varchar(20) | Nullable |
| address | varchar(1000) | Nullable |
| profile_photo | varchar(255) | Nullable, file path in storage |
| created_at / updated_at | timestamps | |

### claims
| Column | Type | Notes |
|---|---|---|
| id | bigint PK | Auto-increment |
| user_id | bigint FK | References users.id |
| assigned_to | bigint FK | Nullable, references users.id (analyst) |
| claim_id | varchar(50) | Unique, format: `CLM-YYYY-NNN` |
| client_name | varchar(255) | |
| provider_name | varchar(255) | |
| type | varchar(255) | Disease/condition |
| amount | decimal(10,2) | Billed amount in Rupiah |
| status | varchar(20) | Pending / Approved / Rejected / Needs Info |
| notes | text | Nullable, analyst notes |
| date_submitted | timestamp | |
| created_at / updated_at | timestamps | |

### documents
| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| claim_id | bigint FK | References claims.id |
| file_name | varchar(255) | Original filename |
| file_path | varchar(255) | Storage path |
| file_size | integer | Bytes |
| mime_type | varchar(100) | |
| created_at / updated_at | timestamps | |

### notifications
| Column | Type | Notes |
|---|---|---|
| id | bigint PK | |
| user_id | bigint FK | Recipient user |
| type | varchar(50) | `claim_submitted` / `claim_assigned` / `status_changed` |
| title | varchar(255) | |
| body | text | |
| claim_id | varchar(50) | Nullable, related claim ID |
| read_at | timestamp | Nullable |
| created_at / updated_at | timestamps | |

---

## State Management

### AuthContext (`src/app/state/AuthContext.tsx`)
Provides authentication state to the entire app:
- `user: User | null` — Current user object (id, name, username, email, role, phone, address, profile_photo)
- `token: string | null` — Sanctum bearer token
- `isAuthenticated: boolean` — Derived from token + user presence
- `login(email, password)` — POST `/login`, saves token + user to state + localStorage + Quick Sign In cookie
- `register(name, email, password, role?)` — POST `/register`, same persistence as login
- `logout()` — POST `/logout`, clears all state
- `refreshUser()` — GET `/user`, updates user in state + localStorage (used after profile/photo updates)

### ClaimContext (`src/app/state/ClaimContext.tsx`)
Manages claims data with API integration:
- `claims: Claim[]` — Current page of claims
- `pagination: PaginationInfo` — Pagination metadata
- `fetchClaims(page?)` — GET `/claims` with pagination
- `addClaim(data)` — POST `/claims`, returns created claim (used for document upload)
- `updateClaim(id, data)` — PUT `/claims/{id}`
- `updateClaimStatus(id, status, notes?)` — PATCH `/claims/{id}/status`
- `assignClaim(id)` — POST `/claims/{id}/assign`

### API Client (`src/app/api/client.ts`)
Axios instance configured with:
- `baseURL: '/api'` — proxied to Laravel via Vite dev server
- Request interceptor: attaches `Authorization: Bearer {token}` from localStorage
- Response interceptor: on 401, clears auth data and redirects to `/`

---

## Authentication Flow

1. User visits `/` → sees Login page
2. **Standard login**: Enter email + password → `AuthContext.login()` → POST `/api/login` → receives `{ user, token }` → stores in state + `localStorage` + Quick Sign In cookie
3. **Quick Sign In**: Click saved user avatar → auto-fills email + password from cookie → submits login
4. **Registration**: Visit `/register` → fill form → `AuthContext.register()` → POST `/api/register` → same persistence as login
5. **Session restore**: On app load, `AuthProvider` checks `localStorage` for saved token + user → restores session
6. **Route protection**: `ProtectedRoute` checks `isAuthenticated` and `user.role` → redirects if unauthorized
7. **Logout**: `AuthContext.logout()` → POST `/api/logout` (revokes token) → clears state + localStorage

### Quick Sign In Cookie
- Cookie name: `hg_quick_user`
- Stores JSON array of up to 5 `QuickUser` objects: `{ name, email, role, password }`
- Added on every successful login/register (moves user to top of list)
- Displayed as clickable avatars on the Login page

---

## Setup & Running

### Prerequisites
- **Node.js v22** (available via Laragon at `C:\laragon\bin\nodejs\node-v22`)
- **Laragon** (provides Apache, MySQL, PHP, Node.js)
- **Composer** (for Laravel dependencies)

### Backend Setup (Laravel)

```bash
cd c:\RAKA\Kuliah\healthguard-api

# Install PHP dependencies
composer install

# Configure .env (database connection via Laragon MySQL)
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=healthguard
# DB_USERNAME=root
# DB_PASSWORD=

# Generate app key
php artisan key:generate

# Run migrations
php artisan migrate

# Create storage symlink (required for profile photos and documents)
php artisan storage:link

# Start Laravel dev server
php artisan serve
# Runs on http://localhost:8000
```

### Frontend Setup (React + Vite)

```bash
cd c:\RAKA\Kuliah\Random

# Install dependencies
npm install

# Start dev server
npm run dev
# Runs on http://localhost:5173

# Production build
npm run build
# Outputs to dist/
```

### Running Both
1. Start Laragon (ensures MySQL is running)
2. Start Laravel: `php artisan serve` (port 8000)
3. Start React: `npm run dev` (port 5173)
4. Open browser: `http://localhost:5173`

---

## Vite Dev Proxy Configuration

In `vite.config.ts`, the dev server proxies API and storage requests to Laravel:

```ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
    '/storage': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
  },
},
```

- `/api/*` → Laravel API endpoints
- `/storage/*` → Uploaded files (profile photos, claim documents)

---

## Key Implementation Details

### Currency
All monetary values are displayed in **Indonesian Rupiah (Rp)** using:
```ts
amount.toLocaleString('id-ID', { minimumFractionDigits: 0 })
```

### Claim Submission Flow
1. User fills Patient Info (step 1) → validated on Next
2. User fills Provider Details (step 2) → validated on Next
3. User selects files to upload (step 3) → files held in React state
4. User reviews (step 4) → clicks Submit
5. On submit: `POST /claims` creates the claim → then each file is uploaded via `POST /claims/{claimId}/documents` sequentially

### Profile Photo Upload
- Backend: `POST /user/photo` (multipart/form-data with `photo` field)
- Stored in `storage/app/public/profile-photos/`
- Accessible at `/storage/profile-photos/{filename}`
- Old photo is deleted when a new one is uploaded
- Remove photo: `DELETE /user/photo`

### Notification Auto-Creation
The `ClaimController` automatically creates notifications:
- **New claim submitted** → notifies all analysts (`claim_submitted`)
- **Claim assigned** → notifies claim owner (`claim_assigned`)
- **Status changed** → notifies claim owner (`status_changed`)

### PHP File Editing Pattern
Since the Laravel backend (`c:\RAKA\Kuliah\healthguard-api`) is outside the frontend workspace, PHP files are:
1. Written to `c:\RAKA\Kuliah\Random\_gen\` (temp directory within workspace)
2. Copied to the Laravel directory via `Copy-Item` in PowerShell

### PowerShell Notes
- This is a Windows machine using PowerShell (does not support `&&` — use `;` instead)
- npm commands may require `powershell -ExecutionPolicy Bypass -Command "..."` due to execution policy restrictions
- Disk space is limited (~5.5 GB free) — use `npm install --prefer-offline` if network issues arise
