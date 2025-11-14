import express, { Request, Response } from "express";
import { Audycja } from "../models/Audycja.js";

const router = express.Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const allDocs = await Audycja.find().lean();

    const reversed = allDocs.reverse();

    const totalCount = reversed.length;
    const totalPages = Math.ceil(totalCount / limit);

    const paginated = reversed.slice((page - 1) * limit, page * limit);

    res.json({
      audycje: paginated,
      totalPages,
    });
  } catch (error) {
    console.error("Błąd pobierania audycji:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

export default router;
