import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", (req: Request, res: Response) => {
  const { login, password } = req.body;

  if (
    login === process.env.ADMIN_LOGIN &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET!, {
      expiresIn: "24h",
    });

    return res.json({ success: true, token });
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Nieprawidłowy login lub hasło" });
  }
});

// Endpoint do weryfikacji tokena
router.get("/verify", (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Brak tokena" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return res.json({ success: true, user: decoded });
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Nieprawidłowy token" });
  }
});

export default router;
