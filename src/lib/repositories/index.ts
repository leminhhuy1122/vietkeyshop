import {
  UserModel,
  CategoryModel,
  LandingPageModel,
  LeadModel,
  BlogPostModel,
  SiteSettingModel,
} from "../database/models/index.js";
import {
  User,
  Category,
  LandingPage,
  Lead,
  BlogPost,
  SiteSetting,
  LeadStatus,
} from "../../types/index.js";

/** Helper: convert Mongoose doc to plain TS interface */
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

function toPlainList<T extends { _id: unknown }>(docs: T[]): any[] {
  return docs.map(toPlain);
}

// ==========================================
// USER REPOSITORY
// ==========================================
export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    return toPlain(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id);
    return toPlain(user);
  }
}

// ==========================================
// CATEGORY REPOSITORY
// ==========================================
export class CategoryRepository {
  async findAll(): Promise<Category[]> {
    const items = await CategoryModel.find().sort({ createdAt: -1 });
    return toPlainList(items);
  }

  async findById(id: string): Promise<Category | null> {
    const item = await CategoryModel.findById(id);
    return toPlain(item);
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const item = await CategoryModel.findOne({ slug });
    return toPlain(item);
  }

  async create(data: { name: string; slug: string }): Promise<Category> {
    const item = await CategoryModel.create(data);
    return toPlain(item);
  }

  async update(
    id: string,
    data: { name?: string; slug?: string },
  ): Promise<Category> {
    const item = await CategoryModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true },
    );
    if (!item) throw new Error("Category không tồn tại");
    return toPlain(item);
  }

  async delete(id: string): Promise<boolean> {
    const result = await CategoryModel.findByIdAndDelete(id);
    return result !== null;
  }
}

// ==========================================
// LANDING PAGE REPOSITORY
// ==========================================
export class LandingPageRepository {
  async findAll(): Promise<LandingPage[]> {
    const items = await LandingPageModel.find().sort({ createdAt: -1 });
    return toPlainList(items);
  }

  async findById(id: string): Promise<LandingPage | null> {
    const item = await LandingPageModel.findById(id);
    return toPlain(item);
  }

  async findBySlug(slug: string): Promise<LandingPage | null> {
    const item = await LandingPageModel.findOne({ slug });
    return toPlain(item);
  }

  async findByCategory(categoryId: string): Promise<LandingPage[]> {
    const items = await LandingPageModel.find({ categoryId });
    return toPlainList(items);
  }

  async create(data: any): Promise<LandingPage> {
    const item = await LandingPageModel.create(data);
    return toPlain(item);
  }

  async update(id: string, data: any): Promise<LandingPage> {
    const item = await LandingPageModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true },
    );
    if (!item) throw new Error("Landing Page không tồn tại");
    return toPlain(item);
  }

  async delete(id: string): Promise<boolean> {
    const result = await LandingPageModel.findByIdAndDelete(id);
    return result !== null;
  }
}

// ==========================================
// LEAD REPOSITORY
// ==========================================
export class LeadRepository {
  async findAll(): Promise<Lead[]> {
    const items = await LeadModel.find().sort({ createdAt: -1 });
    return toPlainList(items);
  }

  async findById(id: string): Promise<Lead | null> {
    const item = await LeadModel.findById(id);
    return toPlain(item);
  }

  async create(data: any): Promise<Lead> {
    const item = await LeadModel.create(data);
    return toPlain(item);
  }

  async updateStatus(id: string, status: LeadStatus): Promise<Lead> {
    const item = await LeadModel.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true },
    );
    if (!item) throw new Error("Khách hàng không tồn tại");
    return toPlain(item);
  }

  async delete(id: string): Promise<boolean> {
    const result = await LeadModel.findByIdAndDelete(id);
    return result !== null;
  }
}

// ==========================================
// BLOG POST REPOSITORY
// ==========================================
export class BlogPostRepository {
  async findAll(): Promise<BlogPost[]> {
    const items = await BlogPostModel.find().sort({ createdAt: -1 });
    return toPlainList(items);
  }

  async findById(id: string): Promise<BlogPost | null> {
    const item = await BlogPostModel.findById(id);
    return toPlain(item);
  }

  async findBySlug(slug: string): Promise<BlogPost | null> {
    const item = await BlogPostModel.findOne({ slug });
    return toPlain(item);
  }

  async create(data: any): Promise<BlogPost> {
    const item = await BlogPostModel.create(data);
    return toPlain(item);
  }

  async update(id: string, data: any): Promise<BlogPost> {
    const item = await BlogPostModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true },
    );
    if (!item) throw new Error("Bài viết không tồn tại");
    return toPlain(item);
  }

  async delete(id: string): Promise<boolean> {
    const result = await BlogPostModel.findByIdAndDelete(id);
    return result !== null;
  }
}
