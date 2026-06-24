import dotenv from "dotenv";
import mongoose from "mongoose";
import { SiteSettingModel } from "./models/index.js";

dotenv.config({ path: ".env.local", override: true });

const MONGODB_URI = process.env.DATABASE_URL || process.env.MONGODB_URI || "mongodb://localhost:27017/vietkey-shop";

export class DatabaseService {
  private static instance: DatabaseService;
  private static isConnecting = false;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async connect(): Promise<void> {
    if (mongoose.connection.readyState === 1) return; // already connected
    if (DatabaseService.isConnecting) return;
    DatabaseService.isConnecting = true;

    try {
      await mongoose.connect(MONGODB_URI);
      console.log("[MongoDB] Kết nối thành công!");

      await this.ensureDefaultSettings();
    } catch (error) {
      console.error("[MongoDB] Lỗi kết nối:", error);
      throw error;
    } finally {
      DatabaseService.isConnecting = false;
    }
  }

  private async ensureDefaultSettings() {
    // Chi tao record neu chua ton tai (setOnInsert), khong ghi de du lieu da co
    await SiteSettingModel.findOneAndUpdate(
      {},
      {
        $setOnInsert: {
          logo: "/logo1.png",
          hotline: "",
          email: "",
          contactEmail: "",
          zalo: "",
          facebook: "",
          tiktok: "",
          youtube: "",
          analytics: "",
          gtm: "",
        },
      },
      { upsert: true, new: true }
    );
  }


  // Gi\u1eef l\u1ea1i c\u00e1c ph\u01b0\u01a1ng th\u1ee9c c\u0169 \u0111\u1ec3 t\u01b0\u01a1ng th\u00edch ng\u01b0\u1ee3c v\u1edbi repositories
  // (s\u1ebd x\u00f3a sau khi repositories \u0111\u01b0\u1ee3c c\u1eadp nh\u1eadt ho\u00e0n to\u00e0n)
}
