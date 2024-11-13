import mongoose, { Schema, Document } from 'mongoose';

export interface ICandidate extends Document {
    name: string;
    image: string;
    votes: number;
}

const CandidateSchema: Schema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    votes: { type: Number, default: 0 }
});

export default mongoose.model<ICandidate>('Candidate', CandidateSchema);