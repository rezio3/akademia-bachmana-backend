import { Router, Request, Response } from "express";
import { Person, IPerson } from "../models/Person.js";

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const search = (req.query.search as string)?.trim() || "";
    const searchLower = search.toLowerCase();

    const locationNameToId: Record<number, string> = {
      1: "lubuskie",
      2: "mazowieckie",
      3: "łódzkie",
      4: "kujawsko-pomorskie",
    };

    let locationMatchId: number | undefined;

    for (const [id, name] of Object.entries(locationNameToId)) {
      if (name.toLowerCase().includes(searchLower)) {
        locationMatchId = Number(id);
        break;
      }
    }

    const searchableFields = ["name", "phone", "email", "description"];

    let orConditions = searchableFields.map((field) => ({
      [field]: { $regex: search, $options: "i" },
    }));

    if (locationMatchId) {
      orConditions.push({ location: locationMatchId } as any);
    }

    const baseFilter = { personType: { $in: [1, 2] } };

    const query = search ? { ...baseFilter, $or: orConditions } : baseFilter;

    const allDocs = await Person.find(query).lean<IPerson[]>();

    const reversed = allDocs.reverse();

    res.json({ persons: reversed });
  } catch (error) {
    console.error("Błąd pobierania listy osób.", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

export default router;
