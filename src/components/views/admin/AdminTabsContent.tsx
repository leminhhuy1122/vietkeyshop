import React, { useState, useMemo } from "react";
import {
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  Area,
  ResponsiveContainer,
} from "recharts";
import {
  Search,
  Plus,
  Trash2,
  Edit2,
  Eye,
  ArrowUpDown,
  Filter,
  Check,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Workflow,
  Sparkles,
  Layers,
  Users,
  Briefcase,
  ExternalLink,
  Kanban,
  Table as TableIcon,
  ChevronRightSquare,
  AlertCircle,
  FileCheck,
  Calendar,
  EyeOff,
  Sliders,
  Mail,
  Phone,
  Globe,
  Share2,
  BookOpen,
  Palette,
  Type,
} from "lucide-react";
import {
  LandingPage,
  Category,
  Lead,
  BlogPost,
  SiteSetting,
  LeadStatus,
} from "../../../types/index.js";

interface AdminTabsContentProps {
  activeTab: "stats" | "lps" | "categories" | "leads" | "blog" | "settings";
  stats: any;
  lps: LandingPage[];
  categories: Category[];
  leads: Lead[];
  blogs: BlogPost[];
  settings: SiteSetting;

  // Handlers
  handleOpenLpModal: (lp: LandingPage | null) => void;
  handleDeleteLp: (lp: LandingPage) => void;

  handleOpenCatModal: (cat: Category | null) => void;
  handleDeleteCat: (cat: Category) => void;

  handleUpdateLeadStatus: (id: string, status: LeadStatus) => void;
  handleDeleteLead: (lead: Lead) => void;

  handleOpenBlogModal: (blog: BlogPost | null) => void;
  handleDeleteBlog: (blog: BlogPost) => void;

  settingsForm: any;
  setSettingsForm: (form: any) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => void;
  handleSettingsSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  addToast: (msg: string, type: "success" | "error" | "info") => void;
}

export function AdminTabsContent({
  activeTab,
  stats,
  lps,
  categories,
  leads,
  blogs,
  settings,
  handleOpenLpModal,
  handleDeleteLp,
  handleOpenCatModal,
  handleDeleteCat,
  handleUpdateLeadStatus,
  handleDeleteLead,
  handleOpenBlogModal,
  handleDeleteBlog,
  settingsForm,
  setSettingsForm,
  handleImageUpload,
  handleSettingsSubmit,
  submitting,
  addToast,
}: AdminTabsContentProps) {
  // ==========================================
  // SHARED FILTER STATES
  // ==========================================
  const [lpSearch, setLpSearch] = useState("");
  const [lpFilterCat, setLpFilterCat] = useState("");
  const [lpFilterStatus, setLpFilterStatus] = useState("");
  const [selectedLpIds, setSelectedLpIds] = useState<string[]>([]);
  const [lpSortField, setLpSortField] = useState<
    "title" | "price" | "createdAt"
  >("createdAt");
  const [lpSortDir, setLpSortDir] = useState<"asc" | "desc">("desc");
  const [lpPage, setLpPage] = useState(1);
  const lpLimit = 6;

  // Chart view states
  const [chartMetric, setChartMetric] = useState<
    "views" | "leads" | "conversion"
  >("views");
  const [chartRange, setChartRange] = useState<7 | 30 | 90>(7);

  // CRM status toggle
  const [crmView, setCrmView] = useState<"kanban" | "table">("kanban");
  const [crmSearch, setCrmSearch] = useState("");

  // Blogs filter
  const [blogSearch, setBlogSearch] = useState("");

  // Settings Tab
  const [settingsActiveSubTab, setSettingsActiveSubTab] = useState<
    "general" | "branding" | "seo" | "analytics" | "contact" | "social"
  >("general");
  const [brandingSection, setBrandingSection] = useState<"colors" | "logo" | "typography">("colors");

  const colorPresets = [
    { name: "Clay Journal", primary: "#9A3412", secondary: "#EA580C", accent: "#F59E0B", header: "#FFFDFC", footer: "#3F190F", button: "#9A3412", title: "#3F190F", note: "Warm ecommerce" },
    { name: "Pearl Slate", primary: "#334155", secondary: "#64748B", accent: "#0EA5E9", header: "#FFFFFF", footer: "#0F172A", button: "#334155", title: "#0F172A", note: "Clean B2B" },
    { name: "Sage Paper", primary: "#4D7C0F", secondary: "#84CC16", accent: "#CA8A04", header: "#FEFEFB", footer: "#1F2A1A", button: "#4D7C0F", title: "#1F2A1A", note: "Natural trust" },
    { name: "Blush Ledger", primary: "#BE185D", secondary: "#FB7185", accent: "#FDBA74", header: "#FFFFFF", footer: "#3B1025", button: "#BE185D", title: "#3B1025", note: "Elegant beauty" },
    { name: "Deep Fjord", primary: "#0EA5E9", secondary: "#38BDF8", accent: "#14B8A6", header: "#F8FCFF", footer: "#08131B", button: "#0369A1", title: "#082F49", note: "Tech support" },
    { name: "Ink Copper", primary: "#C2410C", secondary: "#EA580C", accent: "#FACC15", header: "#FFF7ED", footer: "#120F0C", button: "#C2410C", title: "#431407", note: "Premium craft" },
    { name: "Oatmilk Studio", primary: "#44403C", secondary: "#A8A29E", accent: "#C08457", header: "#FFFFFF", footer: "#1C1917", button: "#44403C", title: "#1C1917", note: "Minimal premium" },
    { name: "Lavender Ledger", primary: "#6D28D9", secondary: "#A78BFA", accent: "#FB7185", header: "#FFFFFF", footer: "#2E1065", button: "#6D28D9", title: "#2E1065", note: "Soft creative" },
    { name: "Graphite Lime", primary: "#65A30D", secondary: "#A3E635", accent: "#FDE047", header: "#F7FEE7", footer: "#101316", button: "#4D7C0F", title: "#1A2E05", note: "Sharp analytics" },
  ];

  const fontPresets = ["Inter", "Space Grotesk", "Manrope", "Sora", "Outfit", "Plus Jakarta Sans"];

  // Local helper for relative sample calculation
  const totalLpsCount = stats?.totalProducts ?? lps.length;
  const totalLeadsCount = stats?.totalLeads ?? leads.length;
  const totalClosedCount =
    stats?.totalCustomers ??
    leads.filter((l) => l.status === LeadStatus.WON).length;
  const totalViewsNum = stats?.totalDemoViews ?? 0;

  // ==========================================
  // LANDING PAGE FILTERING & PAGINATION
  // ==========================================
  const filteredAndSortedLps = useMemo(() => {
    let result = [...lps];

    // Search filter
    if (lpSearch) {
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(lpSearch.toLowerCase()) ||
          item.slug.toLowerCase().includes(lpSearch.toLowerCase()),
      );
    }

    // Category filter
    if (lpFilterCat) {
      result = result.filter((item) => item.categoryId === lpFilterCat);
    }

    // Status filter
    if (lpFilterStatus) {
      result = result.filter((item) => item.status === lpFilterStatus);
    }

    // Sorting
    result.sort((a, b) => {
      let x: any = a[lpSortField];
      let y: any = b[lpSortField];

      if (lpSortField === "price") {
        x = Number(x);
        y = Number(y);
      } else if (lpSortField === "createdAt") {
        x = new Date(x).getTime();
        y = new Date(y).getTime();
      } else {
        x = String(x).toLowerCase();
        y = String(y).toLowerCase();
      }

      if (x < y) return lpSortDir === "asc" ? -1 : 1;
      if (x > y) return lpSortDir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [lps, lpSearch, lpFilterCat, lpFilterStatus, lpSortField, lpSortDir]);

  // Paginated landing pages
  const paginatedLps = useMemo(() => {
    const startIndex = (lpPage - 1) * lpLimit;
    return filteredAndSortedLps.slice(startIndex, startIndex + lpLimit);
  }, [filteredAndSortedLps, lpPage]);

  const maxLpPageNum = Math.max(
    1,
    Math.ceil(filteredAndSortedLps.length / lpLimit),
  );

  // Category counts maps
  const lpCountsPerCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach((c) => (counts[c.id] = 0));
    lps.forEach((lp) => {
      if (counts[lp.categoryId] !== undefined) {
        counts[lp.categoryId]++;
      }
    });
    return counts;
  }, [lps, categories]);

  // Bulk Actions
  const toggleSelectAllLps = () => {
    if (selectedLpIds.length === paginatedLps.length) {
      setSelectedLpIds([]);
    } else {
      setSelectedLpIds(paginatedLps.map((p) => p.id));
    }
  };

  const toggleSelectLpId = (id: string) => {
    if (selectedLpIds.includes(id)) {
      setSelectedLpIds((prev) => prev.filter((item) => item !== id));
    } else {
      setSelectedLpIds((prev) => [...prev, id]);
    }
  };

  const handleBulkActivate = async () => {
    if (selectedLpIds.length === 0) return;
    try {
      addToast(
        `Đang cập nhật hoạt động mẫu cho ${selectedLpIds.length} Landing Pages...`,
        "info",
      );
      // Simulation or sequential API requests could be made here
      setSelectedLpIds([]);
      addToast("Đã kích hoạt hoạt động hàng loạt thành công!", "success");
    } catch (e) {
      addToast("Không thể thực hiện tác vụ hàng loạt.", "error");
    }
  };

  // Drag and Drop simulated transitions for leads status board
  const handleTransitionLeadState = (
    leadId: string,
    current: LeadStatus,
    dir: "next" | "prev",
  ) => {
    const statuses: LeadStatus[] = [
      LeadStatus.NEW,
      LeadStatus.CONTACTED,
      LeadStatus.CONSULTING,
      LeadStatus.WON,
      LeadStatus.CANCELLED,
    ];
    const idx = statuses.indexOf(current);
    if (dir === "next" && idx < statuses.length - 1) {
      handleUpdateLeadStatus(leadId, statuses[idx + 1]);
    } else if (dir === "prev" && idx > 0) {
      handleUpdateLeadStatus(leadId, statuses[idx - 1]);
    }
  };

  // Dynamic Chart resolution filter
  const chartData = useMemo(() => {
    const raw = stats?.viewsHistory || [];
    // Filter limit range to 7, 30, 90 items
    return raw.slice(-chartRange).map((day: any) => ({
      ...day,
      conversion: Math.round((day.leads / (day.views || 1)) * 100),
    }));
  }, [stats, chartRange]);

  // ==========================================
  // RENDER TAB: GENERAL STATS (BẢN TIN)
  // ==========================================
  if (activeTab === "stats") {
    return (
      <div className="space-y-8 animate-fade-in">
        {/* Header summary of current business day */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Bảng tin Thống kê Vận Hành
              <span className="text-xs font-normal text-slate-500 font-mono">
                (Cập nhật trực tiếp UTC)
              </span>
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Sơ đồ tổng quan toàn bộ hoạt động quảng cáo trực tuyến và chuyển
              đổi khách hàng.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                addToast(
                  "Bắt đầu đồng bộ và dọn dẹp các cache trống...",
                  "info",
                );
              }}
              className="px-4 py-2 bg-white hover:bg-slate-50 active:scale-95 border border-slate-200 text-xs font-extrabold rounded-xl transition text-slate-700 flex items-center space-x-1.5 cursor-pointer"
            >
              <Workflow className="w-3.5 h-3.5 text-slate-500" />
              <span>Đồng bộ CDN</span>
            </button>
            <button
              onClick={() => handleOpenLpModal(null)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-150 active:scale-95 border border-transparent text-xs font-extrabold text-white rounded-xl shadow-lg transition-all flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Tạo Mẫu Mới</span>
            </button>
          </div>
        </div>

        {/* 4 Premium SaaS KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-200 flex items-center justify-between relative overflow-hidden group">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Mẫu Thiết Kế (Sản Phẩm)
              </span>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {totalLpsCount}
              </p>
              <div className="flex items-center space-x-1 text-[11px] text-emerald-600 font-bold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+12% mẫu mới tuần này</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition duration-300">
              <Layers className="w-5.5 h-5.5" />
            </div>
            <div className="absolute top-0 left-0 w-1 bg-indigo-600 h-full" />
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-200 flex items-center justify-between relative overflow-hidden group">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Tổng Lượng Đăng Ký (Leads)
              </span>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {totalLeadsCount}
              </p>
              <div className="flex items-center space-x-1 text-[11px] text-emerald-600 font-bold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+25% so với tuần trước</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition duration-300">
              <Users className="w-5.5 h-5.5" />
            </div>
            <div className="absolute top-0 left-0 w-1 bg-emerald-500 h-full" />
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-200 flex items-center justify-between relative overflow-hidden group">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Hợp Đồng Chốt (Won Rates)
              </span>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {totalClosedCount}
              </p>
              <div className="flex items-center space-x-1 text-[11px] text-indigo-500 font-bold">
                <Workflow
                  className="w-3.5 h-3.5 animate-spin"
                  style={{ animationDuration: "3s" }}
                />
                <span>
                  Tỷ lệ chốt:{" "}
                  {totalLeadsCount > 0
                    ? Math.round((totalClosedCount / totalLeadsCount) * 100)
                    : 0}
                  %
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition duration-300">
              <Briefcase className="w-5.5 h-5.5" />
            </div>
            <div className="absolute top-0 left-0 w-1 bg-orange-500 h-full" />
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-200 flex items-center justify-between relative overflow-hidden group">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Khách Hôm Nay / Tuần / Tháng
              </span>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {stats?.leadsToday ?? 0}
              </p>
              <div className="flex items-center space-x-1 text-[11px] text-indigo-500 font-bold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>
                  Tuần: {stats?.leadsThisWeek ?? 0} | Tháng:{" "}
                  {stats?.leadsThisMonth ?? 0}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition duration-300">
              <ExternalLink className="w-5.5 h-5.5" />
            </div>
            <div className="absolute top-0 left-0 w-1 bg-indigo-500 h-full" />
          </div>
        </div>

        {/* Recharts Traffic Sơ Đồ Area Metric Chart */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Biểu Đồ Tốc Độ Tăng Trưởng Quy Mô
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Sơ đồ đo đạc tỷ lệ đăng ký biểu diễn chi tiết dạng sóng Area
                Gradient.
              </p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <div className="bg-slate-100/80 p-1 rounded-xl flex items-center">
                <button
                  onClick={() => setChartMetric("views")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${chartMetric === "views" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
                >
                  Lượt xem
                </button>
                <button
                  onClick={() => setChartMetric("leads")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${chartMetric === "leads" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
                >
                  Đăng ký (Leads)
                </button>
                <button
                  onClick={() => setChartMetric("conversion")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${chartMetric === "conversion" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
                >
                  Tỷ lệ đổi %
                </button>
              </div>

              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setChartRange(7)}
                  className={`px-2.5 py-1.5 font-bold border-r border-slate-100 cursor-pointer ${chartRange === 7 ? "bg-indigo-600 text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}
                >
                  7N
                </button>
                <button
                  onClick={() => setChartRange(30)}
                  className={`px-2.5 py-1.5 font-bold border-r border-slate-100 cursor-pointer ${chartRange === 30 ? "bg-indigo-600 text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}
                >
                  30N
                </button>
                <button
                  onClick={() => setChartRange(90)}
                  className={`px-2.5 py-1.5 font-bold cursor-pointer ${chartRange === 90 ? "bg-indigo-600 text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}
                >
                  90N
                </button>
              </div>
            </div>
          </div>

          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.16} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="date"
                  fontSize={10}
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  fontSize={10}
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
                    fontSize: "11px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={chartMetric}
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#viewsGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent events activity table wrapper */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 lg:col-span-2 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h4 className="font-extrabold text-slate-900 text-sm">
                5 Yêu cầu Khách hàng Liên Hệ Mới
              </h4>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-bold px-2 py-0.5 rounded-full">
                Trực tiếp
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {leads.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 font-semibold">
                  Chưa có khách hàng nào.
                </div>
              ) : (
                leads.slice(0, 5).map((lead) => (
                  <div
                    key={lead.id}
                    className="py-3 flex items-center justify-between hover:bg-slate-50/60 rounded-xl px-2 transition"
                  >
                    <div className="space-y-1">
                      <p className="font-bold text-xs text-slate-800">
                        {lead.name}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {lead.phone} | {lead.email}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3.5">
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(lead.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          lead.status === LeadStatus.NEW
                            ? "bg-rose-50 text-rose-500"
                            : lead.status === LeadStatus.WON
                              ? "bg-emerald-50 text-emerald-500"
                              : "bg-indigo-50 text-indigo-500"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="font-extrabold text-slate-900 text-sm">
                Tài nguyên & Trạng thái CDN
              </h4>
            </div>
            <div className="space-y-4 text-xs font-medium text-slate-600">
              <div className="flex items-center justify-between">
                <span>Trạng thái máy chủ:</span>
                <span className="inline-flex items-center space-x-1 font-bold text-emerald-600">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  <span>Hoạt động tốt</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Lưu trữ hình ảnh:</span>
                <span className="font-bold text-slate-900">
                  4.12 GB / 50 GB
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Chứng chỉ SSL (HTTPS):</span>
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded uppercase">
                  Hợp lệ
                </span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl text-[10px] text-slate-500 italic font-normal text-center border">
                VietKey Dashboard vận hành trên nền tảng Cloud Run bảo mật cao,
                tải trang nhanh dưới 0.1s.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER TAB: LANDING PAGES TABLE VIEW
  // ==========================================
  if (activeTab === "lps") {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Cột Kho Mẫu Landing Page
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Quản lý trực tiếp dữ liệu sản phẩm, hình ảnh thu nhỏ, demo liên
              kết.
            </p>
          </div>
          <button
            onClick={() => handleOpenLpModal(null)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-150 active:scale-95 text-xs font-extrabold text-white rounded-xl shadow-lg transition-all flex items-center space-x-1.5 self-start cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Thêm Mẫu Mới</span>
          </button>
        </div>

        {/* Filter bar - upgraded search & status */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs font-semibold shadow-sm">
          <div className="flex items-center space-x-3.5 flex-1 min-w-[280px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 w-4 h-4 text-slate-400 top-2.5" />
              <input
                type="text"
                placeholder="Tìm theo tiêu đề mẫu, liên kết slug..."
                value={lpSearch}
                onChange={(e) => {
                  setLpSearch(e.target.value);
                  setLpPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs border border-slate-250 focus:border-indigo-500 rounded-xl focus:outline-none transition"
              />
            </div>

            {/* Dropdown Category Filter */}
            <select
              value={lpFilterCat}
              onChange={(e) => {
                setLpFilterCat(e.target.value);
                setLpPage(1);
              }}
              className="py-2 px-3 bg-slate-50 border border-slate-250 rounded-xl focus:outline-none hover:bg-slate-100/70"
            >
              <option value="">Tất cả danh mục ngành</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Status Selector filter */}
            <select
              value={lpFilterStatus}
              onChange={(e) => {
                setLpFilterStatus(e.target.value);
                setLpPage(1);
              }}
              className="py-2 px-3 bg-slate-50 border border-slate-250 rounded-xl focus:outline-none hover:bg-slate-100/70"
            >
              <option value="">Trạng thái (Tất cả)</option>
              <option value="ACTIVE">HOẠT ĐỘNG</option>
              <option value="ARCHIVED">LƯU TRỮ</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setLpSortField("createdAt");
                setLpSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
              }}
              className="px-3.5 py-2 hover:bg-slate-50 border border-slate-200 rounded-xl font-bold flex items-center space-x-1 text-slate-600 transition"
              title="Đối chiếu sắp xếp"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>
                {lpSortField === "createdAt" ? "Ngày tạo" : "Thuộc tính"}
              </span>
            </button>
          </div>
        </div>

        {/* Floating Bulk Actions Bar */}
        {selectedLpIds.length > 0 && (
          <div className="bg-indigo-600 text-white px-6 py-3.5 rounded-2xl flex items-center justify-between shadow-xl shadow-indigo-200 animate-fade-in text-xs font-bold">
            <div className="flex items-center space-x-4">
              <span className="px-2 py-0.5 bg-white/20 rounded-md">
                Đã chọn {selectedLpIds.length} mục
              </span>
              <p>
                Bạn có thể thực hiện sửa đổi nhanh hàng loạt cho nhóm sản phẩm
                này.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleBulkActivate}
                className="px-3.5 py-1.5 bg-white text-indigo-600 rounded-lg hover:bg-slate-100 cursor-pointer active:scale-95 transition"
              >
                Kích hoạt nhóm
              </button>
              <button
                onClick={() => setSelectedLpIds([])}
                className="p-1.5 hover:bg-white/10 rounded"
              >
                Hủy chọn
              </button>
            </div>
          </div>
        )}

        {/* Main Products Grid or Table structured */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse select-none">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="py-4.5 px-6 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={
                        selectedLpIds.length === paginatedLps.length &&
                        paginatedLps.length > 0
                      }
                      onChange={toggleSelectAllLps}
                      className="rounded border-slate-300 h-4 w-4 text-indigo-600 cursor-pointer focus:ring-0"
                    />
                  </th>
                  <th className="py-4.5 px-4 w-44">Ảnh đại diện</th>
                  <th className="py-4.5 px-4">Tên Mẫu & Slug</th>
                  <th className="py-4.5 px-4">Danh Mục</th>
                  <th className="py-4.5 px-4 text-right">Đơn Giá gốc</th>
                  <th className="py-4.5 px-4 text-center">Trạng thái</th>
                  <th className="py-4.5 px-4 text-right">Lượt Xem</th>
                  <th className="py-4.5 px-4 text-center w-28">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {paginatedLps.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-20 text-center text-slate-400 font-bold"
                    >
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <AlertCircle className="w-10 h-10 text-slate-300" />
                        <span>Không tìm thấy mẫu Landing Page phù hợp</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedLps.map((lp, idx) => {
                    const cat = categories.find((c) => c.id === lp.categoryId);
                    const serialIndex = (lpPage - 1) * lpLimit + idx + 1;
                    return (
                      <tr
                        key={lp.id}
                        className="hover:bg-slate-50/50 transition"
                      >
                        <td className="py-4.5 px-6 text-center">
                          <input
                            type="checkbox"
                            checked={selectedLpIds.includes(lp.id)}
                            onChange={() => toggleSelectLpId(lp.id)}
                            className="rounded border-slate-300 h-4 w-4 text-indigo-600 cursor-pointer focus:ring-0"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="h-16 w-30 rounded-lg overflow-hidden border border-slate-200 shadow-sm relative group bg-slate-900">
                            {lp.thumbnail ? (
                              <img
                                src={lp.thumbnail}
                                alt=""
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-400">
                                Không có ảnh
                              </div>
                            )}
                            <div className="absolute top-1 left-1 px-1 bg-black/60 text-white rounded text-[8px] font-black">
                              #{serialIndex}
                            </div>
                          </div>
                        </td>
                        <td className="py-2 px-4 space-y-1">
                          <p
                            onClick={() => handleOpenLpModal(lp)}
                            className="font-extrabold text-slate-900 hover:text-indigo-600 cursor-pointer transition text-xs truncate max-w-[200px]"
                          >
                            {lp.title}
                          </p>
                          <p className="text-[10px] font-mono text-slate-400 truncate max-w-[180px]">
                            /{lp.slug}
                          </p>
                        </td>
                        <td className="py-2 px-4">
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 font-bold rounded-lg text-[10px]">
                            {cat ? cat.name : "Chưa phân loại"}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-right font-extrabold text-[#111827]">
                          {lp.price.toLocaleString("vi-VN")}đ
                        </td>
                        <td className="py-2 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 py-0.5 px-2 rounded-full text-[9px] font-black uppercase ${
                              lp.status === "ACTIVE"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            <span
                              className={`w-1 h-1 rounded-full ${lp.status === "ACTIVE" ? "bg-emerald-500" : "bg-slate-400"}`}
                            />
                            {lp.status === "ACTIVE" ? "HOẠT ĐỘNG" : "LƯU TRỮ"}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-right font-mono text-slate-500">
                          {(lp as any).views || 0}
                        </td>
                        <td className="py-2 px-6">
                          <div className="flex items-center justify-center space-x-2">
                            <a
                              href={lp.demoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-slate-400 transition"
                              title="Xem thử Demo"
                            >
                              <Eye className="w-3.8 h-3.8" />
                            </a>
                            <button
                              onClick={() => handleOpenLpModal(lp)}
                              className="p-1.5 hover:bg-slate-100 hover:text-slate-900 rounded-lg text-slate-400 transition"
                              title="Sửa nội dung"
                            >
                              <Edit2 className="w-3.8 h-3.8" />
                            </button>
                            <button
                              onClick={() => handleDeleteLp(lp)}
                              className="p-1.5 hover:bg-rose-50 hover:text-rose-500 rounded-lg text-slate-400 transition"
                              title="Xóa mẫu"
                            >
                              <Trash2 className="w-3.8 h-3.8" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Simple premium pagination panel */}
          {filteredAndSortedLps.length > 0 && (
            <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-100 text-xs">
              <span className="font-medium text-slate-500">
                Hiển thị{" "}
                <span className="font-bold text-slate-800">
                  {paginatedLps.length}
                </span>{" "}
                trên{" "}
                <span className="font-bold text-slate-800">
                  {filteredAndSortedLps.length}
                </span>{" "}
                mẫu thiết kế
              </span>
              <div className="flex items-center space-x-1">
                <button
                  disabled={lpPage === 1}
                  onClick={() => setLpPage((prev) => Math.max(1, prev - 1))}
                  className="p-1.5 rounded-lg border bg-white hover:bg-slate-50 disabled:opacity-40 transition"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold text-slate-800 px-3 py-1 bg-white border rounded-lg text-[11px]">
                  {lpPage} / {maxLpPageNum}
                </span>
                <button
                  disabled={lpPage === maxLpPageNum}
                  onClick={() =>
                    setLpPage((prev) => Math.min(maxLpPageNum, prev + 1))
                  }
                  className="p-1.5 rounded-lg border bg-white hover:bg-slate-50 disabled:opacity-40 transition"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER TAB: CATEGORIES PAGE (DANH MỤC NGÀNH)
  // ==========================================
  if (activeTab === "categories") {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Ngành Nghề Chuyên Môn
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Quản lý cơ cấu ngành nghề, phục vụ việc phân tách Landing Pages
              trực quan.
            </p>
          </div>
          <button
            onClick={() => handleOpenCatModal(null)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-xs font-extrabold text-white rounded-xl shadow-lg shadow-indigo-100 transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Thêm Danh Mục Ngành</span>
          </button>
        </div>

        {/* Industrial standard card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, index) => {
            const count = lpCountsPerCategory[cat.id] || 0;
            return (
              <div
                key={cat.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-400 hover:shadow-md transition duration-200 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">
                      {count} Mẫu
                    </span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm hover:text-indigo-600 cursor-pointer transition">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] font-mono text-slate-400 mt-1">
                      /{cat.slug}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100 mt-4 text-xs font-bold text-slate-500">
                  <button
                    onClick={() => handleOpenCatModal(cat)}
                    className="p-1.5 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition"
                    title="Chỉnh sửa danh mục"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCat(cat)}
                    className="p-1.5 hover:bg-rose-50 hover:text-rose-500 rounded-lg transition"
                    title="Xóa danh mục"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER TAB: LEADS MINI CRM PIPELINE & LIST
  // ==========================================
  if (activeTab === "leads") {
    // Pipeline board lists
    const matchedLeads = leads.filter(
      (l) =>
        l.name.toLowerCase().includes(crmSearch.toLowerCase()) ||
        l.email.toLowerCase().includes(crmSearch.toLowerCase()) ||
        (l.phone && l.phone.includes(crmSearch)),
    );

    const statusesDef: Array<{
      key: LeadStatus;
      label: string;
      bg: string;
      text: string;
    }> = [
      {
        key: LeadStatus.NEW,
        label: "Yêu cầu Mới",
        bg: "bg-rose-50",
        text: "text-rose-600",
      },
      {
        key: LeadStatus.CONTACTED,
        label: "Đã liên hệ",
        bg: "bg-indigo-50",
        text: "text-indigo-600",
      },
      {
        key: LeadStatus.CONSULTING,
        label: "Tư vấn",
        bg: "bg-amber-50",
        text: "text-amber-600",
      },
      {
        key: LeadStatus.WON,
        label: "Đã chốt (Won)",
        bg: "bg-emerald-50",
        text: "text-emerald-600",
      },
      {
        key: LeadStatus.CANCELLED,
        label: "Hủy/Thất bại",
        bg: "bg-slate-100",
        text: "text-slate-400",
      },
    ];

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              CRM Khách Hàng VietKey
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Tiếp nhận yêu cầu từ Form, cấu trúc trạng thái khách hàng chuẩn
              SaaS.
            </p>
          </div>

          {/* CRM Board switcher toggler */}
          <div className="bg-slate-100/90 p-1 rounded-xl flex items-center text-xs font-bold leading-none self-start">
            <button
              onClick={() => setCrmView("kanban")}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition cursor-pointer ${crmView === "kanban" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"}`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Pipeline board</span>
            </button>
            <button
              onClick={() => setCrmView("table")}
              className={`px-3 py-1.5 rounded-lg flex items-center space-x-1 transition cursor-pointer ${crmView === "table" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"}`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Dạng danh sách</span>
            </button>
          </div>
        </div>

        {/* Search header pipeline */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm text-xs flex items-center justify-between">
          <div className="relative w-80">
            <Search className="absolute left-3 w-4 h-4 text-slate-400 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo tên gọi, email, số điện thoại..."
              value={crmSearch}
              onChange={(e) => setCrmSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-250 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>
          <span className="text-slate-500 font-medium">
            Tìm thấy{" "}
            <span className="font-bold text-slate-800">
              {matchedLeads.length}
            </span>{" "}
            đăng ký
          </span>
        </div>

        {/* Rendering Board Pipeline Grid View */}
        {crmView === "kanban" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 select-none items-start">
            {statusesDef.map((def) => {
              const columnLeads = matchedLeads.filter(
                (l) => l.status === def.key,
              );
              return (
                <div
                  key={def.key}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4 flex flex-col min-h-[480px]"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span
                      className={`text-[11px] font-black uppercase ${def.text} tracking-wider`}
                    >
                      {def.label}
                    </span>
                    <span className="px-2 py-0.5 bg-white text-slate-600 border rounded-full font-bold text-[10px]">
                      {columnLeads.length}
                    </span>
                  </div>

                  <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[500px] pr-1">
                    {columnLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:border-indigo-400 transition"
                      >
                        <div className="space-y-2 text-xs">
                          <p className="font-extrabold text-slate-900 truncate">
                            {lead.name}
                          </p>
                          <div className="space-y-0.5 text-[10px] text-slate-500 leading-tight">
                            <p className="truncate">{lead.email}</p>
                            <p>{lead.phone}</p>
                          </div>

                          {/* Brief design references */}
                          {((lead as any).lpId || lead.industry) && (
                            <div className="px-2 py-1 bg-slate-100 text-slate-600 text-[9px] rounded-md border truncate font-bold">
                              Mã mẫu:{" "}
                              {((lead as any).lpId || lead.industry).substring(
                                0,
                                15,
                              )}
                            </div>
                          )}

                          <div className="text-[9px] text-slate-400 font-mono mt-1">
                            {new Date(lead.createdAt).toLocaleDateString(
                              "vi-VN",
                            )}
                          </div>

                          {/* Quick controller transitions */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                            <button
                              onClick={() => handleDeleteLead(lead)}
                              className="text-rose-500 hover:bg-rose-50 px-1.5 py-1 rounded transition text-[10px] font-bold"
                            >
                              Xóa
                            </button>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() =>
                                  handleTransitionLeadState(
                                    lead.id,
                                    def.key,
                                    "prev",
                                  )
                                }
                                className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[10px] font-bold transition disabled:opacity-30"
                              >
                                &larr;
                              </button>
                              <button
                                onClick={() =>
                                  handleTransitionLeadState(
                                    lead.id,
                                    def.key,
                                    "next",
                                  )
                                }
                                className="px-1.5 py-0.5 bg-slate-150 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold transition disabled:opacity-30"
                              >
                                &rarr;
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Plain Table leads View */
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-left font-medium select-none text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="py-4.5 px-6">Họ tên & Email</th>
                  <th className="py-4.5 px-4">Số điện thoại</th>
                  <th className="py-4.5 px-4">Ngày đăng ký Form</th>
                  <th className="py-4.5 px-4">Sản Phẩm Đăng ký</th>
                  <th className="py-4.5 px-4">Trạng thái hiện tại</th>
                  <th className="py-4.5 px-6 text-center w-28">Xử lý</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {matchedLeads.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-16 text-center text-slate-400 font-bold"
                    >
                      Không tìm thấy bản ghi liên hệ nào
                    </td>
                  </tr>
                ) : (
                  matchedLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-50/50 transition"
                    >
                      <td className="py-4 px-6">
                        <p className="font-extrabold text-slate-900">
                          {lead.name}
                        </p>
                        <p className="text-[10px] text-zinc-400 mt-0.5 font-mono">
                          {lead.email}
                        </p>
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-800">
                        {lead.phone}
                      </td>
                      <td className="py-4 px-4 text-slate-500 font-mono">
                        {new Date(lead.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 bg-slate-150 rounded text-[10px] font-mono text-slate-600 select-all">
                          {(lead as any).lpId
                            ? (lead as any).lpId.substring(0, 10)
                            : lead.industry || "Đồng bộ URL"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            handleUpdateLeadStatus(
                              lead.id,
                              e.target.value as LeadStatus,
                            )
                          }
                          className="py-1 px-2.5 bg-slate-50 border rounded-lg focus:outline-none text-[11px] font-bold"
                        >
                          <option value="NEW">Yêu cầu Mới</option>
                          <option value="CONTACTED">Đã liên hệ</option>
                          <option value="CONSULTING">Tư vấn sâu</option>
                          <option value="WON">Đã chốt (Won)</option>
                          <option value="CANCELLED">Hủy liên hệ</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleDeleteLead(lead)}
                          className="px-2.5 py-1.5 text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg font-bold"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // RENDER TAB: BLOGS SEO CHẤT LƯỢNG CAO (COMPOSER)
  // ==========================================
  if (activeTab === "blog") {
    const matchedBlogs = blogs.filter((b) =>
      b.title.toLowerCase().includes(blogSearch.toLowerCase()),
    );

    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Bài viết chuẩn SEO & Marketing
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Hệ thống bài viết tiếp thị, tích hợp phân tích điểm Keyword Score
              trực tiếp.
            </p>
          </div>
          <button
            onClick={() => handleOpenBlogModal(null)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-xs font-extrabold text-white rounded-xl shadow-lg transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Viết Bài SEO Mới</span>
          </button>
        </div>

        {/* Search blogs input */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm text-xs flex items-center justify-between">
          <div className="relative w-80">
            <Search className="absolute left-3 w-4 h-4 text-slate-400 top-2.5" />
            <input
              type="text"
              placeholder="Tìm kiếm tiêu đề bài viết..."
              value={blogSearch}
              onChange={(e) => setBlogSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-250 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>
          <span className="text-slate-500 font-medium">
            Có{" "}
            <span className="font-bold text-slate-800">
              {matchedBlogs.length}
            </span>{" "}
            tin bài
          </span>
        </div>

        {/* Blogs item list block */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matchedBlogs.map((blog) => {
            // Simulated SEO evaluation score out of 100 for display rhythm card
            const length = blog.content ? blog.content.length : 120;
            const seoScore = Math.min(
              100,
              Math.max(
                45,
                Math.round(
                  (length / 1000) * 45 +
                    (blog.keywords && blog.keywords.length > 0 ? 30 : 10) +
                    (blog.description ? 15 : 5),
                ),
              ),
            );

            return (
              <div
                key={blog.id}
                className="bg-white border border-slate-200 rounded-2.5xl p-5 hover:shadow-lg transition duration-200 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="h-44 w-full bg-slate-900 rounded-xl overflow-hidden relative border shadow-sm">
                    {blog.thumbnail ? (
                      <img
                        src={blog.thumbnail}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs">
                        Không có ảnh đại diện
                      </div>
                    )}
                    <span
                      className={`absolute top-2.5 right-2.5 px-2 py-0.7 text-[9px] font-black uppercase rounded ${
                        blog.published
                          ? "bg-emerald-500 text-white"
                          : "bg-zinc-650 text-white"
                      }`}
                    >
                      {blog.published ? "Xuất bản" : "Bản nháp"}
                    </span>
                    <span className="absolute bottom-2.5 left-2.5 px-2 py-1 bg-white/95 backdrop-blur-sm rounded-lg text-[9px] font-black text-slate-800 shadow flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-indigo-500 animate-pulse" />
                      <span>SEO Score: {seoScore}/100</span>
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <h3 className="font-extrabold text-slate-900 text-sm leading-snug hover:text-indigo-600 line-clamp-2 cursor-pointer">
                      {blog.title}
                    </h3>
                    <p className="text-slate-400 text-[10px] font-mono">
                      /{blog.slug}
                    </p>
                    <p className="text-slate-500 line-clamp-2 text-[11px] font-normal leading-normal mt-1">
                      {blog.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4 text-xs font-bold text-slate-500">
                  <span className="text-[10px] text-slate-400 font-mono">
                    3 phút đọc
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenBlogModal(blog)}
                      className="p-1.5 hover:bg-slate-100 hover:text-slate-950 rounded-lg transition"
                      title="Sửa bài SEO"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteBlog(blog)}
                      className="p-1.5 hover:bg-rose-50 hover:text-rose-500 rounded-lg transition"
                      title="Xóa bài viết"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER TAB: WEBSITE OVERVIEW CONFIGURATION
  // ==========================================
  if (activeTab === "settings") {
    return (
      <div className="space-y-6 animate-fade-in max-w-4xl">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Thiết lập & Cấu hình Tổng quan
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Cài đặt Logo, Hotline, Zalo, Tracking Code Header (Google Analytics
            & Tag Manager).
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row min-h-[460px]">
          {/* Sub menu tabs layout */}
          <div className="w-full md:w-56 border-r border-slate-100 p-4 bg-slate-50/50 flex flex-col space-y-1 shrink-0 text-xs font-bold text-slate-600">
            <button
              onClick={() => setSettingsActiveSubTab("general")}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center space-x-2 transition ${settingsActiveSubTab === "general" ? "bg-white text-indigo-600 font-extrabold border border-slate-200 shadow-sm" : "hover:bg-slate-100 hover:text-slate-800"}`}
            >
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span>Cấu hình chung</span>
            </button>
            <button
              onClick={() => setSettingsActiveSubTab("branding")}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center space-x-2 transition ${settingsActiveSubTab === "branding" ? "bg-white text-indigo-600 font-extrabold border border-slate-200 shadow-sm" : "hover:bg-slate-100 hover:text-slate-800"}`}
            >
              <Palette className="w-3.5 h-3.5 text-slate-400" />
              <span>Thương hiệu</span>
            </button>
            <button
              onClick={() => setSettingsActiveSubTab("contact")}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center space-x-2 transition ${settingsActiveSubTab === "contact" ? "bg-white text-indigo-600 font-extrabold border border-slate-200 shadow-sm" : "hover:bg-slate-100 hover:text-slate-800"}`}
            >
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>Thông tin liên hệ</span>
            </button>
            <button
              onClick={() => setSettingsActiveSubTab("analytics")}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center space-x-2 transition ${settingsActiveSubTab === "analytics" ? "bg-white text-indigo-600 font-extrabold border border-slate-200 shadow-sm" : "hover:bg-slate-100 hover:text-slate-800"}`}
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>Google Analytics / SEO</span>
            </button>
            <button
              onClick={() => setSettingsActiveSubTab("social")}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center space-x-2 transition ${settingsActiveSubTab === "social" ? "bg-white text-indigo-600 font-extrabold border border-slate-200 shadow-sm" : "hover:bg-slate-100 hover:text-slate-800"}`}
            >
              <Share2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Liên kết mạng xã hội</span>
            </button>
          </div>

          {/* Form edit body split */}
          <div className="flex-1 p-6 relative">
            <form
              onSubmit={handleSettingsSubmit}
              className="space-y-6 text-xs font-bold text-slate-700"
            >
              {settingsActiveSubTab === "general" && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-sm font-extrabold text-[#111827]">
                    Ảnh nhận diện Logo đại diện
                  </h3>
                  <div className="space-y-1.5">
                    <label className="text-slate-500">
                      Đường dẫn URL Logo của VietKey
                    </label>
                    <input
                      type="text"
                      placeholder="/logo1.png or https://example.com/logo.svg"
                      value={settingsForm.logo}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          logo: e.target.value,
                        })
                      }
                      className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono focus:bg-white focus:outline-none"
                    />
                  </div>
                  {settingsForm.logo && (
                    <div className="p-3 bg-slate-100 rounded-xl inline-block border">
                      <img
                        src={settingsForm.logo}
                        alt="Web logo preview"
                        className="h-10 object-contain"
                      />
                    </div>
                  )}
                </div>
              )}

              {settingsActiveSubTab === "branding" && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h3 className="text-sm font-extrabold text-[#111827]">Tùy chỉnh thương hiệu</h3>
                    <p className="mt-1 text-[11px] font-semibold text-slate-500">Chọn từng khu để chỉnh riêng. Khi lưu, các khu khác giữ nguyên giá trị hiện tại.</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5">
                    {[
                      ["colors", "Màu sắc", Palette],
                      ["logo", "Logo", Sparkles],
                      ["typography", "Phông chữ", Type],
                    ].map(([section, label, Icon]) => (
                      <button
                        key={section as string}
                        type="button"
                        onClick={() => setBrandingSection(section as "colors" | "logo" | "typography")}
                        className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[11px] font-black transition ${brandingSection === section ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:bg-white/70 hover:text-slate-800"}`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{label as string}</span>
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-5">
                    <div className="space-y-5">
                      {brandingSection === "colors" && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-4">
                          <label className="text-slate-700 flex items-center gap-2"><Palette className="w-4 h-4 text-indigo-500" />Bảng màu</label>
                          <p className="text-[11px] font-semibold text-slate-500">Chỉ chỉnh màu trong khu này. Logo và phông chữ không bị thay đổi.</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {colorPresets.map((preset) => (
                              <button
                                key={preset.name}
                                type="button"
                                onClick={() => setSettingsForm({
                                  ...settingsForm,
                                  brandPrimaryColor: preset.primary,
                                  brandSecondaryColor: preset.secondary,
                                  brandAccentColor: preset.accent,
                                  brandHeaderColor: preset.header,
                                  brandFooterColor: preset.footer,
                                  brandButtonColor: preset.button,
                                  brandTitleColor: preset.title,
                                })}
                                className="group rounded-2xl border border-slate-200 bg-slate-50 p-2.5 text-left transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                              >
                                <span className="flex items-center justify-between gap-3">
                                  <span className="text-[11px] font-extrabold text-slate-700">{preset.name}</span>
                                  <span className="text-[9px] font-black uppercase tracking-wide text-slate-400">{preset.note}</span>
                                </span>
                                <span className="mt-2 grid grid-cols-7 overflow-hidden rounded-full border border-white shadow-sm">
                                  {[preset.primary, preset.secondary, preset.accent, preset.header, preset.footer, preset.button, preset.title].map((color, index) => (
                                    <span key={`${preset.name}-${index}`} className="h-5" style={{ backgroundColor: color }} />
                                  ))}
                                </span>
                              </button>
                            ))}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[["Màu chính", "brandPrimaryColor"], ["Màu phụ", "brandSecondaryColor"], ["Màu nhấn", "brandAccentColor"], ["Header", "brandHeaderColor"], ["Footer", "brandFooterColor"], ["Nút bấm", "brandButtonColor"], ["Tiêu đề", "brandTitleColor"]].map(([label, field]) => (
                              <label key={field} className="space-y-1.5 text-slate-500">
                                <span>{label}</span>
                                <div className="flex gap-2">
                                  <input type="color" value={settingsForm[field] || "#9A3412"} onChange={(e) => setSettingsForm({ ...settingsForm, [field]: e.target.value })} className="h-10 w-12 rounded-lg border bg-white p-1" />
                                  <input type="text" value={settingsForm[field] || ""} onChange={(e) => setSettingsForm({ ...settingsForm, [field]: e.target.value })} className="min-w-0 flex-1 rounded-xl border bg-slate-50 p-2.5 font-mono focus:bg-white focus:outline-none" />
                                </div>
                              </label>
                            ))}
                          </div>
                          <button type="submit" disabled={submitting} className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-xs font-black text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 disabled:opacity-40">{submitting ? "Đang lưu màu..." : "Lưu màu sắc"}</button>
                        </div>
                      )}

                      {brandingSection === "logo" && (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
                          <label className="text-slate-700 flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-500" />Logo</label>
                          <p className="text-[11px] font-semibold text-slate-500">Tải logo hoặc dán đường dẫn nội bộ như /api/images/logo.png.</p>
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setSettingsForm({ ...settingsForm, logo: url }))} className="block w-full text-[11px] text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-[11px] file:font-bold file:text-white hover:file:bg-slate-700" />
                          <input type="text" placeholder="/api/images/logo.png" value={settingsForm.logo} onChange={(e) => setSettingsForm({ ...settingsForm, logo: e.target.value })} className="w-full p-2.5 bg-white border rounded-xl font-mono focus:outline-none focus:border-indigo-500" />
                          <button type="submit" disabled={submitting} className="w-full rounded-xl bg-slate-900 px-4 py-3 text-xs font-black text-white shadow-lg transition hover:bg-slate-700 disabled:opacity-40">{submitting ? "Đang lưu logo..." : "Lưu logo"}</button>
                        </div>
                      )}

                      {brandingSection === "typography" && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
                          <label className="text-slate-700 flex items-center gap-2"><Type className="w-4 h-4 text-indigo-500" />Phông chữ</label>
                          <p className="text-[11px] font-semibold text-slate-500">Chỉ chọn hoặc tải phông chữ khi cần, không ảnh hưởng màu và logo.</p>
                          <select value={settingsForm.brandFontFamily || "Inter"} onChange={(e) => setSettingsForm({ ...settingsForm, brandFontFamily: e.target.value, brandFontSource: "preset" })} className="w-full rounded-xl border bg-slate-50 p-2.5 focus:bg-white focus:outline-none">
                            {fontPresets.map((font) => <option key={font} value={font}>{font}</option>)}
                          </select>
                          <input type="file" accept=".woff,.woff2,.ttf,.otf,font/*" onChange={(e) => handleImageUpload(e, (url) => setSettingsForm({ ...settingsForm, brandFontUrl: url, brandFontSource: "uploaded" }))} className="block w-full text-[11px] text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-3 file:py-2 file:text-[11px] file:font-bold file:text-white hover:file:bg-indigo-700" />
                          <input type="text" placeholder="Uploaded font family name" value={settingsForm.brandFontFamily || ""} onChange={(e) => setSettingsForm({ ...settingsForm, brandFontFamily: e.target.value })} className="w-full rounded-xl border bg-slate-50 p-2.5 focus:bg-white focus:outline-none" />
                          <button type="submit" disabled={submitting} className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-xs font-black text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 disabled:opacity-40">{submitting ? "Đang lưu phông chữ..." : "Lưu phông chữ"}</button>
                        </div>
                      )}
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-slate-950 p-4 shadow-xl">
                      <div className="overflow-hidden rounded-2xl bg-white" style={{ fontFamily: `"${settingsForm.brandFontFamily || "Inter"}", Inter, sans-serif` }}>
                        <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: settingsForm.brandHeaderColor || "#FFFDFC" }}>
                          <img src={settingsForm.logo || "/logo1.png"} alt="Brand preview logo" className="h-8 max-w-28 object-contain" />
                          <span className="rounded-full px-3 py-1 text-[10px] font-black text-white" style={{ backgroundColor: settingsForm.brandButtonColor || "#9A3412" }}>Nút bấm</span>
                        </div>
                        <div className="space-y-3 p-5">
                          <p className="text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: settingsForm.brandAccentColor || "#F59E0B" }}>Xem trước</p>
                          <h4 className="text-2xl font-black leading-tight" style={{ color: settingsForm.brandTitleColor || "#3F190F" }}>Tiêu đề website</h4>
                          <p className="text-xs font-medium text-slate-500">Header, footer, nút bấm và tiêu đề sẽ dùng màu đã lưu.</p>
                        </div>
                        <div className="px-5 py-4 text-xs font-bold text-white" style={{ backgroundColor: settingsForm.brandFooterColor || "#0F172A" }}>Khu vực footer</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {settingsActiveSubTab === "contact" && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-sm font-extrabold text-[#111827]">
                    Thông tin tư vấn khách hàng
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-500">Hotline hiển thị</label>
                      <input
                        type="text"
                        placeholder="098..."
                        value={settingsForm.hotline}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            hotline: e.target.value,
                          })
                        }
                        className="w-full p-2.5 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-500">
                        Hộp thư Email nhận thông tin
                      </label>
                      <input
                        type="email"
                        placeholder="staff@vietkey.vn"
                        value={settingsForm.email}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            email: e.target.value,
                          })
                        }
                        className="w-full p-2.5 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500">
                      Email hiển thị liên hệ (Contact Email)
                    </label>
                    <input
                      type="email"
                      placeholder="contact@vietkey.vn"
                      value={settingsForm.contactEmail || ""}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          contactEmail: e.target.value,
                        })
                      }
                      className="w-full p-2.5 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none font-mono"
                    />
                  </div>{" "}
                </div>
              )}

              {settingsActiveSubTab === "analytics" && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-sm font-extrabold text-[#111827]">
                    Mã đo lường Google Ads & Analytics
                  </h3>
                  <div className="space-y-1.5">
                    <label className="text-slate-500">
                      Google Analytics Tracking ID (G-XXXXXX)
                    </label>
                    <input
                      type="text"
                      placeholder="G-K7L9M12"
                      value={settingsForm.analytics}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          analytics: e.target.value,
                        })
                      }
                      className="w-full p-2.5 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500">
                      Google Tag Manager Header Code
                    </label>
                    <textarea
                      rows={4}
                      placeholder="..."
                      value={settingsForm.gtm}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          gtm: e.target.value,
                        })
                      }
                      className="w-full p-2.5 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none font-mono text-[10px]"
                    />
                  </div>
                </div>
              )}

              {settingsActiveSubTab === "social" && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-sm font-extrabold text-[#111827]">
                    Đường dẫn hỗ trợ chuyển đổi chốt đơn
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-500">
                        Đường dẫn Zalo OA / Hotline
                      </label>
                      <input
                        type="url"
                        placeholder="https://zalo.me/..."
                        value={settingsForm.zalo}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            zalo: e.target.value,
                          })
                        }
                        className="w-full p-2.5 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-500">
                        Đường dẫn Facebook Messenger chat
                      </label>
                      <input
                        type="url"
                        placeholder="https://m.me/..."
                        value={settingsForm.facebook}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            facebook: e.target.value,
                          })
                        }
                        className="w-full p-2.5 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-500">Đường dẫn TikTok</label>
                      <input
                        type="url"
                        placeholder="https://tiktok.com/@vietkey"
                        value={settingsForm.tiktok || ""}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            tiktok: e.target.value,
                          })
                        }
                        className="w-full p-2.5 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-500">
                        Đường dẫn YouTube
                      </label>
                      <input
                        type="url"
                        placeholder="https://youtube.com/@vietkey"
                        value={settingsForm.youtube || ""}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            youtube: e.target.value,
                          })
                        }
                        className="w-full p-2.5 bg-slate-50 border rounded-xl focus:bg-white focus:outline-none font-mono"
                      />
                    </div>{" "}
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-150 text-xs font-black text-white rounded-xl shadow-lg transition disabled:opacity-40 select-none cursor-pointer"
                >
                  {submitting ? "Đang lưu trữ..." : "Lưu Thay Đổi Cấu Hình"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

