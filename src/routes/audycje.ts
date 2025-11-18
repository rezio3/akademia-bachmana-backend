import express, { Request, Response } from "express";
import { Audycja } from "../models/Audycja.js";
import { Place } from "../models/Place.js";

const router = express.Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const locationId = req.query.location
      ? parseInt(req.query.location as string)
      : null;

    const month = req.query.month ? parseInt(req.query.month as string) : null;
    const year = req.query.year ? parseInt(req.query.year as string) : null;
    const filter: any = {};
    if (locationId !== null) {
      filter.locationId = locationId;
    }

    if (month !== null || year !== null) {
      filter.$expr = { $and: [] };

      if (month !== null) {
        filter.$expr.$and.push({ $eq: [{ $month: "$startDate" }, month] });
      }

      if (year !== null) {
        filter.$expr.$and.push({ $eq: [{ $year: "$startDate" }, year] });
      }
    }

    const audycje = await Audycja.find(filter)
      .populate("place") // wypełni pełne dane placówki
      .populate("leader") // jeśli to też ObjectId
      .populate("musician") // jeśli to też ObjectId
      .lean();
    const reversed = audycje.reverse();

    res.json({
      audycje: reversed,
    });
  } catch (error) {
    console.error("Błąd pobierania audycji:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      placeId,
      locationId,
      startDate,
      endDate,
      leaderId,
      musicianId,
      status,
      price,
      paymentMethod,
      description,
    } = req.body;

    if (!placeId) {
      res.status(400).json({ message: "Pole 'placeId' jest wymagane" });
      return;
    }

    const place = await Place.findById(placeId);
    if (!place) {
      res.status(404).json({ message: "Placówka nie została znaleziona" });
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
      place: placeId,
      locationId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      leader: leaderId || undefined,
      musician: musicianId || undefined,
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
