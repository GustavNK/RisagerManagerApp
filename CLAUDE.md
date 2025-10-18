# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack family property booking system for "Risager Plantage" (Danish forest retreat) built as a monorepo with:
- **Frontend**: Next.js 15 + React 19 + TypeScript + TailwindCSS (port 3000)
- **Backend**: .NET 8 Web API + Entity Framework + ASP.NET Core Identity (port 5062)
- **Database**: PostgreSQL (Docker container or Azure SQL for legacy deployments)
- **Storage**: MinIO (Docker S3-compatible) or Azure Blob Storage for file attachments

## Development Commands

### Frontend Development
```bash
npm install                    # Install dependencies
npm run dev                    # Start development server on localhost:3000. Do not start it yourself, let the user start the server
npm run dev -- --port 3000   # Force port 3000 if needed
npm run build                 # Build for production (static export)
npm run lint                  # Run ESLint
```

### Backend Development
```bash
cd RisagerBackend
dotnet restore                # Install dependencies
dotnet run                    # Start backend on localhost:5062. If the port is occupied, assume the banckend is running. Let the user close the backend to update it
dotnet build                  # Build backend
dotnet ef migrations add <name>    # Add new migration
dotnet ef database update     # Apply migrations to database
```

### Docker Development
```bash
docker compose up -d          # Start PostgreSQL, MinIO, and app containers
docker compose down           # Stop all containers
npm run docker:clean          # Remove all Docker images, containers, and volumes
npm run docker:rebuild        # Clean and rebuild all containers
npm run docker:deploy         # Deploy using docker-deploy.js script
```

### Azure Deployment (Legacy)
```bash
npm run build-release         # Build both frontend and backend, package for Azure
npm run deploy-release        # Deploy to Azure App Service
npm run release              # Combined build and deploy
```

## Architecture Overview

### Deployment Strategies

**Development (Docker)**: Local containers for PostgreSQL and MinIO, with separate frontend (localhost:3000) and backend (localhost:5062) servers

**Production (Azure - Legacy)**: Single-endpoint deployment where the .NET backend serves both API endpoints AND the Next.js frontend as static files from one Azure App Service

**Future Docker Production**: Can be containerized with Docker Compose orchestrating frontend, backend, PostgreSQL, and MinIO services

### Key Configuration Files
- **`docker-compose.yml`**: Orchestrates PostgreSQL and MinIO containers for local development
- **`src/lib/api.ts`**: Handles environment-specific API URL routing (localhost:5062 in dev, relative URLs in prod)
- **`next.config.js`**: Configures static export for production (only when `BUILD_MODE=export`)
- **`scripts/build-release.js`**: Custom build script that combines frontend and backend deployments for Azure
- **`RisagerBackend/Program.cs`**: Backend configuration including CORS, Identity, PostgreSQL, and static file serving
- **`RisagerBackend/appsettings.json`**: Database and storage connection strings

### Database Architecture
- **Provider**: PostgreSQL with Npgsql Entity Framework provider (migrated from Azure SQL)
- **Development**: Docker container (postgres:latest) on localhost:5432
- **Credentials**: postgres/postgres/risager (user/password/database)
- **Authentication**: ASP.NET Core Identity with custom User entity
- **Key Entities**: User, Property, Booking, Payment, Post, InvitationCode
- **Migrations**: Located in `RisagerBackend/Migrations/`

### Storage Architecture
- **Development**: MinIO S3-compatible storage in Docker (localhost:9000 API, localhost:9001 console)
- **Production**: Azure Blob Storage (legacy) or MinIO
- **Service**: `IBlobStorageService` abstracts file operations (upload, download, delete, get URL)
- **Container**: Files stored in "risager" container/bucket

### API Endpoints Structure
The backend uses ASP.NET Core Controllers with attribute routing:
- **`Controllers/UserController.cs`**: Authentication, registration, invitation codes
- **`Controllers/BookingController.cs`**: Property bookings with conflict detection
- **`Controllers/PropertyController.cs`**: Property management
- **`Controllers/PaymentController.cs`**: Payment tracking
- **`Controllers/PostController.cs`**: Community posts with file attachments

### Authentication System
- **Invitation-based registration**: Users need invitation codes to register (family-only access)
- **Cookie-based authentication**: No JWT tokens, uses ASP.NET Core Identity cookies
- **Client-side state**: User info stored in localStorage (check for `currentUser`)
- **API authentication**: Returns 401/403 JSON responses instead of redirects

### Business Logic Highlights
- **Booking conflicts**: Automatic detection of overlapping bookings for same property
- **Pricing**: Fixed 30 DKK per person per night
- **Properties**: Currently "Røde Hus" and "Søhuset"
- **File attachments**: Posts can have files stored in MinIO (dev) or Azure Blob Storage (prod)
- **Invitation codes**: 7-day expiry, single-use, generated by existing users
- **Payment tracking**: No actual payment processing, serves as reminder system for family members

## Important Development Notes

### Frontend (Next.js)
- Uses App Router with TypeScript
- All pages are client components ("use client")
- Danish language interface throughout
- API calls use `getApiUrl()` utility for environment-aware URLs
- TailwindCSS with green forest theme

### Backend (.NET)
- Entity Framework with code-first migrations
- CORS configured for localhost:3000 in development
- Swagger/OpenAPI available at `/swagger` in development
- Static file serving from `wwwroot/` for production frontend
- Fallback route to `index.html` for client-side routing
- Admin user seeding on startup via `DbSeeder.SeedAdminUser()`
- Password requirements relaxed for development (min 3 chars, no complexity requirements)

### Database Operations
- All database access through `ApplicationDbContext` (extends `IdentityDbContext<User>`)
- Connection string in `appsettings.json` with key `DefaultConnection`
- Uses Npgsql provider for PostgreSQL
- Migrations should be tested locally against Docker PostgreSQL before deploying

### Docker Infrastructure
- **PostgreSQL**: Port 5432, persistent volume `postgres-data`
- **MinIO**: Ports 9000 (API) and 9001 (console), persistent volume `minio-data`
- **App Container**: Port 5062, runs the .NET backend with Dockerfile
- **Network**: All containers communicate via `risager-network` bridge
- **Docker cleanup**: Use `npm run docker:clean` to prevent disk space issues from old images
- MinIO credentials: minioadmin/minioadmin (default)
- PostgreSQL credentials injected via environment variables in docker-compose.yml

### Common Issues
- **RSC Payload Errors**: If navigation fails, check that `next.config.js` doesn't enable static export in development
- **CORS Issues**: Backend CORS is configured for localhost:3000, ensure frontend runs on correct port
- **Port Conflicts**: Use `npm run dev -- --port 3000` to force frontend to port 3000
- **Database Connection**: Ensure PostgreSQL container is running (`docker compose up -d`) before starting backend
- **MinIO Setup**: After first start, create "risager" bucket via console (localhost:9001) for file uploads to work
- **Docker Disk Space**: Old images can fill disk; use `npm run docker:clean` regularly

### File Structure Notes
- Frontend pages: `src/app/*/page.tsx` (login, booking, bookings, feed, profile, users)
- API utility: `src/lib/api.ts` (environment-aware URL routing)
- API client: `src/lib/api-client/client.ts` (auto-generated from swagger.json)
- Backend controllers: `RisagerBackend/Controllers/*Controller.cs` (attribute-routed controllers)
- Database context: `RisagerBackend/Data/ApplicationDbContext.cs`
- Database models: `RisagerBackend/Models/Entities/` and `RisagerBackend/Models/Dtos.cs`
- Storage service: `RisagerBackend/Services/BlobStorageService.cs` (Azure Blob Storage client)
- Database seeding: `RisagerBackend/Data/DbSeeder.cs` (admin user initialization)
- Build artifacts: `bin/` directory (excluded from git)
- Release package: `bin/risager-app-release.zip` for Azure deployment
- Swagger schema: `swagger.json` (auto-generated during backend build)