

# Contribution Guide – Valhalla Brush

Thank you for your interest in contributing to **Valhalla Brush**!
This guide explains how to set up the project locally so you can start contributing.

---

## **Prerequisites**

* [Node.js](https://nodejs.org/) (v18+ recommended)
* [pnpm](https://pnpm.io/) (if using Approach 1)
* [Docker](https://www.docker.com/) (if using Approach 2)
* [PostgreSQL](https://www.postgresql.org/) (if not using Docker)
* [Prisma CLI](https://www.prisma.io/docs/reference/api-reference/command-reference)

---

## **Approach 1 – Local Installation with pnpm**

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   ```
2. **Navigate into the project folder**

   ```bash
   cd valhalla-brush
   ```
3. **Install pnpm globally**

   ```bash
   npm install -g pnpm
   ```
4. **Add environment variables for the database**
   Create a `.env` file inside `packages/db/` and include:

   ```env
   DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<dbname>"
   ```
5. **Install dependencies**

   ```bash
   pnpm install
   ```
6. **Run database migrations**

   ```bash
   cd packages/db
   npx prisma migrate dev
   npx prisma generate
   cd ../..
   ```
7. **Start the project**

   ```bash
   pnpm run dev
   ```

   Your project should now be up and running.

---

## **Approach 2 – Docker-Based Setup**

1. **Install Docker**
   [Download and install Docker](https://www.docker.com/get-started)
2. **Clone the repository**

   ```bash
   git clone <repo-url>
   ```
3. **Navigate into the project folder**

   ```bash
   cd valhalla-brush
   ```
4. **Start services using Docker Compose**

   ```bash
   docker compose up
   ```
5. **Add environment variables**
   Inside `packages/db/.env`, include:

   ```env
   DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/postgres"
   ```
6. **Run database migrations**

   ```bash
   cd packages/db
   npx prisma migrate dev
   ```
7. **Your project is ready!**

---

## **Contributing**

* Create a feature branch before starting changes.
* Follow the existing code style and naming conventions.
* Test your changes locally before creating a pull request.
* Use descriptive commit messages.
* Submit a pull request to the `main` branch with a clear description of your changes.

