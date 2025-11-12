import mongoose, { Schema, Document } from "mongoose";

export interface IPlacowka extends Document {
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

const PlacowkaSchema = new Schema<IPlacowka>(
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

export const Placowka = mongoose.model<IPlacowka>(
  "Placowka",
  PlacowkaSchema,
  "placowki"
);
