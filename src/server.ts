import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import mongoose from "mongoose";
import placowkiRoutes from "./routes/placowki.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/placowki", placowkiRoutes);

app.use("/api/auth", authRoutes);

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("❌ Brak MONGO_URI w pliku .env!");
}

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("✅ Połączono z MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server działa na porcie ${PORT}`));
  })
  .catch((err) => console.error("❌ Błąd połączenia z MongoDB:", err));
