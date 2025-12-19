import { Router } from "express";
import { checkAdminRole } from "src/middleware/checkToken";
import { eq } from "drizzle-orm";
import { db } from "#db/db";
import { user } from "#db/schema";

export const adminRouter = Router();

adminRouter.use(checkAdminRole);

adminRouter.get("/users", async (req, res) => {
  try {
    const users = await db.select().from(user);
    const usersWithoutPasswords = users.map(({ password, ...rest }) => rest);
    res.status(200).json(usersWithoutPasswords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

adminRouter.delete("/user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCount = await db.delete(user).where(eq(user.id, id)).returning().then(rows => rows.length);

    if (deletedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}); 