import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    password: string;
    hasVoted: boolean;
    votedFor: mongoose.Types.ObjectId | null;
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    hasVoted: { type: Boolean, default: false },
    votedFor: { type: Schema.Types.ObjectId, ref: 'Candidate', default: null }
});

export default mongoose.model<IUser>('User', UserSchema);