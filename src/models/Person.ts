import mongoose, { Schema, Document } from "mongoose";

export enum LocationType {
  Lubelskie = 1,
  Mazowieckie = 2,
  Lodzkie = 3,
  KujawskoPomorskie = 4,
}
export enum PersonType {
  Prowadzacy = 1,
  Zastepca = 2,
  Muzyk = 3,
}

export interface IPerson extends Document {
  name: string;
  personType: PersonType;
  phone?: string;
  email?: string;
  location: LocationType;
  description: string;
}

const PersonSchema = new Schema<IPerson>(
  {
    name: { type: String, required: true },
    personType: {
      type: Number,
      enum: Object.values(PersonType).filter((v) => typeof v === "number"),
      required: true,
    },
    phone: { type: String },
    email: { type: String },
    location: {
      type: Number,
      enum: Object.values(LocationType).filter((v) => typeof v === "number"),
      required: true,
    },
    description: { type: String },
  },
  { timestamps: false, versionKey: false }
);

export const Person = mongoose.model<IPerson>(
  "Person",
  PersonSchema,
  "persons"
);
