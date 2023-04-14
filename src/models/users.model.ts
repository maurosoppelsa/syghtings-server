import { Schema } from 'mongoose';
import { User } from '@interfaces/users.interface';
import mongoose from 'mongoose';

const userModelSchema = new Schema<User>({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  occupation: { type: String, required: true },
});

const userModel = mongoose.model('User', userModelSchema);

export default userModel;
