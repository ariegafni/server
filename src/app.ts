// app.ts:
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

import userRoutes from './routes/userRoutes';
import gameRoutes from './routes/attackRoutes';
import storeRoutes from './routes/storeRoutes';
import defenseRoutes from './routes/defenseRoutes';
 
dotenv.config();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }
});

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/store", storeRoutes);
app.use("/api/defense", defenseRoutes);


io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  
  socket.on('missile-launch', (data) => {
    console.log('Missile launched:', data);
    
    socket.broadcast.emit('incoming-missile', {
      ...data,
      timestamp: Date.now()
    });
  });

 
  socket.on('intercept-attempt', (data) => {
    console.log('Intercept attempt:', data);
    io.emit('intercept-result', {
      ...data,
      timestamp: Date.now()
    });
  });

  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const port = process.env.PORT || 3000;


mongoose.connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log('Connected to MongoDB');
    
    httpServer.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

export { io }; 
//רשימת טילים של אירגון
// http://localhost:3000/api/store/missiles/:organizationName
