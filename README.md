# 🧠 AlgoHub – Full-Stack Online Coding Platform

AlgoHub is a scalable, containerized coding platform inspired by modern competitive programming systems. It enables users to solve problems, run code in multiple languages, and view results in real time using a **self-hosted Judge0 environment**.

Built with a **React + Node.js + MongoDB + Redis + Docker** architecture, the system is designed for modularity, performance, and production readiness.

---

# 🚀 Features

* 🔐 JWT-based Authentication & Authorization
* 💻 Multi-language Code Execution (C++, Java, JavaScript, Python)
* ⚡ Real-time Code Submission & Evaluation via Judge0
* 📚 Problem Management (Create, View, Solve)
* 🧠 Output Validation (Custom Testcases + Expected Output)
* 🚀 Redis Caching for performance optimization
* 🤖️ AI Assistance for Problem Creation and Hinting System (Gemini API)
* 🤖️ AI Assisted Roadmap Generation (Gemini API)
* 📜️ Problem Recommender (For You Section)
* 📊️ User Analytics
* 🎥 Video Solution Integration for learning resources
* 🐳 Fully Dockerized (Frontend + Backend + Judge0 + Redis)
* 📦 Scalable Microservice-friendly Architecture

---

# 🏗️ Architecture Overview

```
Frontend (React)
        ↓
Backend (Express API)
        ↓
Judge0 (Code Execution Engine)
        ↓
Redis (Queue + Cache)
        ↓
MongoDB (Database)
```

---

# 🛠️ Tech Stack

### Frontend

* React (Vite)

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Code Execution

* Self-hosted Judge0 (Docker)

### Caching

* Redis (App + Judge0)

### DevOps

* Docker & Docker Compose

---

# 📂 Project Structure

```
AlgoHub/
├── frontend/              # React (Vite) app
│   ├── src/
│   ├── Dockerfile
├── backend/               # Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── utils/
│   │   └── middleware/
│   │   └── .env
│   │   └── .env.production
│   │   └── Dockerfile
├── database/              # Some Database Sample Data and Import files 
├── docker-compose.yml     # Multi-service orchestration
├── .docker-entrypoint.sh
├── .dockerignore
├── .judge0.conf
└── README.md
```

---

# 🖥️ Project Setup
## 🔐 Environment Setup

### Backend Environment Variables (`backend/.env.production`)

> For setup without docker edit (`backend/.env`) file

```
# Server Config
PORT=express_js_port_number

# MongoDB Server Config
DB_CONNECT_STRING=your_mongodb_connection_string

# JWT Secret Key
JWT_KEY=your_jwt_secret_key

# Judge0 Config
JUDGE0_URL=your_judge0_url

# Redis Config
REDIS_USERNAME=your_redis_username
REDIS_HOST=your_redis_hostname
REDIS_PASS=your_redis_password
REDIS_PORT=your_redis_port_no

# Google Gemini Config
GEMINI_KEY=your_gemini_api_key

# Cloudinary Config
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### JWT Setup

For getting a JWT secret key use the below methods

#### 🔹 1: Using OpenSSL (Linux / macOS)

```bash
openssl rand -hex 32
```

Example output:

```text
a3f9c2e1b4d8f6c7e9a1b2c3d4e5f67890abcdef1234567890abcdef12345678
```

---

#### 🔹 2: Using Node.js

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```


#### 📌 Usage

Add the generated value to the env file:

```env
JWT_SECRET=your_generated_secret_here
```

### Judge0 Config

> This is a config setup sourced from official judge0 docs, important setup files are copied from official [Judge0 Repository](https://github.com/judge0/judge0). The below setup instructions are based on instructions provied from [here](https://github.com/judge0/judge0/blob/master/CHANGELOG.md#deployment-procedure).

**OS Setup**

It is recommended to use Ubuntu 22.04, on which some changes to GRUB is needed:

1. Use `sudo` to open file `/etc/default/grub`
2. Add `systemd.unified_cgroup_hierarchy=0` in the value of `GRUB_CMDLINE_LINUX` variable.
3. Apply the changes: `sudo update-grub`
4. Restart your server: `sudo reboot`

**Configuring Redis and PostgreSQL for Judge0 Environment**

1. Open: [Random.org](https://www.random.org/passwords/?num=1&len=32&format=plain&rnd=new) to generate a secret password.
2. Open `judge0.conf` and update the variable `REDIS_PASSWORD` field with the generated password from step 1
3. Open [Random.org](https://www.random.org/passwords/?num=1&len=32&format=plain&rnd=new) again to generate another password.
4. Update variable `POSTGRES_PASSWORD` in `judge0.conf` with this value.

Or you can cut the hassle and use their cloud API 😁️.

## Setting Up MongoDB Database (Primary DB)

> We faced some issues with running MongoDB locally and on docker in our setup, so we used MongoDB Cloud for this project for the timebeing.

1. Create a new cluster on MongoDB Atlas and open it on MongoDB Compass
2. Create a Database AlgoHub
3. Create a collection users
4. Import `AlgoHub.users.json` from database folder to create and add an admin user. 
5. Get the connection string and add it to the `DB_CONNECT_STRING` field in the environment

Note: Make sure connection string is in correct format ensure the database name is correct as you have created:

```
mongodb+srv://<db_username>:<db_password>@cluster0.yuqvmko.mongodb.net/AlgoHub
```

When you login to AlgoHub you can login as this admin user with the credentials:

Email:
```
admin@algohub.com
```
Password:
```
Admin@123
```
---

## 🐳 Docker Setup (Recommended)

> This is the **preferred way** to run the project.

> **⚠️ Note**: It is recommended to use Linux (Ubuntu 20.04 of 22.04) to run this project if you are setting up via docker which includes self-hosted judge0 environment.

### 1️⃣ Clone repository

```
git clone https://github.com/your-username/AlgoHub.git
cd AlgoHub
```

---

### 2️⃣ Start all services

```
docker compose up
```

---

### 3️⃣ Services

| Service     | URL                   |
| ----------- | --------------------- |
| Frontend    | http://localhost:5000 |
| Backend API | http://localhost:3000 |
| Judge0      | http://localhost:2358 |

---

### 4️⃣ Stop services

```
docker compose down
```

---

## ⚙️ Manual Setup (Without Docker)

> You can also use Judge0 cloud api version too.

### Backend

```
cd backend
npm install
npm run dev
```

### Frontend

```
cd frontend
npm install
npm run dev
```

---

# 🧪 Example Workflow

1. User submits code
2. Backend sends request to Judge0
3. Judge0 executes code in a sandbox
4. Backend polls for result
5. Output is decoded & validated
6. Response sent to frontend

---

# ⚠️ Important Notes

* Always use `base64_encoded=true` for Judge0 requests
* Decode outputs (`stdout`, `stderr`, `compile_output`)
* Ensure Docker volumes are configured for persistence

---

# 👥 Contributors

| Name                                                   | Role                                       |
| ------------------------------------------------------ | ------------------------------------------ |
| [Abishek Kumar](https://github.com/abhisheksingg-5351) | Initial Project Setup and Design           |
| [Allan S Joseph](https://github.com/AllanSJoseph)      | Backend Development and Docker Integration |
| [Rajnish Kumar](https://github.com/Rajnishtheone)      | Frontend Development                       |
| [Om Kumar](https://github.com/omku415)                 | API Integration                            |
| [Midhun MS](https://github.com/Midhun-M-S5694)         | Auth Setup and Documentation               |


---

# 📚 References

* Judge0 Documentation
* Docker Documentation
* Redis Documentation
* MongoDB Documentation
* Express.js Documentation
* React Documentation

---

# 📦 Deployment Notes

* Images are available on Docker Hub
* Use `docker-compose.yml` for orchestration
* Environment variables should be injected at runtime

## Docker Image Repositories:
**Frontend:** [allansjoseph/frontend](https://hub.docker.com/r/allansjoseph/algohub-frontend)

**Backend:** [allansjoseph/backend](https://hub.docker.com/r/allansjoseph/algohub-backend)

---

# 🧠 Future Improvements

* Code editor enhancements (Monaco)
* Testcase batching & scoring system
* Analytics
* Contest mode (Leaderboards and Streak Systems)
* WebSocket-based real-time execution

---

# ⭐ Acknowledgment

If you found this project useful, consider giving it a ⭐ on GitHub!
