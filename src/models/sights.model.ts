import { Schema } from 'mongoose';
import mongoose from 'mongoose';
import { Sight } from '@/interfaces/sight.interface';

const sightModelSchema = new Schema<Sight>(
  {
    province: { type: String },
    condition: { type: String, required: true },
    placeName: { type: String, required: true },
    animal: { type: String, required: true },
    imageId: { type: String, required: true },
    location: { type: Object, required: true },
    description: { type: String, required: true },
    createdAt: { type: String, required: true },
    userId: { type: String, required: true },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

const userModel = mongoose.model('Sight', sightModelSchema);

export default userModel;
