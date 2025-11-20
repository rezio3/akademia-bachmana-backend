import express, { Request, Response } from "express";
import { Audycja } from "../models/Audycja.js";

const router = express.Router();

router.get("/current", async (req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();

    const currentAudycje = await Audycja.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
    })
      .populate("place")
      .populate("leader")
      .populate("musician")
      .lean();

    const reversed = currentAudycje.reverse();

    res.json({
      audycje: reversed,
    });
  } catch (error) {
    console.error("Błąd pobierania aktualnych audycji:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

export default router;
