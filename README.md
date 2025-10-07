# Risager Plantage Booking System

A full-stack family property booking system for "Risager Plantage" - a Danish forest retreat. Built as a monorepo with invitation-based access for family members to book properties, share updates, and track payments.

## Tech Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript + TailwindCSS
- **Backend**: .NET 8 Web API + Entity Framework + ASP.NET Core Identity
- **Database**: PostgreSQL (Docker container)
- **Storage**: MinIO (Docker S3-compatible) for file attachments
- **Deployment**: Docker Compose (development) or Azure App Service (legacy production)

## Quick Start

### Prerequisites
- Node.js 18+
- .NET 8 SDK
- Docker and Docker Compose

### Development Setup

1. **Start infrastructure services**:
```bash
docker compose up -d
```
This starts PostgreSQL (port 5432) and MinIO (ports 9000/9001).

2. **Create MinIO bucket** (first time only):
   - Open MinIO console at [http://localhost:9001](http://localhost:9001)
   - Login with `minioadmin` / `minioadmin`
   - Create a bucket named `risager`

3. **Start backend**:
```bash
cd RisagerBackend
dotnet restore
dotnet run
```
Backend runs on [http://localhost:5062](http://localhost:5062)

4. **Start frontend**:
```bash
npm install
npm run dev
```
Frontend runs on [http://localhost:3000](http://localhost:3000)

## Key Features

- **Invitation-based registration**: Family-only access via invitation codes
- **Property booking**: Book "Røde Hus" or "Søhuset" with automatic conflict detection
- **Community feed**: Share posts and files with family members
- **Payment tracking**: Track who owes what (30 DKK per person per night)
- **User management**: Admin can create invitation codes for new family members

## Development Commands

### Frontend
```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Build for production
npm run lint         # Run ESLint
```

### Backend
```bash
cd RisagerBackend
dotnet run           # Start backend (port 5062)
dotnet build         # Build backend
dotnet ef migrations add <name>     # Create migration
dotnet ef database update           # Apply migrations
```

### Docker
```bash
docker compose up -d              # Start PostgreSQL + MinIO
docker compose down               # Stop containers
npm run docker:clean              # Clean all Docker resources
npm run docker:rebuild            # Rebuild containers
```

### Deployment
```bash
npm run build-release     # Package for Azure deployment
npm run deploy-release    # Deploy to Azure App Service
npm run release          # Build + deploy combined
```

## Project Structure

```
RisagerManagingApp/
├── src/                          # Next.js frontend
│   ├── app/                      # App router pages
│   │   ├── booking/             # Create new booking
│   │   ├── bookings/            # View all bookings
│   │   ├── feed/                # Community posts
│   │   ├── profile/             # User profile
│   │   └── users/               # User management (admin)
│   └── lib/
│       ├── api.ts               # API URL utility
│       └── api-client/          # Auto-generated API client
├── RisagerBackend/              # .NET Web API
│   ├── Controllers/             # API endpoints
│   ├── Models/                  # Entities and DTOs
│   ├── Data/                    # DbContext and seeding
│   ├── Services/                # Business logic
│   └── Migrations/              # EF migrations
├── docker-compose.yml           # PostgreSQL + MinIO
└── CLAUDE.md                    # Detailed development guide
```

## Database

- **Provider**: PostgreSQL with Npgsql
- **Dev credentials**: postgres / postgres / risager
- **Models**: User, Property, Booking, Payment, Post, InvitationCode
- **Authentication**: ASP.NET Core Identity with cookie-based auth

## Storage

- **Development**: MinIO (S3-compatible) at localhost:9000
- **Production**: Azure Blob Storage (legacy)
- **Container**: Files stored in "risager" bucket

## Common Issues

- **Port conflicts**: Use `npm run dev -- --port 3000` to force port 3000
- **CORS errors**: Ensure frontend runs on port 3000 and backend on 5062
- **Database connection**: Start PostgreSQL container before backend
- **File uploads fail**: Create "risager" bucket in MinIO console
- **Docker disk space**: Run `npm run docker:clean` regularly

## API Documentation

Swagger documentation available at [http://localhost:5062/swagger](http://localhost:5062/swagger) when running in development mode.

## License

Private family project - not licensed for public use.
