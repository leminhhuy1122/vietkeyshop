export enum Role {
  ADMIN = "ADMIN",
  EDITOR = "EDITOR",
}

export enum LeadStatus {
  NEW = "NEW",
  CONTACTED = "CONTACTED",
  CONSULTING = "CONSULTING",
  WON = "WON",
  CANCELLED = "CANCELLED",
}

export interface User {
  id: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface LandingPage {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  thumbnail: string;
  gallery: string[];
  videoUrl?: string;
  demoUrl: string;
  categoryId: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  industry: string;
  budget: string;
  message: string;
  status: LeadStatus;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  keywords: string[];
  content: string;
  thumbnail: string;
  published: boolean;
  createdAt: string;
}

export interface SiteSetting {
  id: string;
  logo?: string;
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
  contactEmail?: string;
  zalo: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
  analytics?: string;
  gtm?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "customer" | "landing_page" | "blog" | "system";
  isRead: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalCustomers: number;
  totalLeads: number;
  totalBlogs: number;
  totalCategories: number;
  leadsToday: number;
  leadsThisWeek: number;
  leadsThisMonth: number;
  totalDemoViews: number;
  leadsByStatus: Record<LeadStatus, number>;
  viewsHistory: { date: string; views: number; leads: number }[];
  recentLeads: Lead[];
  recentProducts: LandingPage[];
}
