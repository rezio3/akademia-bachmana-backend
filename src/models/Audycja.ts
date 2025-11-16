import mongoose, { Schema, Document } from "mongoose";

export interface IAudycja extends Document {
  place: { name: string; _id: string };
  locationId: number;
  startDate: Date;
  endDate: Date;
  leader?: { name: string; _id: string };
  musician?: { name: string; _id: string };
  status: number;
  price?: number;
  paymentMethod?: string;
  description?: string;
}

const AudycjaSchema = new Schema<IAudycja>(
  {
    place: {
      type: {
        name: { type: String, required: true },
        _id: { type: String, required: true },
      },
      required: true,
    },

    locationId: { type: Number, required: true },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    leader: {
      type: {
        name: { type: String },
        _id: { type: String },
      },
      required: false,
    },

    musician: {
      type: {
        name: { type: String },
        _id: { type: String },
      },
      required: false,
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
