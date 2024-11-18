import { Schema, model } from 'mongoose';

const userProfileSchema = new Schema({
    uid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
});

const UserProfile = model('UserProfile', userProfileSchema);

export default UserProfile;
