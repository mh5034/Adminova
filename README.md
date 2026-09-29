# Adminova

Adminova is a full-stack admin dashboard and product management portal built with Next.js, React, TypeScript, Supabase, and TanStack Query.

The application provides an authenticated administrative interface for monitoring product analytics, managing inventory, performing bulk operations, and viewing detailed product activity.

## Features

### Dashboard

- Product analytics and KPI cards
- Total, active, and low-stock product metrics
- Inventory value tracking
- Product distribution visualizations
- Category and status analytics
- Date-range filtering
- Loading, error, and empty states
- Responsive dashboard layout

### Product Management

- Server-side pagination
- Product search
- Category and status filtering
- Column sorting
- URL-synchronized filters
- Create, read, update, and delete operations
- Multi-row selection
- Bulk status updates
- Bulk deletion
- Confirmation dialogs for destructive actions
- Loading and error handling
- Optimistic bulk updates with rollback on failure

### Product Details

- Dynamic product routes
- Detailed product information
- Product editing
- Product activity/history timeline
- Related products
- Optimized product images

### Advanced Product Form

- Multi-step product creation and editing
- Client-side validation
- Server-side validation
- Conditional form fields
- Local draft autosaving
- Draft restoration
- Loading states
- Success and error feedback

### Authentication & Authorization

Adminova uses Supabase Authentication and role-based access control.

Two roles are supported:

**Admin**
- View dashboard and products
- Create products
- Edit products
- Delete products
- Perform bulk actions

**Viewer**
- View dashboard and products
- View product details
- Read-only access to management functionality

Protected routes and API endpoints enforce authorization in addition to hiding restricted actions in the UI.

## Demo Accounts

### Administrator

```text
Email: admin@adminova.demo
Password: adminova
```

### Viewer

```text
Email: viewer@adminova.demo
Password: adminova
```

> Demo credentials are provided for assessment purposes only.

## Tech Stack

### Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- Recharts

### Data & State

- TanStack Query
- React Hook Form
- Zod

### Backend

- Next.js Route Handlers
- REST API
- Supabase
- PostgreSQL
- Supabase Authentication
- Row Level Security (RLS)

### Deployment

- Vercel
- Supabase

## Architecture

Adminova uses the Next.js App Router and combines the frontend and REST API in a single application.

```text
adminova/
├── app/
│   ├── (admin)/
│   │   ├── dashboard/
│   │   └── products/
│   ├── api/
│   │   ├── dashboard/
│   │   ├── me/
│   │   └── products/
│   ├── login/
│   └── layout.tsx
│
├── components/
│   ├── dashboard/
│   ├── products/
│   └── ui/
│
├── hooks/
├── lib/
│   ├── auth/
│   ├── supabase/
│   └── validation/
│
├── types/
└── public/
```

The application follows a reusable component architecture with separate layers for UI components, data-fetching hooks, validation, authentication, and API communication.

## REST API

Adminova exposes REST endpoints through Next.js Route Handlers.

### Products

```text
GET    /api/products
POST   /api/products

GET    /api/products/:id
PATCH  /api/products/:id
DELETE /api/products/:id

PATCH  /api/products/bulk
DELETE /api/products/bulk
```

The products endpoint supports server-side:

- Pagination
- Search
- Category filtering
- Status filtering
- Sorting

### Dashboard

```text
GET /api/dashboard
```

Returns aggregated product analytics used by the dashboard.

### Current User

```text
GET /api/me
```

Returns information about the currently authenticated user and their application role.

## State Management

TanStack Query is used for server-state management.

Product data is cached using query keys containing the current:

- Page
- Page size
- Search query
- Category
- Status
- Sort field
- Sort direction

Mutations invalidate or update the relevant cached queries to keep the interface synchronized with the server.

Bulk product status changes use optimistic cache updates for immediate UI feedback. If an API request fails, the previous cached state is restored before the server data is revalidated.

## URL-Synchronized Filtering

Product management state is synchronized with URL search parameters.

For example:

```text
/products?page=2&search=phone&category=Electronics&status=active&sort=price&order=asc
```

This makes filtered and sorted views shareable and preserves management state across navigation.

## Validation

Product input is validated using Zod.

Validation is performed on both the client and server to prevent invalid data from reaching the database.

The product form validates fields such as:

- Product name
- Description
- Category
- Price
- Stock
- Status
- Image URL
- Conditional inactive reason

## Draft Autosave

Product forms automatically save in-progress form data locally.

If the page is refreshed before submission, Adminova can restore the saved draft so that unfinished work is not lost.

Draft data is removed after a successful submission.

## Database

The application uses Supabase PostgreSQL.

Core application data includes:

### Products

Stores product information including:

- Name
- Description
- Category
- Price
- Stock
- Status
- Image URL
- Inactive reason
- Created and updated timestamps

### Product Activities

Stores product activity/history records associated with product changes.

### Profiles

Associates authenticated Supabase users with application roles such as:

```text
admin
viewer
```

Supabase Row Level Security is used as an additional authorization layer.

## Getting Started

### Prerequisites

Install:

- Node.js
- npm
- A Supabase account

### Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd adminova
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Do not commit `.env.local` or Supabase secrets to the repository.

### Run Locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Available Scripts

```bash
npm run dev
```

Starts the development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Runs the production build.

```bash
npm run lint
```

Runs ESLint.

## Deployment

The application is designed to be deployed with Vercel.

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Configure the required Supabase environment variables.
4. Deploy the project.
5. Verify authentication and protected routes using the demo accounts.

The production deployment uses Supabase as the hosted database and authentication provider.

## Security

Adminova implements multiple authorization and security layers:

- Supabase authentication
- Protected admin routes
- Role-based UI permissions
- Role checks on write API endpoints
- Supabase Row Level Security
- Client and server input validation
- Environment variables for configuration
- No application secrets stored in source code

## UI & UX

The interface is built using reusable components with responsive layouts for desktop and smaller screens.

The application includes:

- Skeleton loading states
- Empty states
- Error states
- Toast notifications
- Confirmation dialogs
- Responsive navigation
- Accessible form controls
- Consistent visual hierarchy

## Author

**Mohammad Hadi Elabed**

## License

This project was developed as a technical assessment.