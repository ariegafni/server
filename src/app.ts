import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import userRoutes from './routes/userRoutes';
 
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  // credentials: true, 
}));
app.use(express.json());


app.use("/api/users", userRoutes);

// http://localhost:3000/api/users/register   חיבור משתמש חדש
// http://localhost:3000/api/users/login    ��י�ת משתמש קיים















mongoose.connect(process.env.MONGODB_URI!)
  .then(() => console.log('Connected to MongoDB Atlas!'))
  .catch((err) => console.error('Error connecting to MongoDB Atlas:', err));














app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


