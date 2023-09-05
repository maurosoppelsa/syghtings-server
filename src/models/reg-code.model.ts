import { RegistrationCode } from '@/interfaces/auth.interface';
import mongoose, { Schema } from 'mongoose';

const regCodeModelSchema = new Schema<RegistrationCode>({
  userId: { type: String, required: true },
  code: { type: Number, required: true },
  expiresAt: { type: Date, required: true },
});

regCodeModelSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 3600 });

const regCodeModel = mongoose.model('RegCode', regCodeModelSchema);

export default regCodeModel;
