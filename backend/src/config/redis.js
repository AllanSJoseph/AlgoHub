const { createClient }  = require('redis');

const redisClient= createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
     socket: {
        host: 'redis-14633.c17.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 14633
    }
});
module.exports=redisClient