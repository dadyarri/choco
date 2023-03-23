FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443
ARG ENVIRONMENT
ENV ASPNETCORE_ENVIRONMENT=$ENVIRONMENT

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_19.x | bash - \
    && apt-get install -y \
        nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /src
COPY ["chocoAdmin.csproj", "chocoAdmin/"]
RUN dotnet restore "chocoAdmin/chocoAdmin.csproj"
WORKDIR "/src/chocoAdmin"
COPY . .
RUN dotnet build "chocoAdmin.csproj" -c $ENVIRONMENT -o /app/build

FROM build AS publish
RUN apt-get update && apt-get install -y libfreetype6 libfontconfig1
RUN dotnet publish "chocoAdmin.csproj" -c $ENVIRONMENT -o /app/publish

FROM base AS final
WORKDIR /app
ARG REACT_APP_HERE_TOKEN
ENV REACT_APP_HERE_TOKEN $REACT_APP_HERE_TOKEN
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "chocoAdmin.dll"]
