import mongoose from "mongoose";
const missileSchema = new mongoose.Schema({
    name: String,
    description : String,
    speed : Number,
    intercepts : [String],
    price : Number
});
const Missile = mongoose.model('Missile', missileSchema);
// const missiles = require('../json/missiles.json'); 

// Missile.insertMany(missiles)
//   .then(() => console.log("Missiles data inserted"))
//   .catch(err => console.log("Error inserting missiles data:", err));
