const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const main = require('./config/db');
const cookieParser =  require('cookie-parser');
const authRouter = require("./routes/userAuth");
const redisClient = require('./config/redis');
const problemRouter = require("./routes/problemCreator");
const submitRouter = require("./routes/submit")
const aiRouter = require("./routes/aiChatting")
const videoRouter = require("./routes/videoCreator");
const cors = require('cors')

// console.log("Hello")

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
    credentials: true
}))

app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ ok: false, message: 'Database unavailable' });
    }
    res.json({ ok: true });
});

app.use((req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ message: 'Service unavailable. Database not connected.' });
    }
    next();
});

app.use('/user', authRouter);
app.use('/problem', problemRouter);
app.use('/submission',submitRouter);
app.use('/ai',aiRouter);
app.use("/video",videoRouter);


const PORT = process.env.PORT || 3000;

const InitalizeConnection = async () => {
    try {
        await main();
    } catch (err) {
        console.error("MongoDB connection failed:", err.message);
        console.log("Starting server anyway - API will return 503 until DB is available.");
    }

    redisClient.connect().catch((err) => {
        console.warn("Redis unavailable:", err.message, "- server running without token blacklist.");
    });

    app.listen(PORT, () => {
        console.log("Server listening at port " + PORT);
    });
};

InitalizeConnection();

