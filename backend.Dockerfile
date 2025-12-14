# =============================================================================
# Stage 1: Build
# =============================================================================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project file and restore dependencies
COPY RisagerBackend/RisagerBackend.csproj ./RisagerBackend/
RUN dotnet restore ./RisagerBackend/RisagerBackend.csproj

# Copy remaining source
COPY RisagerBackend/ ./RisagerBackend/

# Build and publish
WORKDIR /src/RisagerBackend
RUN dotnet publish -c Release -o /app/publish --no-restore

# =============================================================================
# Stage 2: Production Runtime
# =============================================================================
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS runtime
WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -g 1001 dotnet && adduser -u 1001 -G dotnet -s /bin/sh -D dotnet

# Copy published application
COPY --from=build /app/publish .

# Set correct permissions
RUN chown -R dotnet:dotnet /app
USER dotnet

# Expose port
EXPOSE 5062

# Set environment variables
ENV ASPNETCORE_URLS=http://+:5062
ENV ASPNETCORE_ENVIRONMENT=Production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:5062/api/health || exit 1

# Start the application
ENTRYPOINT ["dotnet", "RisagerBackend.dll"]
