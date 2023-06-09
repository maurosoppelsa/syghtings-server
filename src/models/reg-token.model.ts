import { RegistrationToken } from '@/interfaces/auth.interface';
import mongoose, { Schema } from 'mongoose';

const regTokenModelSchema = new Schema<RegistrationToken>({
  userId: { type: String, required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

regTokenModelSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 3600 });

const regTokenModel = mongoose.model('RegToken', regTokenModelSchema);

export default regTokenModel;
