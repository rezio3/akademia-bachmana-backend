import { Router, Request, Response } from "express";
import { Placowka, IPlacowka } from "../models/Placowka.js";

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string)?.trim() || "";

    const query = search ? { name: { $regex: search, $options: "i" } } : {};

    const allDocs = await Placowka.find(query).lean<IPlacowka[]>();

    const reversed = allDocs.reverse();

    const totalCount = reversed.length;
    const totalPages = Math.ceil(totalCount / limit);

    const paginated = reversed.slice((page - 1) * limit, page * limit);

    res.json({ placowki: paginated, totalPages });
  } catch (error) {
    console.error("Błąd pobierania placówek:", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      name,
      phone,
      email,
      address,
      invoiceEmail,
      contactPerson,
      locationTypeId,
      nip,
      regon,
      description,
    } = req.body;

    if (!name || !locationTypeId) {
      return res.status(400).json({ message: "Brak wymaganych pól" });
    }

    const newPlacowka = new Placowka({
      name,
      phone,
      email,
      address,
      invoiceEmail,
      contactPerson,
      locationTypeId,
      nip,
      regon,
      description,
    });

    const saved = await newPlacowka.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Błąd dodawania placówki:", err);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const {
      name,
      phone,
      email,
      address,
      invoiceEmail,
      contactPerson,
      locationTypeId,
      nip,
      regon,
      description,
    } = req.body;

    if (!name || !locationTypeId) {
      return res.status(400).json({ message: "Brak wymaganych pól" });
    }

    const updatedPlacowka = await Placowka.findByIdAndUpdate(
      id,
      {
        name,
        phone,
        email,
        address,
        invoiceEmail,
        contactPerson,
        locationTypeId,
        nip,
        regon,
        description,
      },
      { new: true }
    );

    if (!updatedPlacowka) {
      return res.status(404).json({ message: "Placówka nie znaleziona" });
    }

    res.status(200).json(updatedPlacowka);
  } catch (err) {
    console.error("Błąd podczas edycji placówki:", err);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Brak ID placówki" });
    }

    const deleted = await Placowka.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Placówka nie istnieje" });
    }

    res.status(200).json({ message: "Placówka usunięta" });
  } catch (err) {
    console.error("Błąd usuwania placówki:", err);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

export default router;
