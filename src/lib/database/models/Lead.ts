import mongoose, { Schema, Document } from "mongoose";
import { LeadStatus } from "../../../types/index.js";

export interface ILead extends Document {
  name: string;
  phone: string;
  email: string;
  industry: string;
  budget: string;
  message: string;
  status: LeadStatus;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: "" },
    industry: { type: String, default: "Chưa chọn" },
    budget: { type: String, default: "Chưa cấu hình" },
    message: { type: String, default: "" },
    status: { type: String, enum: Object.values(LeadStatus), default: LeadStatus.NEW },
  },
  { timestamps: true }
);

export const LeadModel = mongoose.model<ILead>("Lead", LeadSchema);
