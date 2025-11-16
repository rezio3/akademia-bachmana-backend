import { Router, Request, Response } from "express";
import { Place, IPlace } from "../models/Place.js";

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const pageParam = req.query.page as string;
    const limitParam = req.query.limit as string;

    const page = pageParam ? parseInt(pageParam) : undefined;
    const limit = limitParam ? parseInt(limitParam) : undefined;
    const search = (req.query.search as string)?.trim() || "";

    const locationNameToId: Record<number, string> = {
      1: "lubuskie",
      2: "mazowieckie",
      3: "łódzkie",
      4: "kujawsko-pomorskie",
    };

    const searchLower = search.toLowerCase();
    let locationIdMatch: number | undefined;

    for (const [id, name] of Object.entries(locationNameToId)) {
      if (name.toLowerCase().includes(searchLower)) {
        locationIdMatch = Number(id);
        break;
      }
    }

    const searchableFields = [
      "name",
      "phone",
      "email",
      "invoiceEmail",
      "address",
      "contactPerson",
      "nip",
      "regon",
      "description",
    ];

    let orConditions = searchableFields.map((field) => ({
      [field]: { $regex: search, $options: "i" },
    }));

    if (locationIdMatch) {
      orConditions.push({ locationTypeId: locationIdMatch } as any);
    }

    const query = search ? { $or: orConditions } : {};

    const allDocs = await Place.find(query).lean<IPlace[]>();
    const reversed = allDocs.reverse();

    if (page !== undefined && limit !== undefined) {
      const totalCount = reversed.length;
      const totalPages = Math.ceil(totalCount / limit);
      const paginated = reversed.slice((page - 1) * limit, page * limit);

      res.json({ places: paginated, totalPages });
    } else {
      res.json({ places: reversed });
    }
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

    const newPlace = new Place({
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

    const updatedPlace = await Place.findByIdAndUpdate(
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

    if (!updatedPlace) {
      return res.status(404).json({ message: "Placówka nie znaleziona" });
    }

    res.status(200).json(updatedPlace);
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

    const deleted = await Place.findByIdAndDelete(id);

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
