import mongoose, { Schema, Document } from "mongoose";

export interface IPlace extends Document {
  name: string;
  phone: string;
  email: string;
  address?: string;
  invoiceEmail: string;
  contactPerson: string;
  locationTypeId: number;
  nip: string;
  regon: string;
  description: string;
}

const PlaceSchema = new Schema<IPlace>(
  {
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
    invoiceEmail: { type: String },
    contactPerson: { type: String },
    locationTypeId: { type: Number, required: true },
    nip: { type: String },
    regon: { type: String },
    description: { type: String },
  },
  { timestamps: false, versionKey: false }
);

export const Place = mongoose.model<IPlace>("Place", PlaceSchema, "placowki");
