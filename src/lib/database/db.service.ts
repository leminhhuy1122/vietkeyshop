import dotenv from "dotenv";
import mongoose from "mongoose";
import { SiteSettingModel } from "./models/index.js";

dotenv.config({ path: ".env.local", override: true });

function resolveMongoUri(): string {
  const configuredUri = process.env.DATABASE_URL || process.env.MONGODB_URI;

  if (configuredUri) {
    return configuredUri;
  }

  const isServerlessDeployment =
    process.env.VERCEL === "1" || process.env.NODE_ENV === "production";

  if (isServerlessDeployment) {
    throw new Error(
      "Thiếu DATABASE_URL hoặc MONGODB_URI. Hãy cấu hình biến môi trường MongoDB trên Vercel.",
    );
  }

  return "mongodb://localhost:27017/vietkey-shop";
}

export class DatabaseService {
  private static instance: DatabaseService;
  private static connectPromise: Promise<void> | null = null;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async connect(): Promise<void> {
    if (mongoose.connection.readyState === 1) return;
    if (DatabaseService.connectPromise) {
      await DatabaseService.connectPromise;
      return;
    }

    DatabaseService.connectPromise = (async () => {
      const mongoUri = resolveMongoUri();

      await mongoose.connect(mongoUri);
      console.log("[MongoDB] Kết nối thành công!");

      await this.ensureDefaultSettings();
    })();

    try {
      await DatabaseService.connectPromise;
    } catch (error) {
      console.error("[MongoDB] Lỗi kết nối:", error);
      throw error;
    } finally {
      DatabaseService.connectPromise = null;
    }
  }

  private async ensureDefaultSettings() {
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
      { upsert: true, new: true },
    );
  }
}
