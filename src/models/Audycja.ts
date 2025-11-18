import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAudycja extends Document {
  place: Types.ObjectId; // referencja do Place
  locationId: number;
  startDate: Date;
  endDate: Date;
  leader?: Types.ObjectId;
  musician?: Types.ObjectId;
  status: number;
  price?: number;
  paymentMethod?: string;
  description?: string;
}

const AudycjaSchema = new Schema<IAudycja>(
  {
    place: {
      type: Schema.Types.ObjectId,
      ref: "Place",
      required: true,
    },
    locationId: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    leader: {
      type: Schema.Types.ObjectId,
      ref: "Person", // lub jak masz nazwany model lidera
    },
    musician: {
      type: Schema.Types.ObjectId,
      ref: "Person",
    },
    status: { type: Number, required: true },
    price: { type: Number },
    paymentMethod: { type: String },
    description: { type: String },
  },
  { timestamps: false, versionKey: false }
);

export const Audycja = mongoose.model<IAudycja>(
  "Audycja",
  AudycjaSchema,
  "audycje"
);
