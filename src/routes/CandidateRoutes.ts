// CandidateRoutes.ts :
import { Request, Response, NextFunction } from 'express';
import express from 'express';
import Candidate from '../models/Candidate';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

const router = express.Router();


declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            res.status(401).json({ message: 'No token provided' });
            return;
        }

        const decoded = jwt.verify(token, 'yourSecretKey') as { userId: string };
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
        return;
    }
};

router.post('/vote/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const candidateId = req.params.id;
        const userId = req.userId;
        
        console.log('Received vote request:', { candidateId, userId }); // הוספת logging

        if (!userId) {
            res.status(401).json({ message: 'User ID not found' });
            return;
        }

        const candidateObjectId = new Types.ObjectId(candidateId);
        const userObjectId = new Types.ObjectId(userId);

        const user = await User.findById(userObjectId);
        console.log('Found user:', user); // הוספת logging

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const candidate = await Candidate.findById(candidateObjectId);
        console.log('Found candidate:', candidate); // הוספת logging

        if (!candidate) {
            res.status(404).json({ message: 'Candidate not found' });
            return;
        }

        // עדכון ההצבעה
        candidate.votes += 1;
        await candidate.save();

        // עדכון סטטוס ההצבעה של המשתמש
        user.hasVoted = true;
        user.votedFor = candidateObjectId;
        await user.save();

        res.status(200).json({
            message: 'Vote successful',
            candidate: {
                _id: candidate._id,
                name: candidate.name,
                votes: candidate.votes,
                image: candidate.image
            },
            user: {
                _id: user._id,
                hasVoted: user.hasVoted,
                votedFor: user.votedFor
            }
        });
    } catch (error) {
        console.error('Vote error:', error);
        res.status(500).json({ message: 'Server error during voting process' });
    }
});
router.get('/getCandidates', async (_req: Request, res: Response): Promise<void> => {
    try {
        const candidates = await Candidate.find();
        res.status(200).json({ message: 'Candidates retrieved successfully', candidates });
    } catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({ message: 'Server error while fetching candidates' });
    }
});

router.post('/registerCandidate', async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, imageUrl } = req.body;

        if (!name || !imageUrl) {
            res.status(400).json({ message: 'Name and image URL are required' });
            return;
        }

        const newCandidate = new Candidate({
            name,
            image: imageUrl,
            votes: 0
        });

        await newCandidate.save();
        res.status(201).json({ message: 'Candidate created successfully', candidate: newCandidate });
    } catch (error) {
        console.error('Error registering candidate:', error);
        res.status(500).json({ message: 'Server error while registering candidate' });
    }
});
router.put('/cancelVote', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        const candidate = await Candidate.findById(user?.votedFor);

       
        if (!user || !candidate) {
            res.status(404).json({ message: 'Not found iser or candidate' });
            return;
        }


        user.hasVoted = false;
        user.votedFor = null;
        await user.save();

        
        candidate.votes -= 1;
        await candidate.save();
        

        res.status(200).json({ message: 'Vote canceled successfully' });
    } catch (error) {
        console.error('Error canceling vote:', error);
    }
});

export default router;