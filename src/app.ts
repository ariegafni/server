import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import CandidateRoutes from './routes/CandidateRoutes';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, 
}));


app.use(express.json());

// חיבור למסד הנתונים
mongoose.connect('mongodb+srv://ariegafni18:2duueuTxbK8Re2mB@arie.xkhfs.mongodb.net/WarSimulator?retryWrites=true&w=majority&appName=Claster0')
  .then(() => console.log('Connected to MongoDB Atlas!'))
  .catch((err) => console.error('Error connecting to MongoDB Atlas:', err));

// נתיבים
app.use('/api/users', userRoutes);
app.use('/api/candidates', CandidateRoutes);



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});






//לחיבור יוזר חדש
// http://localhost:3000/api/users/register
// הכנסת מועמד חדש
// http://localhost:3000/api/candidates/registerCandidate
//קבלת כל המועמדים
// http://localhost:3000/api/candidates/getCandidates
//קבלת כל היוזרים
// http://localhost:3000/api/users/getusers
//הוספת הצבעה
// http://localhost:3000/api/candidates/vote
//ביטול הצבעה
// http://localhost:3000/api/candidates/cancelVote/
//בדיקה אם יוזר הצביע
// http://localhost:3000/api/users/check-vote


