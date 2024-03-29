import { Schema } from 'mongoose';
import { User } from '@interfaces/users.interface';
import mongoose from 'mongoose';

const userModelSchema = new Schema<User>(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    occupation: { type: String, required: true },
    verified: { type: Boolean, required: true, default: false },
    allowResetPassword: { type: Boolean, required: true, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
        delete ret.allowResetPassword;
        return ret;
      },
    },
  },
);

const userModel = mongoose.model('User', userModelSchema);

export default userModel;
