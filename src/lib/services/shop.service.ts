import {
  UserRepository,
  CategoryRepository,
  LandingPageRepository,
  LeadRepository,
  BlogPostRepository,
} from "../repositories/index.js";
import {
  SiteSettingModel,
  NotificationModel,
} from "../database/models/index.js";
import { LeadStatus, DashboardStats } from "../../types/index.js";

const userRepo = new UserRepository();
const categoryRepo = new CategoryRepository();
const lpRepo = new LandingPageRepository();
const leadRepo = new LeadRepository();
const blogRepo = new BlogPostRepository();

function toPlain<T extends Record<string, any>>(doc: T | null): any {
  if (!doc) return null;
  const obj =
    typeof (doc as any).toObject === "function" ? (doc as any).toObject() : doc;
  const { _id, __v, ...rest } = obj;
  return {
    id: String(_id),
    ...rest,
    createdAt: rest.createdAt?.toISOString?.() ?? rest.createdAt,
    updatedAt: rest.updatedAt?.toISOString?.() ?? rest.updatedAt,
  };
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfWeek(date: Date): Date {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return startOfDay(new Date(date.getFullYear(), date.getMonth(), diff));
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

// Stats tracking in-memory (dÃ¹ng cho dashboard)
let totalDemoViews = 0;
interface ViewsHistoryEntry {
  date: string;
  views: number;
  leads: number;
}
let viewsHistory: ViewsHistoryEntry[] = [];

function getTodayStr(): string {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export class ShopService {
  // ==========================================
  // LANDING PAGE & CATEGORIES
  // ==========================================
  public static async getCategories() {
    return categoryRepo.findAll();
  }

  public static async getCategoryBySlug(slug: string) {
    return categoryRepo.findBySlug(slug);
  }

  public static async createCategory(name: string, slug: string) {
    if (!name || !slug) throw new Error("TÃªn vÃ  slug khÃ´ng Â°Ã£c rÃng");
    return categoryRepo.create({ name, slug });
  }

  public static async updateCategory(id: string, name: string, slug: string) {
    return categoryRepo.update(id, { name, slug });
  }

  public static async deleteCategory(id: string) {
    const lps = await lpRepo.findAll();
    const hasProducts = lps.some((lp) => lp.categoryId === id);
    if (hasProducts) {
      throw new Error(
        "KhÃ´ng thÃ xÃ³a danh mÃ¥c ang cÃ³ chÃ©a Landing Page mÂ«u",
      );
    }
    return categoryRepo.delete(id);
  }

  public static async getLandingPages(status?: "ACTIVE" | "INACTIVE") {
    const lps = await lpRepo.findAll();
    if (status) {
      return lps.filter((lp) => lp.status === status);
    }
    return lps;
  }

  public static async getLandingPageBySlug(slug: string) {
    const lp = await lpRepo.findBySlug(slug);
    if (lp) {
      totalDemoViews += 1;
      const today = getTodayStr();
      const todayObj = viewsHistory.find((h) => h.date === today);
      if (todayObj) {
        todayObj.views += 1;
      } else {
        viewsHistory.push({ date: today, views: 1, leads: 0 });
      }
    }
    return lp;
  }

  public static async createLandingPage(data: any) {
    const landingPage = await lpRepo.create({
      title: data.title,
      slug: data.slug,
      description: data.description,
      price: Number(data.price),
      thumbnail: data.thumbnail,
      gallery: data.gallery || [],
      videoUrl: data.videoUrl || "",
      demoUrl: data.demoUrl,
      categoryId: data.categoryId,
      status: data.status || "ACTIVE",
    });
    await this.createNotification({
      title: "Landing Page mÃi Â°Ã£c tÂ¡o",
      message: landingPage.title,
      type: "landing_page",
    });
    return landingPage;
  }

  public static async updateLandingPage(id: string, data: any) {
    return lpRepo.update(id, {
      title: data.title,
      slug: data.slug,
      description: data.description,
      price: Number(data.price),
      thumbnail: data.thumbnail,
      gallery: data.gallery,
      videoUrl: data.videoUrl,
      demoUrl: data.demoUrl,
      categoryId: data.categoryId,
      status: data.status,
    });
  }

  public static async deleteLandingPage(id: string) {
    return lpRepo.delete(id);
  }

  // ==========================================
  // LEADS
  // ==========================================
  public static async getLeads() {
    return leadRepo.findAll();
  }

  public static async createLead(data: any) {
    if (!data.name || !data.phone) {
      throw new Error("HÃ vÃ  tÃªn, SÃ iÃn thoÂ¡i lÃ  trÂ°Ãng bÂ¯t buÃc!");
    }
    const lead = await leadRepo.create({
      name: data.name,
      phone: data.phone,
      email: data.email || "",
      industry: data.industry || "ChÂ°a chÃn",
      budget: data.budget || "ChÂ°a cÂ¥u hÃ¬nh",
      message: data.message || "",
      status: LeadStatus.NEW,
    });
    // Log view thÃng kÃª
    const today = getTodayStr();
    const todayObj = viewsHistory.find((h) => h.date === today);
    if (todayObj) {
      todayObj.leads += 1;
    } else {
      viewsHistory.push({ date: today, views: 0, leads: 1 });
    }
    await this.createNotification({
      title: "KhÃ¡ch hÃ ng mÃi gÃ­i form",
      message: `${lead.name} - ${lead.phone}`,
      type: "customer",
    });
    return lead;
  }

  public static async updateLeadStatus(id: string, status: LeadStatus) {
    return leadRepo.updateStatus(id, status);
  }

  public static async deleteLead(id: string) {
    return leadRepo.delete(id);
  }

  // ==========================================
  // BLOG POSTS
  // ==========================================
  public static async getBlogPosts(publishedOnly = false) {
    const posts = await blogRepo.findAll();
    if (publishedOnly) {
      return posts.filter((p) => p.published);
    }
    return posts;
  }

  public static async getBlogPostBySlug(slug: string) {
    return blogRepo.findBySlug(slug);
  }

  public static async createBlogPost(data: any) {
    const post = await blogRepo.create({
      title: data.title,
      slug: data.slug,
      description: data.description,
      keywords: data.keywords || [],
      content: data.content,
      thumbnail: data.thumbnail,
      published: data.published ?? false,
    });
    if (post.published) {
      await this.createNotification({
        title: "BÃ i viÂ¿t mÃi Â°Ã£c xuÂ¥t bÂ£n",
        message: post.title,
        type: "blog",
      });
    }
    return post;
  }

  public static async updateBlogPost(id: string, data: any) {
    return blogRepo.update(id, {
      title: data.title,
      slug: data.slug,
      description: data.description,
      keywords: data.keywords,
      content: data.content,
      thumbnail: data.thumbnail,
      published: data.published,
    });
  }

  public static async deleteBlogPost(id: string) {
    return blogRepo.delete(id);
  }

  // ==========================================
  // SITE SETTINGS
  // ==========================================
  private static normalizeSettings(settings: any) {
    const obj = settings.toObject();
    const { _id, __v, updatedAt, createdAt, ...rest } = obj as any;
    return { id: String(_id), ...rest };
  }

  public static async getSettings() {
    const settings = await SiteSettingModel.findOne().sort({ updatedAt: -1 });
    if (settings) return this.normalizeSettings(settings);

    const created = await SiteSettingModel.create({
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
    });
    return this.normalizeSettings(created);
  }

  public static async updateSettings(data: any) {
    const allowedFields = [
      "logo",
      "hotline",
      "email",
      "contactEmail",
      "zalo",
      "facebook",
      "tiktok",
      "youtube",
      "analytics",
      "gtm",
    ];
    const sanitized: Record<string, any> = {};
    for (const key of allowedFields) {
      if (key in data) sanitized[key] = data[key];
    }
    const settings = await SiteSettingModel.findOneAndUpdate(
      {},
      { $set: sanitized },
      { new: true, upsert: true },
    );
    return this.normalizeSettings(settings!);
  }

  // ==========================================
  // NOTIFICATIONS
  // ==========================================
  public static async createNotification(data: {
    title: string;
    message: string;
    type: "customer" | "landing_page" | "blog" | "system";
  }) {
    const item = await NotificationModel.create(data);
    return toPlain(item);
  }

  public static async getNotifications() {
    const items = await NotificationModel.find()
      .sort({ createdAt: -1 })
      .limit(50);
    return items.map(toPlain);
  }

  public static async getUnreadNotificationCount() {
    return NotificationModel.countDocuments({ isRead: false });
  }

  public static async markNotificationRead(id: string) {
    const item = await NotificationModel.findByIdAndUpdate(
      id,
      { $set: { isRead: true } },
      { new: true },
    );
    if (!item) throw new Error("ThÃ´ng bÃ¡o khÃ´ng tÃn tÂ¡i");
    return toPlain(item);
  }

  public static async markAllNotificationsRead() {
    await NotificationModel.updateMany(
      { isRead: false },
      { $set: { isRead: true } },
    );
    return { success: true };
  }

  public static async deleteNotification(id: string) {
    const result = await NotificationModel.findByIdAndDelete(id);
    return result !== null;
  }

  // ==========================================
  // DASHBOARD STATS
  // ==========================================
  public static async getDashboardStats(): Promise<DashboardStats> {
    const lps = await lpRepo.findAll();
    const leads = await leadRepo.findAll();
    const blogs = await blogRepo.findAll();
    const categories = await categoryRepo.findAll();
    const now = new Date();
    const todayStart = startOfDay(now).getTime();
    const weekStart = startOfWeek(now).getTime();
    const monthStart = startOfMonth(now).getTime();
    const leadTime = (createdAt: string | Date) =>
      new Date(createdAt).getTime();

    const leadsByStatus: Record<LeadStatus, number> = {
      [LeadStatus.NEW]: 0,
      [LeadStatus.CONTACTED]: 0,
      [LeadStatus.CONSULTING]: 0,
      [LeadStatus.WON]: 0,
      [LeadStatus.CANCELLED]: 0,
    };

    leads.forEach((lead) => {
      if (leadsByStatus[lead.status] !== undefined) {
        leadsByStatus[lead.status]++;
      }
    });

    return {
      totalProducts: lps.length,
      totalCustomers: leads.filter((l) => l.status === LeadStatus.WON).length,
      totalLeads: leads.length,
      totalBlogs: blogs.length,
      totalCategories: categories.length,
      leadsToday: leads.filter((l) => leadTime(l.createdAt) >= todayStart)
        .length,
      leadsThisWeek: leads.filter((l) => leadTime(l.createdAt) >= weekStart)
        .length,
      leadsThisMonth: leads.filter((l) => leadTime(l.createdAt) >= monthStart)
        .length,
      totalDemoViews,
      leadsByStatus,
      viewsHistory,
      recentLeads: leads.slice(0, 5),
      recentProducts: lps.slice(0, 5),
    };
  }
}
