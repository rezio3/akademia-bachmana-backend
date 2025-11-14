import { Router, Request, Response } from "express";
import { Person, IPerson } from "../models/Person.js";

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string)?.trim() || "";

    const query = search ? { name: { $regex: search, $options: "i" } } : {};

    const allDocs = await Person.find(query).lean<IPerson[]>();

    const reversed = allDocs.reverse();

    const totalCount = reversed.length;
    const totalPages = Math.ceil(totalCount / limit);

    const paginated = reversed.slice((page - 1) * limit, page * limit);

    res.json({ persons: paginated, totalPages });
  } catch (error) {
    console.error("Błąd pobierania listy osób.", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, personType, phone, email, location, description } = req.body;

    if (!name || !location || !personType) {
      return res.status(400).json({ message: "Brak wymaganych pól" });
    }

    const newPlace = new Person({
      name,
      personType,
      phone,
      email,
      location,
      description,
    });

    const saved = await newPlace.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Błąd dodawania placówki:", err);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { name, personType, phone, email, location, description } = req.body;

    if (!name || !location || !personType) {
      return res.status(400).json({ message: "Brak wymaganych pól" });
    }

    const updatedOsoba = await Person.findByIdAndUpdate(
      id,
      {
        name,
        personType,
        phone,
        email,
        location,
        description,
      },
      { new: true }
    );

    if (!updatedOsoba) {
      return res.status(404).json({ message: "Osoba nie znaleziona" });
    }

    res.status(200).json(updatedOsoba);
  } catch (err) {
    console.error("Błąd podczas edycji osoby:", err);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Brak ID osoby" });
    }

    const deleted = await Person.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Osoba nie istnieje" });
    }

    res.status(200).json({ message: "Osoba usunięta" });
  } catch (err) {
    console.error("Błąd usuwania osoby:", err);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

export default router;
