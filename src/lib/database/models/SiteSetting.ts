import mongoose, { Schema, Document } from "mongoose";

export interface ISiteSetting extends Document {
  logo: string;
  brandPrimaryColor?: string;
  brandSecondaryColor?: string;
  brandAccentColor?: string;
  brandHeaderColor?: string;
  brandFooterColor?: string;
  brandButtonColor?: string;
  brandTitleColor?: string;
  brandFontFamily?: string;
  brandFontSource?: "preset" | "uploaded";
  brandFontUrl?: string;
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
    brandPrimaryColor: { type: String, default: "#9A3412" },
    brandSecondaryColor: { type: String, default: "#EA580C" },
    brandAccentColor: { type: String, default: "#F59E0B" },
    brandHeaderColor: { type: String, default: "#FFFDFC" },
    brandFooterColor: { type: String, default: "#0F172A" },
    brandButtonColor: { type: String, default: "#9A3412" },
    brandTitleColor: { type: String, default: "#3F190F" },
    brandFontFamily: { type: String, default: "Inter" },
    brandFontSource: { type: String, enum: ["preset", "uploaded"], default: "preset" },
    brandFontUrl: { type: String, default: "" },
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
