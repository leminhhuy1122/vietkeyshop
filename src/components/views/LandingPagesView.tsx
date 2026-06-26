import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Filter,
  CheckCircle,
  Play,
  Share2,
  Phone,
  MessageSquare,
  Sparkles,
  Layers,
  Award,
  Video,
  X,
  Send,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { LandingPage, Category, SiteSetting } from "../../types/index.js";

interface LandingPagesViewProps {
  settings: SiteSetting;
}

export default function LandingPagesView({ settings }: LandingPagesViewProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [lps, setLps] = useState<LandingPage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Bộ lọc
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");

  // State quản lý Modal Chi tiết Demo
  const [selectedLp, setSelectedLp] = useState<LandingPage | null>(null);
  const [leadForm, setLeadForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submittingLead, setSubmittingLead] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Đọc tham số URL hâm nóng trang chi tiết demo ?demo=slug
  const demoParam = searchParams.get("demo");
  const catParam = searchParams.get("category");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const loadData = async () => {
      try {
        const [lpsRes, catsRes] = await Promise.all([
          fetch("/api/landing-pages?status=ACTIVE"),
          fetch("/api/categories"),
        ]);
        if (lpsRes.ok && catsRes.ok) {
          const lpsData: LandingPage[] = await lpsRes.json();
          const catsData: Category[] = await catsRes.json();
          setLps(lpsData);
          setCategories(catsData);

          // Nếu có param category trên URL, set selectedCat
          if (catParam) {
            const catObj = catsData.find((c) => c.slug === catParam);
            if (catObj) setSelectedCat(catObj.id);
          }

          // if URL has ?demo=slug, open modal detail of that landing page
          if (demoParam) {
            const currentDemo = lpsData.find((lp) => lp.slug === demoParam);
            if (currentDemo) {
              setSelectedLp(currentDemo);
              // Tăng view demo thông qua API ẩn
              fetch(`/api/landing-pages/${currentDemo.slug}`);
            }
          }
        }
      } catch (err) {
        console.error("Lỗi lấy dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [demoParam, catParam]);

  // Bộ lọc cục bộ mượt mà
  const filteredLps = lps.filter((lp) => {
    const matchSearch =
      lp.title.toLowerCase().includes(search.toLowerCase()) ||
      lp.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCat === "all" || lp.categoryId === selectedCat;
    return matchSearch && matchCat;
  });

  const handleOpenDetail = (lp: LandingPage) => {
    setSelectedLp(lp);
    setSearchParams({ demo: lp.slug });
  };

  const handleCloseDetail = () => {
    setSelectedLp(null);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("demo");
    setSearchParams(newParams);
    setSubmitSuccess(false);
    setLeadForm({ name: "", phone: "", email: "", message: "" });
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.phone) {
      alert("Vui lòng điền đầy đủ Họ tên và Số điện thoại!");
      return;
    }
    setSubmittingLead(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadForm.name,
          phone: leadForm.phone,
          email: leadForm.email,
          industry:
            categories.find((c) => c.id === selectedLp?.categoryId)?.name ||
            "Chưa chọn",
          budget: "Mua mẫu: " + selectedLp?.title,
          message: `Khách click đăng ký nhận báo giá mẫu Landing Page: ${selectedLp?.title}. Lời nhắn: ${leadForm.message}`,
        }),
      });
      if (res.ok) {
        setSubmitSuccess(true);
      } else {
        alert("Đã xảy ra lỗi khi gửi thông tin, xin vui lòng thử lại.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingLead(false);
    }
  };

  return (
    <div id="landing-pages-view" className="pt-28 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
            Kho Giao Diện Landing Page Triệu Đơn
          </h1>
          <p className="text-foreground-secondary text-sm md:text-base leading-relaxed">
            Xem thực tế các mẫu Landing Page đa dạng các lĩnh vực, tối ưu hóa
            giao diện di động chuẩn UX, nén ảnh thông minh tải siêu nhanh.
          </p>
        </div>

        {/* Filter And Search Bar Section */}
        <div className="bg-card p-3 md:p-6 rounded-[1.75rem] shadow-sm flex flex-col md:flex-row gap-3 md:gap-4 items-center animate-fade-in">
          {/* SEARCH BOX */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground-muted" />
            <input
              id="search-input"
              type="text"
              placeholder="Tìm theo chủ đề, tiêu đề..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-h-11 w-full pl-11 pr-4 bg-background rounded-full text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-[#F97316] text-sm transition"
            />
          </div>

          {/* CATEGORIES HORIZONTAL VIEW */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full no-scrollbar py-1">
            <button
              onClick={() => {
                setSelectedCat("all");
                const newParams = new URLSearchParams(searchParams);
                newParams.delete("category");
                setSearchParams(newParams);
              }}
                className={`min-h-11 px-4.5 rounded-full text-sm font-semibold transition whitespace-nowrap ${
                  selectedCat === "all"
                  ? "bg-[#F97316] text-white shadow-sm"
                  : "bg-badge-bg text-foreground-secondary hover:bg-card-hover"
              }`}
            >
              Tất cả mẫu
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCat(cat.id);
                  setSearchParams({
                    ...Object.fromEntries(searchParams),
                    category: cat.slug,
                  });
                }}
                className={`min-h-11 px-4.5 rounded-full text-sm font-semibold transition whitespace-nowrap ${
                  selectedCat === cat.id
                    ? "bg-[#F97316] text-white shadow-sm"
                    : "bg-badge-bg text-foreground-secondary hover:bg-card-hover"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* LOADING STATE - SKELETON */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
            {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="bg-card rounded-[1.5rem] h-56 md:h-96 animate-pulse"
              />
            ))}
          </div>
        ) : filteredLps.length === 0 ? (
          <div className="text-center py-20 bg-background-secondary rounded-2xl border border-dashed border-border">
            <Layers className="w-12 h-12 text-foreground-muted mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground">
              Không tìm thấy Landing Page phù hợp
            </h3>
            <p className="text-foreground-secondary mt-1">
              Vui lòng thử từ khóa khác hoặc lọc danh mục khác.
            </p>
          </div>
        ) : (
          /* LP LIST GRID */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
            {filteredLps.map((lp) => (
              <button
                key={lp.id}
                type="button"
                onClick={() => handleOpenDetail(lp)}
                className="relative bg-card rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 flex flex-col group text-left focus:outline-none focus:ring-2 focus:ring-[#F97316]"
              >
                <span className="absolute right-2 bottom-2 z-10 flex min-h-11 min-w-11 items-center justify-center rounded-full bg-[#F97316] text-white shadow-lg shadow-orange-500/30 transition group-hover:scale-110">
                  <Play className="w-4 h-4 fill-current" />
                </span>

                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={lp.thumbnail}
                    alt={lp.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute left-2 top-2 rounded-full bg-background-secondary/90 px-2.5 py-1 text-[10px] font-bold uppercase text-primary shadow-sm backdrop-blur-md">
                    {categories.find((category) => category.id === lp.categoryId)?.name ||
                      "Featured"}
                  </div>
                  <div className="absolute right-2 top-2 rounded-full bg-slate-950/90 px-2.5 py-1 text-xs font-space font-bold text-white shadow-sm">
                    {lp.price.toLocaleString("en-US")}
                  </div>
                </div>

                <div className="min-h-[6.75rem] p-3 pb-14">
                  <div className="space-y-1.5">
                    <h2 className="mobile-card-title font-bold text-sm leading-snug text-foreground group-hover:text-[#C2410C] transition">
                      {lp.title}
                    </h2>
                    <p className="hidden">
                      {lp.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="fixed inset-x-4 bottom-24 z-40 flex justify-end gap-3 md:hidden pointer-events-none">
        <button
          type="button"
          className="pointer-events-auto min-h-11 min-w-11 rounded-full bg-slate-950 text-white shadow-xl flex items-center justify-center active:scale-95"
          aria-label="Open filters"
        >
          <Filter className="h-4 w-4" />
        </button>
        <a
          href={`tel:${settings.hotline.replace(/\./g, "")}`}
          className="pointer-events-auto min-h-11 min-w-11 rounded-full bg-[#F97316] text-white shadow-xl shadow-orange-500/25 flex items-center justify-center active:scale-95"
          aria-label="Call now"
        >
          <Phone className="h-4 w-4" />
        </a>
      </div>

      {/* ========================================================
          TRANG CHI TIẾT DEMO MODAL LIGHTBOX
         ======================================================== */}
      {selectedLp && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card rounded-3xl w-full max-w-5xl shadow-2xl relative overflow-hidden my-8 border border-border animate-in zoom-in-95 duration-200 flex flex-col md:flex-row max-h-[90vh]">
            {/* Close Button absolute */}
            <button
              onClick={handleCloseDetail}
              className="absolute top-4 right-4 z-10 p-2 text-foreground-secondary hover:text-foreground bg-background border border-border rounded-full backdrop-blur-sm transition duration-200 cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Column: Visual Demo, Video, Gallery (60% width) */}
            <div className="md:w-3/5 bg-slate-950 flex flex-col justify-center relative p-6 border-b md:border-b-0 md:border-r border-border overflow-y-auto max-h-screen">
              {selectedLp.videoUrl ? (
                <div className="space-y-4">
                  <div className="inline-flex items-center space-x-1 bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    <Video className="w-3.5 h-3.5" />
                    <span>Dự án có Video chạy thử thực tế</span>
                  </div>
                  <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900 border border-slate-850 shadow-xl">
                    <video
                      src={selectedLp.videoUrl}
                      controls
                      autoPlay
                      muted
                      loop
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="inline-flex items-center space-x-1 bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Hình ảnh Layout Giao diện</span>
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-xl max-h-96 md:max-h-none border border-slate-900">
                    <img
                      src={selectedLp.thumbnail}
                      alt={selectedLp.title}
                      referrerPolicy="no-referrer"
                      className="w-full object-cover rounded-2xl"
                    />
                  </div>
                </div>
              )}

              {/* Gallery Items */}
              {selectedLp.gallery && selectedLp.gallery.length > 0 && (
                <div className="mt-5 space-y-2">
                  <p className="text-xs font-bold text-slate-400">
                    Hình ảnh thêm:
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    {selectedLp.gallery.map((img, i) => (
                      <div
                        key={i}
                        className="rounded-xl overflow-hidden h-16 border border-slate-900"
                      >
                        <img
                          src={img}
                          alt="gallery item"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Specification details & Form đăng ký bám dính (40% width) */}
            <div className="md:w-2/5 p-8 overflow-y-auto max-h-[85vh] md:max-h-none flex flex-col justify-between space-y-6">
              <div>
                {/* Category & Title */}
                <span className="text-xs font-bold text-primary tracking-wider uppercase">
                  {categories.find((c) => c.id === selectedLp.categoryId)
                    ?.name || "Dự án cao cấp"}
                </span>
                <h2 className="text-xl md:text-2xl font-bold text-foreground mt-1.5 leading-snug">
                  {selectedLp.title}
                </h2>

                {/* Price Display */}
                <div className="mt-4 bg-background-secondary p-4 rounded-2xl border border-border flex justify-between items-center">
                  <span className="text-sm text-foreground-secondary font-semibold">
                    Giá trọn gói:
                  </span>
                  <span className="text-2xl font-space font-bold text-rose-600 dark:text-rose-500">
                    {selectedLp.price.toLocaleString("vi-VN")}đ
                  </span>
                </div>

                {/* Live Demo Link */}
                {selectedLp.demoUrl && (
                  <a
                    href={
                      selectedLp.demoUrl.startsWith("http")
                        ? selectedLp.demoUrl
                        : "https://" + selectedLp.demoUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500/90 dark:hover:bg-emerald-600 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-lg transition-all duration-200 text-center flex items-center justify-center space-x-2 text-sm cursor-pointer group/btn"
                  >
                    <ExternalLink className="w-4 h-4 text-white group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    <span> XEM DEMO 🌐</span>
                  </a>
                )}

                <p className="text-foreground-secondary text-sm leading-relaxed mt-4 font-normal">
                  {selectedLp.description}
                </p>

                {/* Features Bullets checklist */}
                <div className="mt-5 space-y-2.5">
                  <p className="text-sm font-extrabold text-foreground">
                    Ưu điểm thiết kế bản mẫu:
                  </p>
                  <ul className="space-y-1.5 text-xs text-foreground-secondary font-normal">
                    {[
                      "Tương thích hiển thị 100% Mobile, Tablet & PC",
                      "Tích hợp phím Zalo, Hotline, Messenger bám chân siêu đẹp",
                      "Tốc độ nén ảnh cao, tải trang tốc hành chuẩn SEO",
                      "Tặng kèm hướng dẫn cấu hình trỏ Domain của riêng bạn",
                    ].map((feat, ix) => (
                      <li key={ix} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-success shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Badges */}
                <div className="mt-6">
                  <p className="text-xs font-bold text-foreground-muted mb-2">
                    Công nghệ áp dụng:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "HTML5",
                      "Tailwind CSS",
                      "React JS",
                      "Ultra Compression",
                      "Google Analytics ready",
                    ].map((tech) => (
                      <span
                        key={tech}
                        className="bg-badge-bg text-badge-text border border-border px-2.5 py-1 rounded text-[11px] font-semibold"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lead Registration Form */}
              <div className="border-t border-border pt-6">
                {submitSuccess ? (
                  <div className="bg-success/10 border border-success/20 text-success p-4 rounded-xl text-center">
                    <p className="font-bold text-sm">
                      Gửi Thông Tin Thành Công!
                    </p>
                    <p className="text-xs mt-1">
                      Chúng tôi sẽ gọi lại hotline tư vấn báo giá ngay.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="space-y-3.5">
                    <p className="text-sm font-extrabold text-foreground">
                      Đăng ký mua / nhận tư vấn miễn phí:
                    </p>
                    <div>
                      <input
                        type="text"
                        placeholder="Họ và tên của bạn *"
                        required
                        value={leadForm.name}
                        onChange={(e) =>
                          setLeadForm({ ...leadForm, name: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs bg-background border border-border text-foreground rounded-xl placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="tel"
                        placeholder="Số điện thoại *"
                        required
                        value={leadForm.phone}
                        onChange={(e) =>
                          setLeadForm({ ...leadForm, phone: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs bg-background border border-border text-foreground rounded-xl placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      <input
                        type="email"
                        placeholder="Địa chỉ Email"
                        value={leadForm.email}
                        onChange={(e) =>
                          setLeadForm({ ...leadForm, email: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs bg-background border border-border text-foreground rounded-xl placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <textarea
                        placeholder="Ghi chú cụ thể..."
                        rows={2}
                        value={leadForm.message}
                        onChange={(e) =>
                          setLeadForm({ ...leadForm, message: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs bg-background border border-border text-foreground rounded-xl placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={submittingLead}
                        className="flex-1 bg-primary hover:bg-primary-hover text-white py-3 rounded-xl text-xs font-semibold shadow-md active:scale-98 transition duration-200 flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        {submittingLead ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Gửi Đăng Ký Giao Diện</span>
                          </>
                        )}
                      </button>
                      <a
                        href={settings.zalo}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-[#05a0eb] hover:bg-[#048ccf] text-white p-3 rounded-xl flex items-center justify-center transition duration-200"
                        title="Chat Zalo ngay"
                      >
                        <MessageSquare className="w-4 h-4 text-white" />
                      </a>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
