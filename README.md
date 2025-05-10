# Valhalla Brush

![Next.js](https://img.shields.io/badge/Next.js-%23000000.svg?style=for-the-badge\&logo=nextdotjs\&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge\&logo=typescript\&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-%2338B2AC.svg?style=for-the-badge\&logo=tailwind-css\&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-%234365A6.svg?style=for-the-badge\&logo=prisma\&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%23336791.svg?style=for-the-badge\&logo=postgresql\&logoColor=white)
![Turborepo](https://img.shields.io/badge/Turborepo-%234F43E6.svg?style=for-the-badge\&logo=turborepo\&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-%23009639.svg?style=for-the-badge\&logo=nginx\&logoColor=white)
![DevOps](https://img.shields.io/badge/DevOps-%23F05032.svg?style=for-the-badge\&logo=azuredevops\&logoColor=white)

---

## 🚀 Overview

**Valhalla Brush** is a real-time, multiplayer canvas application where users can:

* 🔗 Create or join drawing **rooms**
* ✍️ Collaboratively sketch, write, and visualize ideas
* 🔄 Share live canvas updates with all participants

This is an early-stage project; many features (e.g., authentication, advanced tools, session recording) will be added soon.

---

## ✨ Features

* **Room Management**

  * Create new canvas rooms
  * Join existing rooms via unique URLs

* **Live Collaboration**

  * Real-time drawing and writing sync
  * Multi-user cursors and color indicators

* **Share & Persist**

  * Share room links instantly
  * Canvas state persisted in PostgreSQL

---

## 🛠 Tech Stack

| Layer                   | Technology                                     |
| ----------------------- | ---------------------------------------------- |
| **Frontend**            | Next.js, TypeScript                            |
| **Styling**             | Tailwind CSS                                   |
| **Backend**             | Next.js API routes                             |
| **Database & ORM**      | PostgreSQL, Prisma                             |
| **Monorepo**            | Turborepo                                      |
| **Deployment & DevOps** | Nginx (reverse proxy), Docker, CI/CD pipelines |

---

## 📦 Installation & Setup

1. **Clone the Repo**

   ```bash
   git clone https://github.com/your-org/valhalla-brush.git
   cd valhalla-brush
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/valhalla"
   NEXT_PUBLIC_WS_URL="wss://your-domain.com/socket"
   ```

4. **Database Migrations**

   ```bash
   npx prisma migrate dev --name init
   ```

5. **Run Locally**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

---

## ☁️ Deployment

1. **Build**

   ```bash
   npm run build
   ```

2. **Dockerise**

   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY . .
   RUN npm ci && npm run build
   CMD ["npm", "start"]
   ```

3. **Reverse Proxy (Nginx)**

   ```nginx
   server {
     listen       80;
     server_name  your-domain.com;
     
     location / {
       proxy_pass         http://app:3000;
       proxy_http_version 1.1;
       proxy_set_header   Upgrade $http_upgrade;
       proxy_set_header   Connection 'upgrade';
       proxy_set_header   Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

4. **CI/CD**

   * Build & push Docker image
   * Deploy to your Kubernetes/VM cluster
   * Automate DB migrations

---

## 📈 Roadmap

* [ ] User authentication & profiles
* [ ] Colour picker & brush settings
* [ ] Undo/redo functionality
* [ ] Session recording & playback
* [ ] Export canvas as image/PDF

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/name`)
3. Commit your changes (`git commit -m "feat: add new feature"`)
4. Push to branch (`git push origin feature/name`)
5. Open a Pull Request

Please follow the [Code of Conduct](./CODE_OF_CONDUCT.md) and ensure all tests pass.

---

## 📜 License

Distributed under the MIT License. See [LICENSE](./LICENSE) for details.
