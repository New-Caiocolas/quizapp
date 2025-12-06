// src/utils/db.js (Solução de Caching Global)
import mongoose from "mongoose";

// Use uma variável global para armazenar a conexão
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function connect() {
    // 1. Reutilizar conexão existente
    if (cached.conn) {
        return cached.conn;
    }

    // 2. Se não houver promessa de conexão, crie uma nova
    if (!cached.promise) {
        cached.promise = mongoose.connect(process.env.MONGODB_URI, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000, 
            family: 4, // Opção de estabilidade para alguns ambientes
        }).then((mongoose) => {
            return mongoose;
        });
    }
    
    // 3. Aguarda e armazena a nova conexão
    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null; // Limpa a promessa em caso de falha
        throw error; 
    }

    return cached.conn;
}