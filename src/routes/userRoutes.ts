// userRoutes.ts:
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";


const router = express.Router();


router.post("/register", async (req : any, res : any) => {
  const { username, password, organization, area, location } = req.body;

  try {
    const user = new User({ username, password, organization, area, location });

    const savedUser = await user.save();

    const token = jwt.sign({ userId: savedUser._id }, "secret", { expiresIn: '1h' });

    res.status(200).json({
      token,
      user: {
        _id: savedUser._id,
        username: savedUser.username,
        organization: savedUser.organization,
        location: savedUser.location,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error while registering user" });
  }
});


router.post("/login", async (req : any, res : any) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });  

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials, user not found" });
    }

    const isMatchPassword = await user.comparePassword(password);
    // if (!isMatchPassword) {
    //   return res.status(401).json({ message: "Invalid credentials, password is incorrect" });
    // }
    

    const token = jwt.sign({ userId: user._id }, "secret", { expiresIn: '1h' });
    res.status(200).json({ token, user: { _id: user._id, username: user.username ,organization: user.organization,} });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Server error while logging in user" });
  }
});

  


export default router;

