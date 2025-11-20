import { Router, Request, Response } from "express";
import { Task, ITask } from "../models/Task.js";

const router = Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const allTasks = await Task.find().lean<ITask[]>();

    res.json({ tasks: allTasks });
  } catch (error) {
    console.error("Błąd pobierania listy zadań.", error);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { description, deadline, completed } = req.body;

    if (!description) {
      return res.status(400).json({ message: "Brak wymaganych pól" });
    }

    const newTask = new Task({
      description,
      deadline,
      completed: completed ?? false,
    });

    const saved = await newTask.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Błąd dodawania zadania:", err);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { description, deadline, completed } = req.body;

    if (!description) {
      return res.status(400).json({ message: "Brak wymaganych pól" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        description,
        deadline,
        completed,
      },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Zadanie nie znalezione" });
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    console.error("Błąd podczas edycji zadania:", err);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Brak ID zadania" });
    }

    const deleted = await Task.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Zadanie nie istnieje" });
    }

    res.status(200).json({ message: "Zadanie usunięte" });
  } catch (err) {
    console.error("Błąd usuwania zadania:", err);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

export default router;
