import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import dotenv from 'dotenv';
import jwt, { JwtPayload } from 'jsonwebtoken';


const router = express.Router();

// נתיב לרישום משתמש חדש
router.post('/register', async (req: any, res: any) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username }).populate({
      path: 'votedFor',
      select: 'name'
    });
    
    
    if (user) {
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({
        username,
        password: hashedPassword,
        hasVoted: false,
        votedFor: null
      });
      await user.save();
      user = await user.populate('votedFor', 'name');
    }
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      'yourSecretKey',
      { expiresIn: '1h' }
    );
    res.status(201).json({
      message: 'Success',
      token,
      user: {
        _id: user._id,
        username: user.username,
        hasVoted: user.hasVoted,
        votedFor: user.votedFor
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/getusers', async (_req: Request, res: Response): Promise<void> => {
  try {
      const user = await User.find().populate({
          path: 'votedFor',
          select: 'name'
      });
      res.status(200).json({ message: 'Users retrieved successfully', users : user });
  } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Server error while fetching users' });
  }
});




router.get('/check-vote', async (req: any, res: any) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const decoded = jwt.verify(token, 'yourSecretKey');
    if (typeof decoded !== 'string') {
      const userId = (decoded as JwtPayload).userId; 
      const user = await User.findById(userId).populate({
        path: 'votedFor',
        select: 'name'
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({
        hasVoted: user.hasVoted,
        votedFor: user.votedFor 
      });
      
    } else {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
