import { compare, hash } from "bcrypt";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db } from "#db/db";
import { user } from "#db/schema";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  try {
    const hashedPassword = await hash(password, 10);
    const [newUser] = await db
      .insert(user)
      .values({ email, password: hashedPassword })
      .returning();

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.SECRET!,
      { expiresIn: "1h" }
    );

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ ...userWithoutPassword, jwt: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  try {
    const [foundUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, email));

    if (!foundUser) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const passwordMatch = await compare(password, foundUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: foundUser.id, email: foundUser.email },
      process.env.SECRET!,
      { expiresIn: "1h" }
    );

    const { password: _, ...userWithoutPassword } = foundUser;
    res.json({ ...userWithoutPassword, jwt: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});