FROM node:22-alpine

RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy only monorepo config + lockfile for install context
COPY pnpm-workspace.yaml turbo.json package.json pnpm-lock.yaml* ./

# Install root deps to enable workspace resolution
RUN pnpm install

# Copy everything
COPY . .
ENV DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/postgres"

RUN pnpm run prebuild

EXPOSE 3000 8000 8080

CMD [ "pnpm" ,"run","dev" ]