import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Loader2, AlertCircle, X } from "lucide-react";
import {
  LandingPage,
  Category,
  Lead,
  BlogPost,
  SiteSetting,
  LeadStatus,
  DashboardStats,
  Notification,
} from "../../types/index.js";

// Custom Premium SaaS 2026 Modular parts
import { AdminSidebar } from "./admin/AdminSidebar";
import { AdminTopbar } from "./admin/AdminTopbar";
import { AdminTabsContent } from "./admin/AdminTabsContent";
import { AdminModals } from "./admin/AdminModals";

interface AdminDashboardViewProps {
  settings: SiteSetting;
  setRefreshSettings: (val: boolean) => void;
  onSettingsSaved?: (settings: SiteSetting) => void;
}

export default function AdminDashboardView({
  settings,
  setRefreshSettings,
  onSettingsSaved,
}: AdminDashboardViewProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "stats" | "lps" | "categories" | "leads" | "blog" | "settings"
  >("stats");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [adminUser, setAdminUser] = useState<any>(null);

  // Lists state
  const [lps, setLps] = useState<LandingPage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationUnreadCount, setNotificationUnreadCount] = useState(0);

  // Token & Headers helper
  const token = localStorage.getItem("vietkey_admin_token");

  // State Modal CRUD
  const [modalType, setModalType] = useState<"lp" | "cat" | "blog" | null>(
    null,
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states inside modal
  const [lpForm, setLpForm] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    thumbnail: "",
    demoUrl: "",
    videoUrl: "",
    categoryId: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });

  const [catForm, setCatForm] = useState({ name: "", slug: "" });

  const [blogForm, setBlogForm] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    thumbnail: "",
    keywordsString: "",
    published: false,
  });

  const createSettingsForm = (source: SiteSetting | any) => ({
    logo: source.logo || "",
    hotline: source.hotline || "",
    email: source.email || "",
    contactEmail: source.contactEmail || "",
    zalo: source.zalo || "",
    facebook: source.facebook || "",
    tiktok: source.tiktok || "",
    youtube: source.youtube || "",
    analytics: source.analytics || "",
    gtm: source.gtm || "",
    brandPrimaryColor: source.brandPrimaryColor || "#9A3412",
    brandSecondaryColor: source.brandSecondaryColor || "#EA580C",
    brandAccentColor: source.brandAccentColor || "#F59E0B",
    brandHeaderColor: source.brandHeaderColor || "#FFFDFC",
    brandFooterColor: source.brandFooterColor || "#0F172A",
    brandButtonColor: source.brandButtonColor || "#9A3412",
    brandTitleColor: source.brandTitleColor || "#3F190F",
    brandFontFamily: source.brandFontFamily || "Inter",
    brandFontSource: source.brandFontSource || "preset",
    brandFontUrl: source.brandFontUrl || "",
  });

  // Settings form - sync with settings from DB
  const [settingsForm, setSettingsForm] = useState(createSettingsForm(settings));

  // Premium UI toast notification states
  const [toasts, setToasts] = useState<
    Array<{ id: string; text: string; type: "success" | "error" | "info" }>
  >([]);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "lp" | "cat" | "lead" | "blog";
    id: string;
    name: string;
  } | null>(null);

  const addToast = (
    text: string,
    type: "success" | "error" | "info" = "success",
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Keyboard Shortcuts binding
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Command Palette on Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }

      // Tab switches on Alt + 1,2,3,4,5,6 (with no modal open)
      if (e.altKey && !modalType && !commandPaletteOpen) {
        if (e.key === "1") {
          e.preventDefault();
          setActiveTab("stats");
        } else if (e.key === "2") {
          e.preventDefault();
          setActiveTab("lps");
        } else if (e.key === "3") {
          e.preventDefault();
          setActiveTab("categories");
        } else if (e.key === "4") {
          e.preventDefault();
          setActiveTab("leads");
        } else if (e.key === "5") {
          e.preventDefault();
          setActiveTab("blog");
        } else if (e.key === "6") {
          e.preventDefault();
          setActiveTab("settings");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalType, commandPaletteOpen]);

  useEffect(() => {
    if (!token) {
      setErrorMsg(
        "Bạn không có quyền truy cập khu vực này. Vui lòng đăng nhập lại.",
      );
      setLoading(false);
      return;
    }

    // Đọc thông tin user
    try {
      const userStr = localStorage.getItem("vietkey_admin_user");
      if (userStr) setAdminUser(JSON.parse(userStr));
    } catch (e) {
      console.error(e);
    }

    loadDashboardData();
  }, [token]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [
        statsRes,
        lpsRes,
        catsRes,
        leadsRes,
        blogsRes,
        notificationsRes,
        unreadRes,
      ] = await Promise.all([
        fetch("/api/dashboard/stats", { headers }),
        fetch("/api/landing-pages"),
        fetch("/api/categories"),
        fetch("/api/leads", { headers }),
        fetch("/api/blog"),
        fetch("/api/notifications", { headers }),
        fetch("/api/notifications/unread-count", { headers }),
      ]);

      if (statsRes.status === 401 || statsRes.status === 403) {
        handleLogout();
        return;
      }

      if (
        statsRes.ok &&
        lpsRes.ok &&
        catsRes.ok &&
        leadsRes.ok &&
        blogsRes.ok
      ) {
        setStats(await statsRes.json());
        setLps(await lpsRes.json());
        setCategories(await catsRes.json());
        setLeads(await leadsRes.json());
        setBlogs(await blogsRes.json());
        if (notificationsRes.ok)
          setNotifications(await notificationsRes.json());
        if (unreadRes.ok) {
          const unreadData = await unreadRes.json();
          setNotificationUnreadCount(unreadData.count || 0);
        }
      }
    } catch (err) {
      console.error("Lỗi lấy thông tin admin:", err);
      setErrorMsg("Không thể tải thông tin từ server.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkNotificationRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) loadDashboardData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      const res = await fetch("/api/notifications/read-all", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) loadDashboardData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) loadDashboardData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("vietkey_admin_token");
    localStorage.removeItem("vietkey_admin_user");
    window.location.href = "/admin/login";
  };

  // Helper upload image local
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            filename: file.name,
            image: base64String,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setter(data.url);
          addToast("Tải ảnh lên thành công!", "success");
        } else {
          addToast("Lỗi tải ảnh lên học bộ.", "error");
        }
      } catch (err) {
        console.error(err);
        addToast("Lỗi kết nối khi tải ảnh lên.", "error");
      }
    };
    reader.readAsDataURL(file);
  };

  // ==========================================
  // CONSOLIDATED DELETION IN PREMIUM UI
  // ==========================================
  const executeConfirmDelete = async () => {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;
    let url = "";
    if (type === "lp") url = `/api/landing-pages/${id}`;
    else if (type === "cat") url = `/api/categories/${id}`;
    else if (type === "lead") url = `/api/leads/${id}`;
    else if (type === "blog") url = `/api/blog/${id}`;

    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        addToast(`Xóa mục thành công!`, "success");
        setDeleteTarget(null);
        loadDashboardData();
      } else {
        const err = await res.json();
        addToast(err.message || "Lỗi xảy ra khi xóa mục.", "error");
      }
    } catch (error) {
      console.error(error);
      addToast("Không thể kết nối đến server.", "error");
    }
  };

  // ==========================================
  // LANDING PAGE HANDLERS (CRUD)
  // ==========================================
  const handleOpenLpModal = (lp: LandingPage | null = null) => {
    if (lp) {
      setEditingId(lp.id);
      setLpForm({
        title: lp.title,
        slug: lp.slug,
        description: lp.description,
        price: lp.price.toString(),
        thumbnail: lp.thumbnail,
        demoUrl: lp.demoUrl,
        videoUrl: lp.videoUrl || "",
        categoryId: lp.categoryId,
        status: lp.status,
      });
    } else {
      setEditingId(null);
      setLpForm({
        title: "",
        slug: "",
        description: "",
        price: "1500000",
        thumbnail:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
        demoUrl: "https://demo.vietkey.vn/",
        videoUrl: "",
        categoryId: categories[0]?.id || "",
        status: "ACTIVE",
      });
    }
    setModalType("lp");
  };

  const handleLpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `/api/landing-pages/${editingId}`
      : "/api/landing-pages";

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(lpForm),
      });
      if (res.ok) {
        addToast(
          editingId
            ? "Cập nhật Landing Page thành công!"
            : "Tạo Landing Page mới thành công!",
          "success",
        );
        setModalType(null);
        loadDashboardData();
      } else {
        const err = await res.json();
        addToast(err.message || "Lỗi khi lưu Landing Page", "error");
      }
    } catch (err) {
      console.error(err);
      addToast("Đường truyền kết nối server thất bại.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLp = (lp: LandingPage) => {
    setDeleteTarget({ type: "lp", id: lp.id, name: lp.title });
  };

  // ==========================================
  // CATEGORIES HANDLERS (CRUD)
  // ==========================================
  const handleOpenCatModal = (cat: Category | null = null) => {
    if (cat) {
      setEditingId(cat.id);
      setCatForm({ name: cat.name, slug: cat.slug });
    } else {
      setEditingId(null);
      setCatForm({ name: "", slug: "" });
    }
    setModalType("cat");
  };

  const handleCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/categories/${editingId}` : "/api/categories";

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(catForm),
      });
      if (res.ok) {
        addToast(
          editingId
            ? "Cập nhật ngành nghề thành công!"
            : "Tạo ngành nghề mới thành công!",
          "success",
        );
        setModalType(null);
        loadDashboardData();
      } else {
        const err = await res.json();
        addToast(err.message || "Lỗi khi lưu danh mục", "error");
      }
    } catch (err) {
      console.error(err);
      addToast("Không phản hồi dữ liệu danh mục.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCat = (cat: Category) => {
    setDeleteTarget({ type: "cat", id: cat.id, name: cat.name });
  };

  // ==========================================
  // LEADS HANDLERS
  // ==========================================
  const handleUpdateLeadStatus = async (id: string, status: LeadStatus) => {
    try {
      const res = await fetch(`/api/leads/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        addToast("Cập nhật trạng thái liên hệ thành công!", "success");
        loadDashboardData();
      }
    } catch (err) {
      console.error(err);
      addToast("Lỗi thay đổi trạng thái liên hệ.", "error");
    }
  };

  const handleDeleteLead = (lead: Lead) => {
    setDeleteTarget({
      type: "lead",
      id: lead.id,
      name: `Yêu cầu từ: ${lead.name}`,
    });
  };

  // ==========================================
  // BLOG HANDLERS (CRUD)
  // ==========================================
  const handleOpenBlogModal = (blog: BlogPost | null = null) => {
    if (blog) {
      setEditingId(blog.id);
      setBlogForm({
        title: blog.title,
        slug: blog.slug,
        description: blog.description,
        content: blog.content,
        thumbnail: blog.thumbnail,
        keywordsString: blog.keywords?.join(", ") || "",
        published: blog.published,
      });
    } else {
      setEditingId(null);
      setBlogForm({
        title: "",
        slug: "",
        description: "",
        content: `## Tiêu đề con\nNội dung chi tiết...\n\n### Tiêu đề phụ\nNhập nội dung ở đây...`,
        thumbnail:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
        keywordsString: "Landing Page, SEO, Marketing",
        published: true,
      });
    }
    setModalType("blog");
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/blog/${editingId}` : "/api/blog";

    const payload = {
      ...blogForm,
      keywords: blogForm.keywordsString
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        addToast(
          editingId
            ? "Đã sửa bài viết SEO Blog thành công!"
            : "Đã tạo bài viết SEO mới thành công!",
          "success",
        );
        setModalType(null);
        loadDashboardData();
      } else {
        const data = await res.json();
        addToast(data.message || "Lỗi lưu trữ bài viết.", "error");
      }
    } catch (err) {
      console.error(err);
      addToast("Mất tín hiệu kết nối bài viết.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBlog = (blog: BlogPost) => {
    setDeleteTarget({ type: "blog", id: blog.id, name: blog.title });
  };

  // ==========================================
  // SETTINGS HANDLERS
  // ==========================================

  // Sync settings form when settings prop changes after save and refetch.
  useEffect(() => {
    setSettingsForm(createSettingsForm(settings));
  }, [settings]);

  const handleOpenSettingsTab = () => {
    setActiveTab("settings");
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settingsForm),
      });
      if (res.ok) {
        const result = await res.json();
        // Cap nhat settingsForm ngay lap tuc voi du lieu tu server
        if (result.settings) {
          setSettingsForm(createSettingsForm(result.settings));
          onSettingsSaved?.(result.settings);
        }
        addToast("Đã lưu các cấu hình website thành công!", "success");
        setRefreshSettings(true); // reload settings global tu DB
      } else {
        const err = await res.json();
        addToast(err.message || "Gặp lỗi khi lưu cài đặt.", "error");
      }
    } catch (err) {
      console.error(err);
      addToast("Kết nối lưu cài đặt thất bại.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // GUARD NOT AUTH
  if (!token) {
    return (
      <div className="pt-36 pb-20 max-w-md mx-auto text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold">Bạn chưa được cấp quyền truy cập</h2>
        <p className="text-sm text-slate-500">
          Khu vực này được bảo mật bằng JWT độc quyền VietKey Staff.
        </p>
        <button
          onClick={() => (window.location.href = "/admin/login")}
          className="px-6 py-2.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-xl text-xs font-bold shadow"
        >
          Đi tới Trang Đăng Nhập
        </button>
      </div>
    );
  }

  return (
    <div
      id="admin-dashboard-view"
      className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800"
    >
      {/* 1. LEFT SIDEBAR COMPONENT */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === "settings") {
            handleOpenSettingsTab();
          } else {
            setActiveTab(tab);
          }
        }}
        adminUser={adminUser}
        handleLogout={handleLogout}
        leadsCount={leads.filter((le) => le.status === "NEW").length}
      />

      {/* 2. BODY GENERAL WRAPPER CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 font-sans">
        {/* TOP PANEL SECTION */}
        <AdminTopbar
          adminUser={adminUser}
          handleLogout={handleLogout}
          onSearchSelect={(tab) => {
            if (tab === "settings") {
              handleOpenSettingsTab();
            } else {
              setActiveTab(tab);
            }
          }}
          openCommandPalette={() => setCommandPaletteOpen(true)}
          lps={lps}
          categories={categories}
          leads={leads}
          blogs={blogs}
          notifications={notifications}
          notificationUnreadCount={notificationUnreadCount}
          onNotificationRead={handleMarkNotificationRead}
          onNotificationsReadAll={handleMarkAllNotificationsRead}
          onNotificationDelete={handleDeleteNotification}
        />

        {/* CONTAINER CONTENT VIEW */}
        <main className="flex-1 p-8 max-w-[1600px] w-full mx-auto space-y-8 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-36 space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-650" />
              <p className="text-slate-500 text-xs font-bold font-mono uppercase tracking-wider animate-pulse">
                {" "}
                Đồng bộ cơ sở dữ liệu cloud...
              </p>
            </div>
          ) : (
            <AdminTabsContent
              activeTab={activeTab}
              stats={stats}
              lps={lps}
              categories={categories}
              leads={leads}
              blogs={blogs}
              settings={settings}
              handleOpenLpModal={handleOpenLpModal}
              handleDeleteLp={handleDeleteLp}
              handleOpenCatModal={handleOpenCatModal}
              handleDeleteCat={handleDeleteCat}
              handleUpdateLeadStatus={handleUpdateLeadStatus}
              handleDeleteLead={handleDeleteLead}
              handleOpenBlogModal={handleOpenBlogModal}
              handleDeleteBlog={handleDeleteBlog}
              settingsForm={settingsForm}
              setSettingsForm={setSettingsForm}
              handleImageUpload={handleImageUpload}
              handleSettingsSubmit={handleSettingsSubmit}
              submitting={submitting}
              addToast={addToast}
            />
          )}
        </main>
      </div>

      {/* ========================================================
          3. FULLY UPGRADED CRM AND LP DIALOG CREATOR MODALS
         ======================================================== */}
      {modalType !== null && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto select-none animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl relative p-6 md:p-8 animate-scale-up max-h-[90vh] overflow-y-auto border border-slate-200">
            {/* Modal close icon */}
            <button
              type="button"
              onClick={() => setModalType(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-650 hover:bg-slate-50 rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* ==================== FORM CHỈNH MẪU LANDING PAGE ==================== */}
            {modalType === "lp" && (
              <form
                onSubmit={handleLpSubmit}
                className="space-y-5 text-xs text-slate-705 font-bold"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">
                    Form Sản Phẩm
                  </span>
                  <h3 className="text-base font-black text-slate-900 leading-none">
                    {editingId
                      ? "Cập nhật tài nguyên Mẫu Landing Page"
                      : "Phát hành mẫu Landing Page Mới"}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-500">
                      Tiêu đề mẫu quảng cáo *
                    </label>
                    <input
                      type="text"
                      required
                      value={lpForm.title}
                      onChange={(e) =>
                        setLpForm({ ...lpForm, title: e.target.value })
                      }
                      className="w-full p-2.5 bg-slate-50 focus:bg-white border focus:border-indigo-500 focus:outline-none rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-500">
                      {" "}
                      Định danh đường dẫn Slug URL *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="spa-organic-landing-page"
                      value={lpForm.slug}
                      onChange={(e) =>
                        setLpForm({ ...lpForm, slug: e.target.value })
                      }
                      className="w-full p-2.5 bg-slate-50 focus:bg-white border focus:border-indigo-500 focus:outline-none rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500">
                    Mô tả và điểm mạnh sản phẩm
                  </label>
                  <textarea
                    rows={2}
                    value={lpForm.description}
                    onChange={(e) =>
                      setLpForm({ ...lpForm, description: e.target.value })
                    }
                    className="w-full p-2.5 bg-slate-50 focus:bg-white border focus:border-indigo-500 focus:outline-none rounded-xl font-normal leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-500">
                      {" "}
                      Đơn giá trọn gói thiết kế hiển thị (VND) *
                    </label>
                    <input
                      type="number"
                      required
                      value={lpForm.price}
                      onChange={(e) =>
                        setLpForm({ ...lpForm, price: e.target.value })
                      }
                      className="w-full p-2.5 bg-slate-50 focus:bg-white border focus:border-indigo-500 focus:outline-none rounded-xl font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-500">
                      Phân ngành danh mục mẫu *
                    </label>
                    <select
                      value={lpForm.categoryId}
                      onChange={(e) =>
                        setLpForm({ ...lpForm, categoryId: e.target.value })
                      }
                      className="w-full p-2.5 bg-slate-50 border rounded-xl focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-500">
                      Liên kết dùng thử khách xem (Demo URL) *
                    </label>
                    <input
                      type="url"
                      required
                      value={lpForm.demoUrl}
                      onChange={(e) =>
                        setLpForm({ ...lpForm, demoUrl: e.target.value })
                      }
                      className="w-full p-2.5 bg-slate-50 focus:bg-white border focus:border-indigo-500 focus:outline-none rounded-xl font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-500">
                      Liên kết Video MP4 giới thiệu (Nếu có)
                    </label>
                    <input
                      type="text"
                      placeholder="https://"
                      value={lpForm.videoUrl}
                      onChange={(e) =>
                        setLpForm({ ...lpForm, videoUrl: e.target.value })
                      }
                      className="w-full p-2.5 bg-slate-50 focus:bg-white border focus:border-indigo-500 focus:outline-none rounded-xl font-mono"
                    />
                  </div>
                </div>

                {/* Local image drag upload */}
                <div className="space-y-2 border border-dashed border-slate-200 p-4 rounded-2xl bg-slate-50/50">
                  <label className="text-slate-600 flex items-center space-x-1.5 cursor-pointer">
                    <span>Upload ảnh đại diện (Thumbnail URL) trực tiếp</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageUpload(e, (url) =>
                        setLpForm({ ...lpForm, thumbnail: url }),
                      )
                    }
                    className="text-[11px]"
                  />
                  {lpForm.thumbnail && (
                    <div className="mt-2 h-16 w-28 rounded-lg overflow-hidden border">
                      <img
                        src={lpForm.thumbnail}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Active model checkbox */}
                <div className="flex gap-6 items-center pt-2">
                  <span className="text-slate-500">
                    Trạng thái phát hành ngoài trang:
                  </span>
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="lp-status"
                      checked={lpForm.status === "ACTIVE"}
                      onChange={() =>
                        setLpForm({ ...lpForm, status: "ACTIVE" })
                      }
                      className="text-indigo-600 focus:ring-0"
                    />
                    <span className="text-emerald-600">HOẠT ĐỘNG</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="lp-status"
                      checked={lpForm.status === "INACTIVE"}
                      onChange={() =>
                        setLpForm({ ...lpForm, status: "INACTIVE" })
                      }
                      className="text-indigo-600 focus:ring-0"
                    />
                    <span className="text-slate-400">ẨN LƯU TRỮ</span>
                  </label>
                </div>

                <div className="pt-4 border-t flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-150 text-white rounded-xl shadow-lg transition disabled:opacity-40 select-none cursor-pointer text-xs font-bold font-mono"
                  >
                    {submitting
                      ? " Đang tiến hành..."
                      : editingId
                        ? "CẬP NHẬT MẪU"
                        : "PHÁT HÀNH NGAY"}
                  </button>
                </div>
              </form>
            )}

            {/* ==================== FORM DANH MỤC (CRUD CAT) ==================== */}
            {modalType === "cat" && (
              <form
                onSubmit={handleCatSubmit}
                className="space-y-4 text-xs text-slate-705 font-bold"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">
                    Ngành Nghề Chuyên Môn
                  </span>
                  <h3 className="text-base font-black text-slate-900 leading-none">
                    {editingId
                      ? "Thay đổi danh mục phân tách"
                      : "Tạo danh mục ngành nghề mới"}
                  </h3>
                </div>

                <div className="space-y-1.5 pt-4">
                  <label className="text-slate-500">Tên chuyên ngành *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Bất Động Sản, Nha Khoa..."
                    value={catForm.name}
                    onChange={(e) =>
                      setCatForm({ ...catForm, name: e.target.value })
                    }
                    className="w-full p-2.5 bg-slate-50 focus:bg-white border focus:border-indigo-550 focus:outline-none rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500">
                    {" "}
                    Định danh hiển thị URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="bat-dong-san"
                    value={catForm.slug}
                    onChange={(e) =>
                      setCatForm({ ...catForm, slug: e.target.value })
                    }
                    className="w-full p-2.5 bg-slate-50 focus:bg-white border focus:border-indigo-550 focus:outline-none rounded-xl font-mono"
                  />
                </div>

                <div className="pt-4 border-t flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow font-bold text-xs"
                  >
                    LƯU DANH MỤC
                  </button>
                </div>
              </form>
            )}

            {/* ==================== FORM VIẾT BLOG SEO ==================== */}
            {modalType === "blog" && (
              <form
                onSubmit={handleBlogSubmit}
                className="space-y-5 text-xs text-slate-705 font-bold"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">
                    Social SEO Suite
                  </span>
                  <h3 className="text-base font-black text-slate-900 leading-none">
                    {editingId
                      ? "Cập nhật bài viết truyền thông"
                      : "Soạn thảo bài viết truyền thông mới"}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-500">
                      Tiêu đề bài viết tin tức *
                    </label>
                    <input
                      type="text"
                      required
                      value={blogForm.title}
                      onChange={(e) =>
                        setBlogForm({ ...blogForm, title: e.target.value })
                      }
                      className="w-full p-2.5 bg-slate-50 focus:bg-white border focus:border-indigo-550 focus:outline-none rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-500">
                      Liên kết URL Slug tối ưu *
                    </label>
                    <input
                      type="text"
                      required
                      value={blogForm.slug}
                      onChange={(e) =>
                        setBlogForm({ ...blogForm, slug: e.target.value })
                      }
                      className="w-full p-2.5 bg-slate-50 focus:bg-white border focus:border-indigo-550 focus:outline-none rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500">
                    Từ khóa SEO (Ngăn cách bởi dấu phẩy)
                  </label>
                  <input
                    type="text"
                    placeholder="Landing Page, Marketing bán hàng, Quảng cáo..."
                    value={blogForm.keywordsString}
                    onChange={(e) =>
                      setBlogForm({
                        ...blogForm,
                        keywordsString: e.target.value,
                      })
                    }
                    className="w-full p-2.5 bg-slate-50 focus:bg-white border focus:border-indigo-550 focus:outline-none rounded-xl font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500">
                    Mô tả tóm tắt liên kết (Meta Description) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={blogForm.description}
                    onChange={(e) =>
                      setBlogForm({ ...blogForm, description: e.target.value })
                    }
                    className="w-full p-2.5 bg-slate-50 focus:bg-white border focus:border-indigo-550 focus:outline-none rounded-xl font-normal leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500">
                    Nội dung văn bản chi tiết (Hỗ trợ Markdown) *
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={blogForm.content}
                    onChange={(e) =>
                      setBlogForm({ ...blogForm, content: e.target.value })
                    }
                    className="w-full p-2.5 bg-slate-50 focus:bg-white border focus:border-indigo-550 focus:outline-none rounded-xl font-mono font-normal leading-normal text-[11px]"
                  />
                </div>

                {/* Upload Thumbnail local */}
                <div className="space-y-2 border border-dashed border-slate-200 p-4 rounded-xl bg-slate-50/50">
                  <label className="text-slate-600 flex items-center space-x-1.5 cursor-pointer">
                    <span>Upload ảnh đại diện bài viết</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageUpload(e, (url) =>
                        setBlogForm({ ...blogForm, thumbnail: url }),
                      )
                    }
                    className="text-[11px]"
                  />
                  {blogForm.thumbnail && (
                    <div className="mt-2 h-16 w-28 rounded-lg overflow-hidden border">
                      <img
                        src={blogForm.thumbnail}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Published check */}
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="published-chk"
                    checked={blogForm.published}
                    onChange={(e) =>
                      setBlogForm({ ...blogForm, published: e.target.checked })
                    }
                    className="rounded border-slate-300 h-4 w-4 text-indigo-650 cursor-pointer focus:ring-0"
                  />
                  <label
                    htmlFor="published-chk"
                    className="text-slate-700 cursor-pointer"
                  >
                    Công khai hiển thị ngoài trang tin của VietKey ngay lập tức
                  </label>
                </div>

                <div className="pt-4 border-t flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow text-xs font-bold"
                  >
                    {submitting ? " ĐANG LƯU..." : "PHÁT HÀNH BÀI VIẾT"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          4. MODALS OVERLAYS (TOASTS, COMMAND PALETTE, DELETES)
         ======================================================== */}
      <AdminModals
        toasts={toasts}
        setToasts={setToasts}
        deleteTarget={deleteTarget}
        setDeleteTarget={setDeleteTarget}
        onConfirmDelete={executeConfirmDelete}
        commandPaletteOpen={commandPaletteOpen}
        setCommandPaletteOpen={setCommandPaletteOpen}
        setActiveTab={setActiveTab}
        handleLogout={handleLogout}
      />
    </div>
  );
}
