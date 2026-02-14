# 🧠 AlgoHub – Online Coding Platform

AlgoHub is a full-stack AlgoHub-style coding platform built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js). It supports **multi-language code execution** using the **Judge0 API**, features **JWT authentication**, **Redis caching**, and includes **video integration** for enhanced learning.

---

## 🚀 Features

- JWT-based User Authentication  
- Judge0 API Integration (C/C++, Java, javascript.)  
- Code Submission & Output Validation  
- Problem Listing & Detail View  
- Redis Caching for Fast Response  
- Video Learning Integration  
- Scalable Backend Architecture

---

## 🛠️ Tech Stack

- Frontend: React.js  
- Backend: Node.js, Express.js  
- Database: MongoDB  
- Code Execution: Judge0 API  
- Caching: Redis  
- Auth: JWT  

---

## 📂 Folder Structure

AlgoHub/
├── client/ # React frontend
├── server/ # Node.js backend
│ ├── routes/
│ ├── controllers/
│ ├── models/
│ └── middleware/
├── .env
└── README.md

---

## 🔐 Environment Variables

Create a `.env` file in your `server` folder with the following:

```env
PORT=3000
DB_CONNECT_STRING=your_mongodb_connection_string
JWT_KEY=your_jwt_secret
REDIS_PASS=your_redis_password
JUDGE0_KEY=your_judge0_api_key
GEMINI_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret


🧪 Setup Instructions
# Clone repository
git clone https://github.com/your-username/AlgoHub.git
cd AlgoHub

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Run backend
cd ../server
npm run dev

# Run frontend
cd ../client
npm start


