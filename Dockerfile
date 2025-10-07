FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5062

# Copy the release build from bin/release
COPY bin/release/ .

# Set environment variables
ENV ASPNETCORE_URLS=http://+:5062
ENV ASPNETCORE_ENVIRONMENT=Development

ENTRYPOINT ["dotnet", "RisagerBackend.dll"]
