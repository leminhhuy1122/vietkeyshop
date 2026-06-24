import React, { useState } from "react";
import {
  Search,
  Bell,
  Command,
  HelpCircle,
  Sparkles,
  ChevronDown,
  User,
  LogOut,
  Moon,
  Sun,
  LayoutDashboard,
} from "lucide-react";

interface AdminTopbarProps {
  adminUser: any;
  handleLogout: () => void;
  onSearchSelect: (
    tab: "lps" | "categories" | "leads" | "blog" | "settings",
  ) => void;
  openCommandPalette: () => void;
  lps: any[];
  categories: any[];
  leads: any[];
  blogs: any[];
  notifications: any[];
  notificationUnreadCount: number;
  onNotificationRead: (id: string) => void;
  onNotificationsReadAll: () => void;
}

export function AdminTopbar({
  adminUser,
  handleLogout,
  onSearchSelect,
  openCommandPalette,
  lps,
  categories,
  leads,
  blogs,
  notifications,
  notificationUnreadCount,
  onNotificationRead,
  onNotificationsReadAll,
}: AdminTopbarProps) {
  const [globalSearch, setGlobalSearch] = useState("");
  const [showNotificationList, setShowNotificationList] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Filter matched items across pages
  const matchLp = globalSearch
    ? lps
        .filter((l) =>
          l.title.toLowerCase().includes(globalSearch.toLowerCase()),
        )
        .slice(0, 3)
    : [];
  const matchCat = globalSearch
    ? categories
        .filter((c) =>
          c.name.toLowerCase().includes(globalSearch.toLowerCase()),
        )
        .slice(0, 3)
    : [];
  const matchLead = globalSearch
    ? leads
        .filter(
          (le) =>
            le.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
            (le.phone && le.phone.includes(globalSearch)),
        )
        .slice(0, 3)
    : [];
  const matchBlog = globalSearch
    ? blogs
        .filter((b) =>
          b.title.toLowerCase().includes(globalSearch.toLowerCase()),
        )
        .slice(0, 3)
    : [];

  const hasResults =
    matchLp.length > 0 ||
    matchCat.length > 0 ||
    matchLead.length > 0 ||
    matchBlog.length > 0;

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4.5 flex items-center justify-between select-none">
      {/* 1. Global Search Box with system search dropdown */}
      <div className="relative w-96 hidden md:block">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm mẫu, khách hàng, SEO blog... (Ctrl+K)"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="w-full pl-10 pr-12 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 border border-slate-200 hover:border-slate-350 focus:border-indigo-500 focus:outline-none rounded-xl transition-all"
          />
          <div
            onClick={openCommandPalette}
            className="absolute right-3.5 flex items-center space-x-0.5 px-1.5 py-0.5 bg-slate-200/60 hover:bg-slate-200 text-[10px] font-mono font-bold text-slate-500 rounded cursor-pointer select-none"
          >
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </div>

        {/* Global Match Search Dropdown */}
        {globalSearch && (
          <div className="absolute top-12 left-0 w-full bg-white border border-slate-200 p-3 rounded-2xl shadow-xl z-50 overflow-hidden leading-tight animate-fade-in-up">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-150">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Kết quả tìm thấy
              </span>
              <button
                onClick={() => setGlobalSearch("")}
                className="text-slate-400 hover:text-slate-600 text-[10px] font-bold"
              >
                Xóa
              </button>
            </div>

            {!hasResults ? (
              <div className="p-4 text-center text-slate-400 text-xs font-semibold">
                Không tìm thấy thông tin nào phù hợp.
              </div>
            ) : (
              <div className="space-y-3.5 max-h-80 overflow-y-auto pr-1">
                {matchLp.length > 0 && (
                  <div>
                    <p className="text-[9px] font-bold uppercase text-indigo-500 tracking-wider mb-1">
                      Mẫu Landing Pages
                    </p>
                    {matchLp.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          onSearchSelect("lps");
                          setGlobalSearch("");
                        }}
                        className="p-1.5 hover:bg-slate-50 rounded-lg text-xs font-medium text-slate-700 cursor-pointer transition flex items-center justify-between"
                      >
                        <span className="truncate max-w-[200px]">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {item.price.toLocaleString()}đ
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {matchLead.length > 0 && (
                  <div>
                    <p className="text-[9px] font-bold uppercase text-emerald-500 tracking-wider mb-1">
                      Khách Hàng (Leads)
                    </p>
                    {matchLead.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          onSearchSelect("leads");
                          setGlobalSearch("");
                        }}
                        className="p-1.5 hover:bg-slate-50 rounded-lg text-xs font-medium text-slate-700 cursor-pointer transition flex items-center justify-between"
                      >
                        <span className="truncate">{item.name}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded uppercase">
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {matchBlog.length > 0 && (
                  <div>
                    <p className="text-[9px] font-bold uppercase text-amber-500 tracking-wider mb-1">
                      Blogs/Tin tức
                    </p>
                    {matchBlog.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          onSearchSelect("blog");
                          setGlobalSearch("");
                        }}
                        className="p-1.5 hover:bg-slate-50 rounded-lg text-xs font-medium text-slate-700 cursor-pointer transition flex items-center justify-between"
                      >
                        <span className="truncate max-w-[220px]">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400">SEO</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 md:flex-none" />

      {/* 2. Toolkits & Badges */}
      <div className="flex items-center space-x-4">
        {/* Help button */}
        <button
          onClick={openCommandPalette}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition cursor-pointer"
          title="Trợ giúp / Phím tắt"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Dynamic notifications bar with database events */}
        <div className="relative">
          <button
            onClick={() => setShowNotificationList(!showNotificationList)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl relative transition cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {notificationUnreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {showNotificationList && (
            <div className="absolute right-0 top-11 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden text-left leading-normal animate-fade-in-up">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-xs">
                  Thông báo vận hành
                </span>
                <span className="text-[9px] bg-indigo-50 text-indigo-600 font-bold px-1.5 py-0.5 rounded">
                  {notificationUnreadCount} Mới
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 font-semibold">
                    Chưa có thông báo nào.
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() =>
                        !item.isRead && onNotificationRead(item.id)
                      }
                      className="p-3.5 hover:bg-slate-50 transition cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        <span
                          className={`w-2 h-2 rounded-full ${item.isRead ? "bg-slate-300" : "bg-indigo-600"}`}
                        />
                        <span>{item.title}</span>
                      </div>
                      <p className="text-slate-500 text-[10px] mt-1">
                        {item.message}
                      </p>
                      <span className="text-[9px] text-slate-400 mt-1 block">
                        {new Date(item.createdAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <div
                onClick={() => {
                  onNotificationsReadAll();
                  setShowNotificationList(false);
                }}
                className="bg-slate-50 px-4 py-2.5 text-center text-[10px] font-bold text-indigo-600 hover:text-indigo-700 transition cursor-pointer block border-t border-slate-100"
              >
                Đánh dấu đã đọc tất cả
              </div>
            </div>
          )}
        </div>

        {/* Profile indicator drop */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 p-1.5 hover:bg-slate-50 rounded-xl transition cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-black text-xs flex items-center justify-center border border-indigo-200">
              {adminUser ? adminUser.email.substring(0, 1).toUpperCase() : "A"}
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-11 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden text-left text-xs animate-fade-in-up">
              <div className="p-3.5 border-b border-slate-100 bg-slate-50/50">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Tài khoản
                </p>
                <p className="font-extrabold text-[#111827] mt-0.5 truncate">
                  {adminUser ? adminUser.email : "Staff"}
                </p>
              </div>
              <div className="p-1">
                <button
                  onClick={openCommandPalette}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg flex items-center space-x-2"
                >
                  <Command className="w-3.5 h-3.5 text-slate-400" />
                  <span>Phím tắt hệ thống</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-500 font-bold rounded-lg flex items-center space-x-2 border border-transparent"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
