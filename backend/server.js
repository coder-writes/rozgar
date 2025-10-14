import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

const allowedOrigins = ['http://localhost:5173'];

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

//  API EndPoints
app.get('/', (req, res) => { res.send('API Working'); });
app.use('/api/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});