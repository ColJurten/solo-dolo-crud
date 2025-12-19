import express, { Express, Request, Response } from 'express';
import { db } from "./db/db";
import { user } from "./db/schema";
import { eq } from 'drizzle-orm';

const app: Express = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

app.use(express.json()); // Middleware to parse JSON body

app.get('/', (req: Request, res: Response) => {
    res.send('Hello from TypeScript Express Server!');
});

// Create (Insert)
app.post('/users', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await db.insert(user).values({ email, password }).returning();
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Read (Select All)
app.get('/users', async (req: Request, res: Response) => {
    try {
        const result = await db.select().from(user);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Update
app.put('/users/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { email, password } = req.body;
        const result = await db.update(user).set({ email, password }).where(eq(user.id, id)).returning();
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Delete
app.delete('/users/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await db.delete(user).where(eq(user.id, id)).returning();
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://${host}:${port}`);
});