import express, { Express, Request, Response } from 'express';
import { authRouter } from '#routes/auth.route';

const app: Express = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

app.use(express.json()); 

const apiRouter = express.Router();
apiRouter.use('/auth', authRouter);

app.use('/', apiRouter);

app.listen(port, () => {
    console.log(`Server is running at http://${host}:${port}`);
});