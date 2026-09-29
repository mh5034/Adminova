# Adminova

Adminova is a full-stack admin dashboard and product management portal built with Next.js, React, TypeScript, Supabase, and TanStack Query.

The application provides an authenticated administrative interface for monitoring product analytics, managing inventory, performing bulk operations, and reviewing detailed product information and activity.

---

## Live Application

**Live Demo:** https://the-adminova.vercel.app/

**GitHub Repository:** https://github.com/mh5034/adminova

### Demo Administrator

```text
Email: admin@adminova.demo
Password: adminova
```

### Demo Viewer

```text
Email: viewer@adminova.demo
Password: adminova
```

> Demo credentials are provided for assessment purposes only.

---

## Features

### Dashboard

- Dynamic product analytics and KPI cards
- Total product count
- Active product count
- Low-stock product monitoring
- Inventory value calculation
- Product distribution charts
- Category and status analytics
- Date-range filtering
- Responsive dashboard layout
- Loading, error, and empty states

### Product Management

- Server-side pagination
- Product search
- Category filtering
- Status filtering
- Column sorting
- URL-synchronized filters
- Create, read, update, and delete operations
- Multi-row selection
- Bulk status updates
- Bulk deletion
- Confirmation dialogs for destructive actions
- Loading and error handling

### Product Details

- Dynamic product routes
- Detailed product information
- Product editing
- Product activity/history timeline
- Related products
- Product image support

### Advanced Product Form

- Multi-step product creation and editing
- Client-side validation
- Server-side validation
- Conditional form fields
- Local draft autosaving
- Draft restoration
- Loading states
- Success feedback
- Error handling

### Authentication & Authorization

Adminova uses Supabase Authentication together with role-based access control.

Two application roles are supported:

#### Administrator

Administrators can:

- View the dashboard
- View products
- Create products
- Edit products
- Delete products
- Perform bulk management actions

#### Viewer

Viewers can:

- View the dashboard
- View products
- View individual product details

Viewer accounts have read-only access to product management functionality.

Authorization is not enforced only through the interface. Restricted API operations also perform server-side role checks.

---

# Technical Decisions

## Architecture

Adminova is structured as a full-stack Next.js application using the App Router.

The frontend and REST API exist within the same repository. Next.js Route Handlers provide the server-side API layer, while Supabase provides PostgreSQL database storage and authentication.

The project separates responsibilities across several layers:

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

The `(admin)` route group provides a shared protected layout for authenticated pages without adding an additional segment to the application's URLs.

Reusable components are used for tables, forms, dialogs, dashboard elements, navigation, and common UI elements.

Database access, authentication utilities, validation logic, TypeScript types, and data-fetching logic are kept separate from presentation components.

This structure keeps the application maintainable while avoiding unnecessary architectural complexity for the current project size.

---

## State Management

Adminova separates state according to its responsibility rather than using a single global state solution.

### Server State — TanStack Query

TanStack Query manages asynchronous server data such as:

- Product lists
- Pagination results
- Dashboard analytics
- Loading states
- Error states
- Cached API responses

Product queries use query keys containing the current table configuration:

```text
products
page
limit
search
category
status
sort
order
```

This allows different product views to be cached independently.

Queries are invalidated after mutations so that client data is synchronized with the database.

### Form State — React Hook Form

React Hook Form manages product form state.

It provides:

- Form value management
- Validation integration
- Submission state
- Field-level errors
- Multi-step form handling

Zod is integrated with the form to provide schema-based validation.

### Local UI State

React state is used for temporary interface state such as:

- Selected table rows
- Current form step
- Dialog state
- Bulk action state

This state does not need to be persisted globally.

### URL State

Product management state such as:

- Current page
- Search query
- Category
- Status
- Sort field
- Sort direction

is synchronized with URL search parameters.

For example:

```text
/products?page=2&search=phone&category=Electronics&status=active&sort=price&order=asc
```

This makes filtered views shareable and allows navigation state to survive browser navigation and page refreshes.

### Authentication State

Authentication is handled through Supabase Auth rather than maintaining a separate custom authentication state system.

---

## Rendering Strategy

Adminova uses a combination of server and client rendering based on the responsibility of each component.

### Server Components

Server-side functionality is used where access to authenticated server context is useful, including protected layouts and authorization checks.

Authentication can therefore be verified before protected content is rendered.

### Client Components

Interactive interfaces use client components where browser functionality and React hooks are required.

Examples include:

- Product tables
- Search and filters
- Pagination
- Sorting
- Dropdown menus
- Product forms
- Multi-step form navigation
- Selection controls
- Confirmation dialogs
- Interactive dashboard controls

### API Route Handlers

Database operations are performed through Next.js Route Handlers rather than directly exposing database operations throughout client components.

This provides a clear boundary:

```text
Client UI
   ↓
REST API
   ↓
Validation / Authorization
   ↓
Supabase
   ↓
PostgreSQL
```

This separation also allows server-side validation and authorization to occur before database mutations.

---

## Performance Decisions

Several decisions were made to avoid unnecessary client-side work and excessive data transfer.

### Server-Side Pagination

The product management table does not load the complete product dataset into the browser.

Instead, the client requests only the required page of data.

For example:

```text
page = 1
limit = 10
```

This approach remains significantly more efficient as the number of products increases.

### Server-Side Search, Filtering, and Sorting

Search, category filtering, status filtering, and sorting are processed by the API/database rather than loading every product and processing the dataset entirely in the browser.

This reduces:

- Browser memory usage
- Network payload size
- Client-side processing

### Query Caching

TanStack Query caches API responses using query keys based on the current table configuration.

Previously loaded data can therefore be reused when appropriate instead of unnecessarily requesting the same information repeatedly.

### Pagination Loading Experience

Previous query data can remain available while another page is being fetched, reducing unnecessary interface flickering during pagination.

### Image Handling

Next.js image functionality is used for product images where applicable, allowing the framework to provide optimized image rendering.

### Loading Skeletons

Skeleton states provide immediate visual feedback while asynchronous content is loading and improve perceived application performance.

### Production Performance Improvements

For a significantly larger dataset, additional performance work would include:

- PostgreSQL indexes for frequently searched and filtered columns
- Query execution analysis
- Cursor-based pagination for very large datasets
- More granular caching and revalidation strategies
- CDN caching for appropriate static assets
- Database connection monitoring and optimization

---

## API Handling

Adminova exposes REST endpoints using Next.js Route Handlers.

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

The products API supports:

- Pagination
- Search
- Category filtering
- Status filtering
- Sorting
- Product creation
- Product updates
- Product deletion
- Bulk operations

### Dashboard

```text
GET /api/dashboard
```

The dashboard endpoint returns aggregated product information used by KPI cards and visualizations.

### Current User

```text
GET /api/me
```

The current-user endpoint provides authenticated user information and the associated application role.

### Asynchronous Request Handling

TanStack Query manages the lifecycle of asynchronous API requests, including:

- Loading
- Success
- Error
- Caching
- Refetching
- Query invalidation

Mutations invalidate relevant product queries after successful changes so the interface remains synchronized with the server.

### Error Handling

API failures are handled by checking HTTP response status before treating a request as successful.

The interface provides appropriate feedback through:

- Error states
- Retry actions where applicable
- Toast notifications
- Form errors

### Validation

Product data is validated before being persisted.

Client-side validation provides immediate feedback to the user, while server-side validation prevents clients from bypassing validation by directly calling an API endpoint.

---

## Security Approach

Security is implemented at multiple layers rather than relying on the client interface alone.

### Authentication

Supabase Auth handles user authentication.

Protected sections verify that an authenticated user exists before allowing access.

### Role-Based Access Control

Adminova supports:

```text
admin
viewer
```

Restricted management controls are hidden from Viewer users.

However, hiding interface elements is not treated as a security boundary.

Write API endpoints also verify the authenticated user's role before allowing restricted operations.

This prevents a read-only user from bypassing the interface and manually sending unauthorized POST, PATCH, or DELETE requests.

### Database Security

Supabase Row Level Security provides an additional authorization layer at the database level.

The application therefore uses multiple layers:

```text
UI permissions
      ↓
API authorization
      ↓
Supabase RLS
      ↓
PostgreSQL
```

### Input Validation

User-controlled product data is validated before database operations.

Zod schemas provide consistent validation rules and help prevent malformed application data from reaching the database.

### Environment Variables

Supabase configuration is stored using environment variables rather than being hardcoded throughout the application.

Sensitive server-side secrets should never be exposed through variables prefixed with `NEXT_PUBLIC_`.

The `.env.local` file is excluded from source control.

---

## Scaling for a Larger Production Environment

The current architecture is appropriate for the scope of Adminova, but a larger production environment would introduce additional requirements.

### Database Scaling

As the product dataset grows, I would:

- Add and review indexes for frequently filtered and sorted columns
- Analyze slow database queries
- Monitor query execution plans
- Optimize database relationships
- Introduce cursor-based pagination where appropriate
- Monitor database connections and resource usage

### Application Scaling

The Next.js application can remain stateless where possible, allowing multiple application instances to serve requests.

Hosting platforms such as Vercel can scale the application layer horizontally as traffic increases.

### Caching

Caching strategies could be expanded based on how frequently individual datasets change.

For example:

- Frequently changing management data could use short-lived caching
- Less frequently changing analytics could use longer revalidation intervals
- Static assets could be distributed through a CDN

Cache invalidation would remain tied to mutations where consistency is required.

### Background Processing

Long-running work should not block normal API requests.

Tasks such as:

- Large imports
- Report generation
- Email notifications
- Data synchronization
- Expensive analytics processing

could be moved to background workers or job queues.

### Rate Limiting

Rate limiting could be introduced for sensitive or high-volume API endpoints to reduce abuse and protect backend resources.

### Observability

A larger production application would require structured observability, including:

- Centralized logging
- Error tracking
- Performance monitoring
- Database monitoring
- Request tracing
- Alerts for production failures

### Automated Testing

For a larger production environment, I would expand automated testing across multiple levels:

- Unit tests for validation and business logic
- Component tests for important UI behavior
- API integration tests
- Authentication and authorization tests
- End-to-end tests for critical user workflows

These tests would be executed automatically before deployment.

### CI/CD

A production CI/CD pipeline could run:

```text
Lint
  ↓
Type Check
  ↓
Automated Tests
  ↓
Production Build
  ↓
Deployment
```

This would prevent failing changes from reaching production.

### Backend Evolution

For the current scope, keeping the frontend and API in one Next.js application reduces deployment and development complexity.

If the application eventually developed significantly different scaling requirements, the backend could be separated into independent services where there is a concrete technical or organizational benefit.

I would avoid introducing microservices solely for the sake of using microservices because they introduce additional deployment, networking, monitoring, and data-consistency complexity.

---

## Advanced Form Handling

The product form uses a multi-step workflow to separate basic product information from inventory and status configuration.

Validation is performed using React Hook Form and Zod.

The form also supports conditional fields. For example, additional information can be requested when a product is placed into an inactive state.

### Draft Autosave

In-progress product form values are automatically stored locally.

If the user refreshes the page before submitting the form, the saved draft can be restored.

After successful submission, the stored draft is removed.

This reduces the risk of losing unfinished form data.

---

## Activity History

Product changes can generate activity records associated with the product.

These records are displayed as a timeline on the product details page, providing additional context about previous changes.

---

## Related Products

The product details page can display other products from the same category.

This demonstrates related-record handling while keeping the relationship appropriate to the product management domain.

---

## Tech Stack

### Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- Recharts

### Forms & Validation

- React Hook Form
- Zod

### Data & State

- TanStack Query

### Backend & Database

- Next.js Route Handlers
- REST API
- Supabase
- PostgreSQL
- Supabase Authentication
- Row Level Security

### Deployment

- Vercel
- Supabase

---

## Database Model

The application primarily uses the following data structures.

### Products

Products contain information such as:

- Name
- Description
- Category
- Price
- Stock
- Status
- Image URL
- Inactive reason
- Created timestamp
- Updated timestamp

### Product Activities

Activity records contain product history information associated with individual products.

### Profiles

Profiles associate Supabase authenticated users with application roles.

Supported roles:

```text
admin
viewer
```

---

## Getting Started

### Prerequisites

You will need:

- Node.js
- npm
- A Supabase project

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

Create a `.env.local` file in the project root.

Add the Supabase environment variables used by the application:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

> Replace the variable names above if your local implementation uses different Supabase environment variable names.

Never commit `.env.local` or private Supabase credentials to source control.

### Start Development

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

## Available Scripts

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Run the production build:

```bash
npm run start
```

Run ESLint:

```bash
npm run lint
```

---

## Deployment

Adminova is designed to be deployed using Vercel.

Deployment process:

1. Push the project to GitHub.
2. Import the GitHub repository into Vercel.
3. Configure the required Supabase environment variables in Vercel.
4. Deploy the application.
5. Verify authentication using both demo accounts.
6. Verify protected routes and role permissions.
7. Test direct navigation and page refreshes on dynamic routes.

---

## Future Improvements

Given additional development time, the next improvements would include:

- Automated unit, integration, and end-to-end testing
- Expanded accessibility testing
- Additional keyboard-navigation verification
- More comprehensive database indexing
- Rate limiting
- Structured production logging and monitoring
- CI/CD validation before deployment
- Additional analytics
- Audit logging for administrative operations

---

## Author

**Mohammad Hadi Elabed**

---

## Assessment

Adminova was developed as a technical assessment demonstrating full-stack frontend engineering, application architecture, state management, API integration, authentication, authorization, responsive UI development, and production-oriented design decisions.