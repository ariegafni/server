// organization.ts:
import mongoose, { Schema, Document } from 'mongoose';

const organizationSchema = new Schema({
    name: String,
    resources : [{
        name: String,
        amount: Number
    }],
    budget: Number

});
const Organization = mongoose.model('Organization', organizationSchema);

export default Organization;

// const organizations = require('../json/organizations.json'); 

// Organization.insertMany(organizations)
//   .then(() => console.log("Organizations data inserted"))
//   .catch(err => console.log("Error inserting organizations data:", err));
