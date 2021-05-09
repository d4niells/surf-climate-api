import mongoose, { Document, Model } from 'mongoose';

export enum BeachPosition {
  north = 'N',
  south = 'S',
  east = 'E',
  west = 'W',
}

export interface Beach {
  _id?: string;
  name: string;
  position: BeachPosition;
  lat: number;
  lng: number;
}

export interface BeachModel extends Omit<Beach, '_id'>, Document {}

const schema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    name: { type: String, required: true },
    position: { type: String, required: true },
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export const Beach: Model<BeachModel> = mongoose.model('Beac', schema);
