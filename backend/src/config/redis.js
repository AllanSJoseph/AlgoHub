const { createClient }  = require('redis');

const redisClient= createClient({
    username: process.env.REDIS_USERNAME || 'default',
    password: process.env.REDIS_PASS,
     socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379
    }
});
module.exports=redisClient