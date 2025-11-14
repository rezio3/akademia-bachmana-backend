import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import mongoose from "mongoose";
import placesRoutes from "./routes/places.js";
import personsRoutes from "./routes/persons.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/places", placesRoutes);
app.use("/api/persons", personsRoutes);

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
