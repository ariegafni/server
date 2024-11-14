// User.ts :
import mongoose, { Document } from "mongoose";

import bcrypt from "bcryptjs";

interface IUser extends Document {
  _id: string;
  username: string; 
  password: string;
  organization: string;
  area?: string;
  location?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  organization: { type: String, required: true },
  area: { type: String }
});


userSchema.methods.comparePassword = function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);  
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
