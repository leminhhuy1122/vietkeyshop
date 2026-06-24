import React from "react";
import {
  LayoutDashboard,
  Layers,
  Users,
  Settings,
  LogOut,
  Tag,
  FileText,
  UserCheck,
  Sparkles,
  Command,
  Bell,
  Search,
  ChevronDown,
  X,
  Plus,
} from "lucide-react";
import { Role } from "../../../types/index.js";

interface AdminSidebarProps {
  activeTab: "stats" | "lps" | "categories" | "leads" | "blog" | "settings";
  setActiveTab: (
    tab: "stats" | "lps" | "categories" | "leads" | "blog" | "settings",
  ) => void;
  adminUser: any;
  handleLogout: () => void;
  leadsCount: number;
}

export function AdminSidebar({
  activeTab,
  setActiveTab,
  adminUser,
  handleLogout,
  leadsCount,
}: AdminSidebarProps) {
  return (
    <aside className="w-full md:w-70 bg-white border-r border-slate-200 p-6 flex flex-col justify-between shrink-0 select-none">
      <div className="space-y-8">
        {/* Branch Title header */}
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-150 text-white">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900 tracking-tight text-sm leading-none flex items-center gap-1">
              VietKey Shop
              <span className="text-[9px] bg-indigo-50 text-indigo-600 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                SaaS
              </span>
            </h1>
            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-semibold">
              Admin Panel
            </p>
          </div>
        </div>

        {/* Menu selections */}
        <div className="space-y-1.5">
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 font-mono px-3 mb-2">
            Điều hướng gốc
          </p>

          <nav className="space-y-1 flex flex-col">
            <button
              onClick={() => setActiveTab("stats")}
              className={`flex items-center space-x-3 px-4.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 group ${
                activeTab === "stats"
                  ? "bg-indigo-50/75 border-l-4 border-indigo-600 text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <LayoutDashboard
                className={`w-4 h-4 transition ${activeTab === "stats" ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`}
              />
              <span className="flex-1 text-left">Bản tin thống kê</span>
              <kbd className="hidden lg:inline-flex text-[10px] opacity-40 font-mono">
                Alt+1
              </kbd>
            </button>

            <button
              onClick={() => setActiveTab("lps")}
              className={`flex items-center space-x-3 px-4.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 group ${
                activeTab === "lps"
                  ? "bg-indigo-50/75 border-l-4 border-indigo-600 text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Layers
                className={`w-4 h-4 transition ${activeTab === "lps" ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`}
              />
              <span className="flex-1 text-left">Mẫu Landing Page</span>
              <kbd className="hidden lg:inline-flex text-[10px] opacity-40 font-mono">
                Alt+2
              </kbd>
            </button>

            <button
              onClick={() => setActiveTab("categories")}
              className={`flex items-center space-x-3 px-4.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 group ${
                activeTab === "categories"
                  ? "bg-indigo-50/75 border-l-4 border-indigo-600 text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Tag
                className={`w-4 h-4 transition ${activeTab === "categories" ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`}
              />
              <span className="flex-1 text-left">Danh Mục Ngành</span>
              <kbd className="hidden lg:inline-flex text-[10px] opacity-40 font-mono">
                Alt+3
              </kbd>
            </button>

            <button
              onClick={() => setActiveTab("leads")}
              className={`flex items-center space-x-3 px-4.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 group relative ${
                activeTab === "leads"
                  ? "bg-indigo-50/75 border-l-4 border-indigo-600 text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Users
                className={`w-4 h-4 transition ${activeTab === "leads" ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`}
              />
              <span className="flex-1 text-left">Quản trị Khách Hàng</span>
              {leadsCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500 text-white rounded-full scale-90">
                  {leadsCount}
                </span>
              )}
              <kbd className="hidden lg:inline-flex text-[10px] opacity-40 font-mono">
                Alt+4
              </kbd>
            </button>

            <button
              onClick={() => setActiveTab("blog")}
              className={`flex items-center space-x-3 px-4.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 group ${
                activeTab === "blog"
                  ? "bg-indigo-50/75 border-l-4 border-indigo-600 text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <FileText
                className={`w-4 h-4 transition ${activeTab === "blog" ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`}
              />
              <span className="flex-1 text-left">Bài viết SEO Blogs</span>
              <kbd className="hidden lg:inline-flex text-[10px] opacity-40 font-mono">
                Alt+5
              </kbd>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center space-x-3 px-4.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 group ${
                activeTab === "settings"
                  ? "bg-indigo-50/75 border-l-4 border-indigo-600 text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Settings
                className={`w-4 h-4 transition ${activeTab === "settings" ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`}
              />
              <span className="flex-1 text-left">Thiết lập Website</span>
              <kbd className="hidden lg:inline-flex text-[10px] opacity-40 font-mono">
                Alt+6
              </kbd>
            </button>
          </nav>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100">
        {/* Active operator account info */}
        {adminUser && (
          <div className="bg-slate-50 p-3.5 rounded-2xl flex items-center space-x-2.5 mb-4 max-w-full">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 select-none">
              {(adminUser.email || "A").substring(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-xs text-slate-800 truncate leading-tight">
                {adminUser.email}
              </p>
              <div className="inline-flex items-center gap-1.5 py-0.5 px-2 bg-indigo-50 border border-indigo-100 text-[#4f46e5] text-[9px] font-bold uppercase rounded-md tracking-wider mt-1">
                <UserCheck className="w-2.5 h-2.5" />
                <span>{adminUser.role}</span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-3 py-3 text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-xl text-xs font-extrabold transition-all duration-250 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Đăng xuất hệ thống</span>
        </button>
      </div>
    </aside>
  );
}
