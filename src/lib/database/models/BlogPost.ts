import mongoose, { Schema, Document } from "mongoose";

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  description: string;
  keywords: string[];
  content: string;
  thumbnail: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    keywords: { type: [String], default: [] },
    content: { type: String, required: true },
    thumbnail: { type: String, required: true },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const BlogPostModel = mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);
