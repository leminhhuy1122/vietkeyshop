import mongoose, { Schema, Document } from "mongoose";

export interface ISiteSetting extends Document {
  logo: string;
  hotline: string;
  email: string;
  contactEmail: string;
  zalo: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
  analytics?: string;
  gtm?: string;
  updatedAt: Date;
}

const SiteSettingSchema = new Schema<ISiteSetting>(
  {
    logo: { type: String, default: "/logo1.png" },
    hotline: { type: String, default: "" },
    email: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
    zalo: { type: String, default: "" },
    facebook: { type: String, default: "" },
    tiktok: { type: String, default: "" },
    youtube: { type: String, default: "" },
    analytics: { type: String, default: "" },
    gtm: { type: String, default: "" },
  },
  { timestamps: true }
);

export const SiteSettingModel = mongoose.model<ISiteSetting>("SiteSetting", SiteSettingSchema);
