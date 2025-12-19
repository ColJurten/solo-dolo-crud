import express, { type Express, type Request, type Response } from 'express' ;
import { db } from './db/db' ;
import { user } from './db/schema' ;

const app: Express = express() ;
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    runQuery();

    res. send ('Hello from TypeScript Express Server!');
});

const runQuery = async () => {
    const result = await db. insert (user) . values({
        email: "tester@mail.com",
        password: "12345666666666",
    });
    console.log(JSON.stringify(result, null, 2));

    const resultRes = await db.select().from(user);
    console.log(JSON.stringify(resultRes, null, 2));
};

app. listen(port, () => {
    console. log(`Server is running at http://localhost:${port}`);
});