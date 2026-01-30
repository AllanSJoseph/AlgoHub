const mongoose = require('mongoose');

const LOCAL_MONGO_URI = 'mongodb://127.0.0.1:27017/algohub';

async function main() {
    const uri = process.env.DB_CONNECT_STRING || LOCAL_MONGO_URI;
    try {
        await mongoose.connect(uri);
        console.log('DB Connected to', uri.includes('localhost') || uri.includes('127.0.0.1') ? 'local MongoDB' : 'MongoDB Atlas');
    } catch (err) {
        const isAtlasUnreachable = uri !== LOCAL_MONGO_URI &&
            (err.code === 'ENOTFOUND' || /ENOTFOUND|querySrv|getaddrinfo/.test(err.message || ''));
        if (isAtlasUnreachable) {
            console.warn('Atlas unreachable:', err.message);
            console.warn('Trying local MongoDB at', LOCAL_MONGO_URI);
            await mongoose.connect(LOCAL_MONGO_URI);
            console.log('DB Connected to local MongoDB');
        } else {
            throw err;
        }
    }
}

module.exports = main;


