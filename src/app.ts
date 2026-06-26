import dotenv from "dotenv";
dotenv.config({ path: ".env.local", override: true });
import express from "express";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { DatabaseService } from "./lib/database/db.service.js";
import { ShopService } from "./lib/services/shop.service.js";
import { ImageModel } from "./lib/database/models/index.js";
import { Role, LeadStatus } from "./types/index.js";

// Khởi tạo Database kết nối MongoDB
const db = DatabaseService.getInstance();
db.connect().catch(console.error);

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "vietkey_shop_secret_jwt_key_2026";

// Middleware cơ bản
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Đảm bảo thư mục upload tồn tại (cho local dev)
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (_) {
  /* readonly filesystem on Vercel */
}

// Phục vụ ảnh upload tĩnh (local dev)
app.use("/uploads", express.static(UPLOADS_DIR));

app.get("/api/health", async (req, res) => {
  try {
    await db.connect();
    res.json({
      ok: true,
      database: "connected",
      env: process.env.NODE_ENV || "development",
    });
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      database: "disconnected",
      message: error.message,
    });
  }
});

// ==========================================
// MIDDLEWARE XÁC THỰC JWT
// ==========================================
interface AuthRequest extends express.Request {
  user?: { id: string; email: string; role: Role };
}

const authenticateToken = (
  req: AuthRequest,
  res: express.Response,
  next: express.NextFunction,
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Không tìm thấy token truy cập." });
    return;
  }
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      res.status(403).json({
        message: "Phiên đăng nhập đã hết hạn hoặc không hợp lệ.",
      });
      return;
    }
    req.user = user as any;
    next();
  });
};

const requireAdmin = (
  req: AuthRequest,
  res: express.Response,
  next: express.NextFunction,
): void => {
  if (!req.user || req.user.role !== Role.ADMIN) {
    res
      .status(403)
      .json({ message: "Bạn cần quyền Admin để thực hiện thao tác này." });
    return;
  }
  next();
};

const requireDatabaseReady = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> => {
  try {
    await db.connect();
    next();
  } catch (error: any) {
    res.status(503).json({
      message: error.message || "Database chưa sẵn sàng.",
    });
  }
};

// ==========================================
// AUTH API
// ==========================================
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        message: "Vui lòng nhập đầy đủ tài khoản và mật khẩu.",
      });
      return;
    }
    const { UserModel } = await import("./lib/database/models/index.js");
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      res.status(401).json({ message: "Email hoặc mật khẩu không chính xác." });
      return;
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/auth/me", authenticateToken, (req: AuthRequest, res) => {
  res.json({ user: req.user });
});

// ==========================================
// SITE SETTINGS API
// ==========================================
app.get("/api/settings", requireDatabaseReady, async (req, res) => {
  try {
    const settings = await ShopService.getSettings();
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.put(
  "/api/settings",
  authenticateToken,
  requireDatabaseReady,
  requireAdmin,
  async (req, res) => {
    try {
      const updated = await ShopService.updateSettings(req.body);
      res.json({ message: "Cap nhat cai dat thanh cong", settings: updated });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
);

app.patch(
  "/api/settings",
  authenticateToken,
  requireDatabaseReady,
  requireAdmin,
  async (req, res) => {
    try {
      const updated = await ShopService.updateSettings(req.body);
      res.json({ message: "Cap nhat cai dat thanh cong", settings: updated });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
);

app.post(
  "/api/settings",
  authenticateToken,
  requireDatabaseReady,
  requireAdmin,
  async (req, res) => {
    try {
      const updated = await ShopService.updateSettings(req.body);
      res
        .status(200)
        .json({ message: "Cap nhat cai dat thanh cong", settings: updated });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
);

// ==========================================
// CATEGORY API
// ==========================================
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await ShopService.getCategories();
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.post(
  "/api/categories",
  authenticateToken,
  requireDatabaseReady,
  async (req, res) => {
    try {
      const { name, slug } = req.body;
      const cat = await ShopService.createCategory(name, slug);
      res.status(201).json(cat);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
);

app.put(
  "/api/categories/:id",
  authenticateToken,
  requireDatabaseReady,
  async (req, res) => {
    try {
      const { name, slug } = req.body;
      const cat = await ShopService.updateCategory(req.params.id, name, slug);
      res.json(cat);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
);

app.delete(
  "/api/categories/:id",
  authenticateToken,
  requireDatabaseReady,
  async (req, res) => {
    try {
      await ShopService.deleteCategory(req.params.id);
      res.json({ message: "Đã xóa danh mục thành công" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
);

// ==========================================
// LANDING PAGE API
// ==========================================
app.get("/api/landing-pages", async (req, res) => {
  try {
    const status = req.query.status as "ACTIVE" | "INACTIVE" | undefined;
    const lps = await ShopService.getLandingPages(status);
    res.json(lps);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/landing-pages/:slug", async (req, res) => {
  try {
    const lp = await ShopService.getLandingPageBySlug(req.params.slug);
    if (!lp) {
      res.status(404).json({ message: "Không tìm thấy Landing Page" });
    } else {
      res.json(lp);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.post(
  "/api/landing-pages",
  authenticateToken,
  requireDatabaseReady,
  async (req, res) => {
    try {
      const lp = await ShopService.createLandingPage(req.body);
      res.status(201).json(lp);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
);

app.put(
  "/api/landing-pages/:id",
  authenticateToken,
  requireDatabaseReady,
  async (req, res) => {
    try {
      const lp = await ShopService.updateLandingPage(req.params.id, req.body);
      res.json(lp);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
);

app.delete(
  "/api/landing-pages/:id",
  authenticateToken,
  requireDatabaseReady,
  async (req: AuthRequest, res) => {
    try {
      if (req.user?.role !== Role.ADMIN) {
        res.status(403).json({ message: "Chỉ quản trị viên mới được xóa." });
        return;
      }
      await ShopService.deleteLandingPage(req.params.id);
      res.json({ message: "Đã xóa Landing Page thành công" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
);

// ==========================================
// LEADS API
// ==========================================
app.get("/api/leads", authenticateToken, async (req, res) => {
  try {
    const leads = await ShopService.getLeads();
    res.json(leads);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/leads", requireDatabaseReady, async (req, res) => {
  try {
    const lead = await ShopService.createLead(req.body);
    res.status(201).json(lead);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

const updateLeadStatusHandler = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const { status } = req.body;
    if (!Object.values(LeadStatus).includes(status)) {
      res.status(400).json({ message: "Trạng thái không hợp lệ" });
      return;
    }
    const Math = await ShopService.updateLeadStatus(req.params.id, status);
    res.json(Math);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

app.patch(
  "/api/leads/:id/status",
  authenticateToken,
  requireDatabaseReady,
  updateLeadStatusHandler,
);
app.put(
  "/api/leads/:id/status",
  authenticateToken,
  requireDatabaseReady,
  updateLeadStatusHandler,
);

app.delete(
  "/api/leads/:id",
  authenticateToken,
  requireDatabaseReady,
  async (req: AuthRequest, res) => {
    try {
      if (req.user?.role !== Role.ADMIN) {
        res
          .status(403)
          .json({ message: "Chỉ quản trị viên mới được xóa liên hệ." });
        return;
      }
      const success = await ShopService.deleteLead(req.params.id);
      if (success) {
        res.json({ message: "Đã xóa liên hệ thành công" });
      } else {
        res.status(404).json({ message: "Không tìm thấy liên hệ" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
);

// ==========================================
// BLOG API
// ==========================================
app.get("/api/blog", async (req, res) => {
  try {
    const publishedOnly = req.query.published === "true";
    const posts = await ShopService.getBlogPosts(publishedOnly);
    res.json(posts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/blog/:slug", async (req, res) => {
  try {
    const post = await ShopService.getBlogPostBySlug(req.params.slug);
    if (!post) {
      res.status(404).json({ message: "Không tìm thấy bài viết" });
    } else {
      res.json(post);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

app.post(
  "/api/blog",
  authenticateToken,
  requireDatabaseReady,
  async (req, res) => {
    try {
      const post = await ShopService.createBlogPost(req.body);
      res.status(201).json(post);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
);

app.put(
  "/api/blog/:id",
  authenticateToken,
  requireDatabaseReady,
  async (req, res) => {
    try {
      const post = await ShopService.updateBlogPost(req.params.id, req.body);
      res.json(post);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
);

app.delete(
  "/api/blog/:id",
  authenticateToken,
  requireDatabaseReady,
  async (req: AuthRequest, res) => {
    try {
      if (req.user?.role !== Role.ADMIN) {
        res
          .status(403)
          .json({ message: "Chỉ quản trị viên mới được xóa bài viết." });
        return;
      }
      const success = await ShopService.deleteBlogPost(req.params.id);
      if (success) {
        res.json({ message: "Đã xóa bài viết thành công" });
      } else {
        res.status(404).json({ message: "Không tìm thấy bài viết" });
      }
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
);

// ==========================================
// NOTIFICATION API
// ==========================================
app.get(
  "/api/notifications",
  authenticateToken,
  requireDatabaseReady,
  async (req, res) => {
    try {
      const notifications = await ShopService.getNotifications();
      res.json(notifications);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
);

app.get(
  "/api/notifications/unread-count",
  authenticateToken,
  requireDatabaseReady,
  async (req, res) => {
    try {
      const count = await ShopService.getUnreadNotificationCount();
      res.json({ count });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
);

app.patch(
  "/api/notifications/read-all",
  authenticateToken,
  requireDatabaseReady,
  async (req, res) => {
    try {
      await ShopService.markAllNotificationsRead();
      res.json({ message: "Đã đánh dấu tất cả thông báo là đã đọc" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
);

app.patch(
  "/api/notifications/:id/read",
  authenticateToken,
  requireDatabaseReady,
  async (req, res) => {
    try {
      const notification = await ShopService.markNotificationRead(
        req.params.id,
      );
      res.json(notification);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
);

app.delete(
  "/api/notifications/:id",
  authenticateToken,
  requireDatabaseReady,
  requireAdmin,
  async (req, res) => {
    try {
      const success = await ShopService.deleteNotification(req.params.id);
      if (success) {
        res.json({ message: "Đã xóa thông báo thành công" });
      } else {
        res.status(404).json({ message: "Không tìm thấy thông báo" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },
);

// ==========================================
// DASHBOARD STATS API
// ==========================================
app.get("/api/dashboard/stats", authenticateToken, async (req, res) => {
  try {
    const stats = await ShopService.getDashboardStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================================
// IMAGE UPLOAD & SERVE (MongoDB + local fallback)
// ==========================================
app.post(
  "/api/upload",
  authenticateToken,
  requireDatabaseReady,
  async (req, res) => {
    try {
      const { filename, image } = req.body;
      if (!filename || !image) {
        res.status(400).json({ message: "Thiếu dữ liệu tải lên." });
        return;
      }

      const matches = image.match(/^data:([^;]+);base64,(.+)$/);
      let base64Data = image;
      let mimeType = "image/png";
      if (matches && matches.length === 3) {
        mimeType = matches[1];
        base64Data = matches[2];
      }

      // Store uploaded files in MongoDB for serverless deployments.
      const imgDoc = await ImageModel.create({
        filename: Date.now() + "_" + filename.replace(/[^a-zA-Z0-9.\-_]/g, ""),
        data: base64Data,
        mimeType,
      });

      res.json({ url: `/api/images/${imgDoc.id}` });
    } catch (error: any) {
      res.status(500).json({ message: "Lỗi tải ảnh lên: " + error.message });
    }
  },
);

// Serve uploaded files from MongoDB.
app.get("/api/images/:id", async (req, res) => {
  try {
    const img = await ImageModel.findById(req.params.id);
    if (!img) {
      res.status(404).json({ message: "Không tìm thấy ảnh" });
      return;
    }
    const buffer = Buffer.from(img.data, "base64");
    res.set("Content-Type", img.mimeType);
    res.set("Cache-Control", "public, max-age=31536000, immutable");
    res.send(buffer);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default app;
