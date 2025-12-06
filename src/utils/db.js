import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function connect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(process.env.MONGODB_URI, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000, 
            family: 4, 
        }).then((mongoose) => {
            return mongoose;
        });
    }
    
    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw error; 
    }

    return cached.conn;
}