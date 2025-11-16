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

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      place,
      locationId,
      startDate,
      endDate,
      leader,
      musician,
      status,
      price,
      paymentMethod,
      description,
    } = req.body;

    if (!place || !place.name || !place._id) {
      res
        .status(400)
        .json({ message: "Pole 'place' (name i _id) jest wymagane" });
      return;
    }

    if (!locationId) {
      res.status(400).json({ message: "Pole 'locationId' jest wymagane" });
      return;
    }

    if (!startDate) {
      res.status(400).json({ message: "Pole 'startDate' jest wymagane" });
      return;
    }

    if (!endDate) {
      res.status(400).json({ message: "Pole 'endDate' jest wymagane" });
      return;
    }

    if (status === undefined || status === null) {
      res.status(400).json({ message: "Pole 'status' jest wymagane" });
      return;
    }

    const newAudycja = new Audycja({
      place,
      locationId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      leader: leader || undefined,
      musician: musician || undefined,
      status,
      price: price || undefined,
      paymentMethod: paymentMethod || undefined,
      description: description || undefined,
    });

    const savedAudycja = await newAudycja.save();

    res.status(201).json({
      message: "Audycja została dodana pomyślnie",
      audycja: savedAudycja,
    });
  } catch (error) {
    console.error("Błąd podczas dodawania audycji:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

export default router;
