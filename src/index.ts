import express from 'express';
import subjectsRouter from "./routes/subjects";
import cors from 'cors';

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

app.use(express.json());

app.use('/api/subjects', subjectsRouter)

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Classroom Backend!' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
