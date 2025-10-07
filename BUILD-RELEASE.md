# Build Release Guide

## Overview
The `build-release` npm script creates a production-ready deployment package for Azure App Service.

## Usage
```bash
npm run build-release
```

## What it does

1. **Cleans previous builds** - Removes old build artifacts
2. **Builds frontend for production** - Creates optimized Next.js static export
3. **Builds backend for release** - Compiles ASP.NET Core application
4. **Integrates frontend and backend** - Copies frontend files to backend wwwroot
5. **Creates deployment package** - Generates a zip file ready for Azure

## Output

The script creates:
- `bin/release/` - Complete application ready to run
- `bin/risager-app-release.zip` - Deployment package for Azure App Service

## Deployment to Azure

1. Upload `bin/risager-app-release.zip` to Azure App Service
2. The application will serve both the API endpoints and the React frontend from a single endpoint
3. Configure your connection strings in Azure App Service settings

## Application Structure

The deployed application includes:
- **ASP.NET Core backend** - Handles API requests and serves static files
- **React frontend** - Static files in wwwroot/ served by ASP.NET Core
- **Single endpoint** - Both frontend and API accessible from the same URL

## Requirements

- Node.js and npm
- .NET 8 SDK
- All dependencies installed (`npm install`)

## Configuration

The backend is configured to:
- Serve static files from wwwroot/
- Handle client-side routing with fallback to index.html
- Process API requests under /api/ routes