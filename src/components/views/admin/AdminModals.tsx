import React, { useState, useEffect } from "react";
import {
  X,
  AlertTriangle,
  Command,
  Search,
  LayoutDashboard,
  Layers,
  Tag,
  Users,
  FileText,
  Settings,
  HelpCircle,
  Bell,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface AdminModalsProps {
  // Toasts
  toasts: Array<{
    id: string;
    text: string;
    type: "success" | "error" | "info";
  }>;
  setToasts: React.Dispatch<
    React.SetStateAction<
      Array<{ id: string; text: string; type: "success" | "error" | "info" }>
    >
  >;

  // Deletion targets
  deleteTarget: {
    type: "lp" | "cat" | "lead" | "blog";
    id: string;
    name: string;
  } | null;
  setDeleteTarget: (target: null) => void;
  onConfirmDelete: () => void;

  // Command Palette
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  setActiveTab: (
    tab: "stats" | "lps" | "categories" | "leads" | "blog" | "settings",
  ) => void;
  handleLogout: () => void;
}

export function AdminModals({
  toasts,
  setToasts,
  deleteTarget,
  setDeleteTarget,
  onConfirmDelete,
  commandPaletteOpen,
  setCommandPaletteOpen,
  setActiveTab,
  handleLogout,
}: AdminModalsProps) {
  const [paletteQuery, setPaletteQuery] = useState("");

  const shortcutActions = [
    {
      label: "Bảng tin thống kê vận hành",
      tab: "stats" as const,
      shortcut: "Alt + 1",
      icon: LayoutDashboard,
    },
    {
      label: "Mở kho mẫu thiết kế Landing Pages",
      tab: "lps" as const,
      shortcut: "Alt + 2",
      icon: Layers,
    },
    {
      label: "Mở danh mục ngành nghề chuyên môn",
      tab: "categories" as const,
      shortcut: "Alt + 3",
      icon: Tag,
    },
    {
      label: "Quản trị danh sách khách hàng (CRM)",
      tab: "leads" as const,
      shortcut: "Alt + 4",
      icon: Users,
    },
    {
      label: "Viết tin SEO, Blogs quảng bá",
      tab: "blog" as const,
      shortcut: "Alt + 5",
      icon: FileText,
    },
    {
      label: "Cấu hình Logo, Tracking SEO, Web settings",
      tab: "settings" as const,
      shortcut: "Alt + 6",
      icon: Settings,
    },
  ];

  const matchedActions = paletteQuery
    ? shortcutActions.filter((act) =>
        act.label.toLowerCase().includes(paletteQuery.toLowerCase()),
      )
    : shortcutActions;

  return (
    <>
      {/* ==========================================
          1. PREMIUM GORGEOUS TOASTS FEEDBACK
          ========================================== */}
      <div className="fixed top-6 right-6 z-55 space-y-3.5 max-w-sm w-full select-none pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-2xl shadow-xl border flex items-start space-x-3 pointer-events-auto animate-slide-in-right ${
              toast.type === "success"
                ? "bg-white text-slate-800 border-slate-100 shadow-emerald-100/40"
                : toast.type === "error"
                  ? "bg-rose-50 text-rose-800 border-rose-100 shadow-rose-100/30"
                  : "bg-white text-slate-800 border-slate-100 shadow-indigo-100/40"
            }`}
          >
            {toast.type === "success" && (
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            )}
            {toast.type === "error" && (
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            )}
            {toast.type === "info" && (
              <Command
                className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5 animate-spin"
                style={{ animationDuration: "3s" }}
              />
            )}
            <div className="flex-1 text-xs font-semibold leading-relaxed">
              {toast.text}
            </div>
            <button
              onClick={() =>
                setToasts((prev) => prev.filter((t) => t.id !== toast.id))
              }
              className="text-slate-450 hover:text-slate-650 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* ==========================================
          2. STATE-BASED CONFIRM DELETE MODAL
          ========================================== */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-fade-in">
          <div className="bg-white border rounded-3xl max-w-md w-full shadow-2xl overflow-hidden p-6 space-y-6 animate-scale-up">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-rose-500" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 text-sm">
                  Xác nhận xóa tài nguyên này?
                </h3>
                <p className="text-[11px] text-slate-500">
                  Thao tác này hoàn toàn không thể thu hồi lại trên hệ thống.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border text-xs leading-relaxed">
              Bạn có chắc chắn muốn xóa:{" "}
              <span className="font-extrabold text-slate-900 underline select-all">
                {deleteTarget.name}
              </span>
              ? Dữ liệu liên kết CDN, SQL và File Storage sẽ được dọn sạch hoàn
              toàn.
            </div>

            <div className="flex items-center space-x-3 justify-end text-xs font-bold font-mono">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border rounded-xl hover:bg-slate-50 text-slate-600 font-bold transition cursor-pointer"
              >
                HỦY BỎ
              </button>
              <button
                onClick={() => {
                  onConfirmDelete();
                }}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 hover:shadow-rose-150 text-white rounded-xl font-bold shadow-lg shadow-rose-100 transition active:scale-95 cursor-pointer"
              >
                XÁC NHẬN XÓA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          3. COMMAND PALETTE SEARCH MODAL (Ctrl+K)
          ========================================== */}
      {commandPaletteOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 select-none pt-24 animate-fade-in">
          <div className="bg-white border text-slate-800 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-scale-up">
            {/* Input query palette */}
            <div className="p-4.5 border-b border-slate-150 flex items-center space-x-3.5">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={paletteQuery}
                onChange={(e) => setPaletteQuery(e.target.value)}
                placeholder="Nhập từ khóa tìm nhanh chức năng hoặc tab thao tác..."
                className="w-full bg-transparent focus:outline-none text-slate-900 text-xs font-bold placeholder:text-slate-400"
              />
              <button
                onClick={() => setCommandPaletteOpen(false)}
                className="p-1 px-2 border hover:bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold"
              >
                ESC
              </button>
            </div>

            {/* Quick choices list */}
            <div className="max-h-72 overflow-y-auto p-2 space-y-1">
              <p className="px-3 py-1.5 text-[9px] font-black uppercase text-slate-450 tracking-wider">
                Hành trình chuyển đổi nhanh
              </p>

              {matchedActions.length === 0 ? (
                <p className="p-4 text-center text-xs text-slate-400">
                  Không có kết quả nào thích hợp.
                </p>
              ) : (
                matchedActions.map((ai) => {
                  const ToolIcon = ai.icon;
                  return (
                    <div
                      key={ai.tab}
                      onClick={() => {
                        setActiveTab(ai.tab);
                        setCommandPaletteOpen(false);
                      }}
                      className="p-3 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-705 flex items-center justify-between cursor-pointer transition"
                    >
                      <div className="flex items-center space-x-3">
                        <ToolIcon className="w-4.5 h-4.5 text-slate-400" />
                        <span>{ai.label}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                        {ai.shortcut}
                      </span>
                    </div>
                  );
                })
              )}

              <p className="px-3 py-2 border-t border-slate-100 text-[9px] font-black uppercase text-slate-450 tracking-wider mt-2">
                Staff shortcuts
              </p>
              <div
                onClick={() => {
                  handleLogout();
                  setCommandPaletteOpen(false);
                }}
                className="p-3 hover:bg-rose-50 rounded-xl text-xs font-bold text-rose-500 flex items-center justify-between cursor-pointer transition"
              >
                <div className="flex items-center space-x-3">
                  <Command className="w-4.5 h-4.5 text-rose-400" />
                  <span>Đăng xuất tài khoản VietKey Staff</span>
                </div>
                <span className="text-[10px] text-rose-400 font-mono font-bold">
                  Logout
                </span>
              </div>
            </div>

            <div className="bg-slate-50 px-4 py-3 flex items-center justify-between border-t text-[10px] text-slate-500 select-none">
              <span className="font-semibold flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" /> Alt + số (1-6) để chuyển
                nhanh bất kỳ lúc nào
              </span>
              <span>VietKey SaaS 2026</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
