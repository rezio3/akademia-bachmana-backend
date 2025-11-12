import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`✅ Połączono z MongoDB: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Błąd połączenia z MongoDB:", error);
    process.exit(1);
  }
};
