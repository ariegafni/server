import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";


const router = express.Router();


router.post("/register", async (req : any, res : any) => {
    const { name, password, organization, area } = req.body;
    const existingUser = await User.findOne({ name });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, password: hashedPassword, organization, area: organization === 'IDF' ? area : undefined });
    try {
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Server error while registering user" });
        
    }
});

router.post("/login", async (req : any, res : any) => {
    const { name, password } = req.body;
   try {
    const user = await User.findOne({ name }); 
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials user not found" });
    }
    const isMatchPassword = await user.comparePassword(password);
    if (!isMatchPassword) {
        return res.status(401).json({ message: "Invalid credentials password is incorrect" });
    }
    const token = jwt.sign({ userId: user._id }, "secret", { expiresIn: '1h' }); 
    res.json({ token });
    res.status(200).json({ message: "User logged in successfully" });
   } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Server error while logging in user" });
   }
});


export default router;

