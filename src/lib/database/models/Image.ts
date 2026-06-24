import mongoose, { Schema, Document } from "mongoose";

export interface IImage extends Document {
  filename: string;
  data: string;
  mimeType: string;
  createdAt: Date;
}

const ImageSchema = new Schema<IImage>(
  {
    filename: { type: String, required: true },
    data: { type: String, required: true },
    mimeType: { type: String, required: true },
  },
  { timestamps: true }
);

export const ImageModel = mongoose.model<IImage>("Image", ImageSchema);
