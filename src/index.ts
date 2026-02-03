import express from 'express';
import subjectsRouter from "./routes/subjects";
import usersRouter from "./routes/users";
import classesRouter from "./routes/classes";
import cors from 'cors';
import securityMiddleware from "./middleware/security";
import authMiddleware from "./middleware/auth";
import {auth} from "./lib/auth";
import {toNodeHandler} from "better-auth/node";

const app = express();
const port = 8000;

const frontendUrl = process.env.FRONTEND_URL;

if (!frontendUrl) {
    throw new Error('FRONTEND_URL is required for CORS configuration');
    }

app.use(cors({
    origin: [frontendUrl],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))

app.all('/api/auth/*splat', toNodeHandler(auth));

app.use(express.json());

app.use(authMiddleware);

app.use(securityMiddleware);

app.use('/api/subjects', subjectsRouter)
app.use('/api/users', usersRouter)
app.use('/api/classes', classesRouter)

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Classroom Backend!' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
