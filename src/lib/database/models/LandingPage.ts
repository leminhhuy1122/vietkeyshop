import mongoose, { Schema, Document } from "mongoose";

export interface ILandingPage extends Document {
  title: string;
  slug: string;
  description: string;
  price: number;
  thumbnail: string;
  gallery: string[];
  videoUrl?: string;
  demoUrl: string;
  categoryId: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
  updatedAt: Date;
}

const LandingPageSchema = new Schema<ILandingPage>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    gallery: { type: [String], default: [] },
    videoUrl: { type: String, default: "" },
    demoUrl: { type: String, required: true },
    categoryId: { type: String, required: true },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
  },
  { timestamps: true }
);

export const LandingPageModel = mongoose.model<ILandingPage>("LandingPage", LandingPageSchema);
