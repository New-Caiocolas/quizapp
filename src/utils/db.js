import mongoose from "mongoose";

export default async function Connect() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Conectado ao MongoDB");    
    } catch (error) {
        console.error("Erro ao conectar ao MongoDB:", error);
    }
}