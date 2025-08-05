FROM node:20-slim AS base

# Update and install dependencies in a single layer
RUN apt-get update -y && \
    apt-get install -y openssl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    npm install -g pnpm

WORKDIR /app

# Copy dependency files first for better Docker layer caching
COPY package.json pnpm-lock.yaml turbo.json pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY ./packages ./packages
COPY ./apps/ws-backend ./apps/ws-backend

# Run prebuild
RUN pnpm run prebuild

# Expose WebSocket port
EXPOSE 8080

# Start the websocket app
CMD ["pnpm", "run", "start:websocket"]