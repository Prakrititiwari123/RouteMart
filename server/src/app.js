import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.routes.js';
import shopRoutes from './routes/shop.routes.js';

const app = express();

app.use(cors());

app.use(express.json());

app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('RouteMart API Running');
});

app.use('/api/auth', authRoutes);
app.use('/api/shops', shopRoutes);

export default app;