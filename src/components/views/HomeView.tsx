import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Rocket,
  Compass,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  Globe2,
  Users2,
  MessageCircle,
  FileText,
} from "lucide-react";
import { LandingPage, Category, SiteSetting } from "../../types/index.js";

interface HomeViewProps {
  settings: SiteSetting;
}

export default function HomeView({ settings }: HomeViewProps) {
  const [featuredLps, setFeaturedLps] = useState<LandingPage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cuộn lên đầu trang
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Tải dữ liệu mẫu từ API
    const fetchData = async () => {
      try {
        const [lpsRes, catsRes] = await Promise.all([
          fetch("/api/landing-pages?status=ACTIVE"),
          fetch("/api/categories"),
        ]);
        if (lpsRes.ok && catsRes.ok) {
          const lps = await lpsRes.json();
          const cats = await catsRes.json();
          setFeaturedLps(lps.slice(0, 3)); // Lấy 3 mẫu nổi bật
          setCategories(cats);
        }
      } catch (err) {
        console.error("Lỗi lấy dữ liệu trang chủ:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div id="home-view" className="space-y-10 pb-28 md:space-y-20 md:pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-24 pb-8 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-indigo-50/30 via-transparent to-transparent dark:from-indigo-950/5">
        {/* Background Gradients Blur */}
        <div className="absolute -top-32 right-1/4 hidden md:block w-[400px] h-[400px] rounded-full bg-indigo-200/20 opacity-20 blur-3xl -z-10 dark:opacity-10" />
        <div className="absolute top-12 left-1/4 hidden md:block w-[300px] h-[300px] rounded-full bg-violet-200/20 opacity-15 blur-3xl -z-10 dark:opacity-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-4 md:space-y-6">
            {/* Tagline Badge */}
            <div className="hidden md:inline-flex items-center space-x-2 bg-badge-bg px-3.5 py-1.5 rounded-full border border-border text-badge-text text-xs font-semibold tracking-wide uppercase">
              <Compass className="w-4 h-4" />
              <span>Dẫn đầu xu hướng thiết kế tối ưu chuyển đổi 2026</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl md:text-6xl font-bold tracking-tight leading-[1.12] text-foreground">
              Landing Page <span className="text-primary">Chuẩn SEO</span> -
              Tăng Chuyển Đổi - Theo Yêu Cầu
            </h1>

            {/* Description */}
            <p className="text-sm md:text-lg text-foreground-secondary max-w-2xl mx-auto font-normal leading-relaxed">
              Sở hữu Landing Page chuyên nghiệp, tự tối ưu, cấu hình Marketing
              toàn diện giúp nâng cao tỷ lệ chuyển đổi và bứt phá doanh thu kinh
              doanh.
            </p>

            {/* Call To Actions */}
            <div className="pt-1 md:pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/landing-pages"
                className="flex items-center space-x-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-semibold shadow-sm transition duration-200 w-full sm:w-auto text-center justify-center group"
              >
                <span>Xem Kho Mẫu</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/services"
                className="px-6 py-3 bg-background-secondary border border-border hover:bg-card-hover text-foreground-secondary rounded-xl text-sm font-semibold transition duration-200 w-full sm:w-auto text-center font-medium"
              >
                Nhận Báo Giá
              </Link>
              <a
                href={settings.zalo}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 px-6 py-3 bg-success hover:brightness-110 text-white rounded-xl text-sm font-semibold transition duration-200 w-full sm:w-auto text-center justify-center"
              >
                <MessageCircle className="w-4.5 h-4.5 text-white" />
                <span>Liên hệ Zalo</span>
              </a>
            </div>

            {/* Metrics Badges */}
            <div className="pt-3 md:pt-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-3xl mx-auto md:border-t md:border-border">
              <div className="aspect-square md:aspect-auto rounded-2xl bg-card shadow-sm md:bg-transparent md:shadow-none flex flex-col items-center justify-center text-center p-3">
                <Rocket className="w-5 h-5 md:w-6 md:h-6 text-[#F97316] mb-2" />
                <p className="text-2xl md:text-4xl font-semibold font-mono text-primary tracking-tight">
                  500+
                </p>
                <p className="text-[11px] md:text-sm text-foreground-secondary mt-1 font-medium">
                  Projects
                </p>
              </div>
              <div className="aspect-square md:aspect-auto rounded-2xl bg-card shadow-sm md:bg-transparent md:shadow-none flex flex-col items-center justify-center text-center p-3">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-[#F97316] mb-2" />
                <p className="text-2xl md:text-4xl font-semibold font-mono text-primary tracking-tight">
                  24%
                </p>
                <p className="text-[11px] md:text-sm text-foreground-secondary mt-1 font-medium">
                  Convert
                </p>
              </div>
              <div className="aspect-square md:aspect-auto rounded-2xl bg-card shadow-sm md:bg-transparent md:shadow-none flex flex-col items-center justify-center text-center p-3">
                <Users2 className="w-5 h-5 md:w-6 md:h-6 text-[#F97316] mb-2" />
                <p className="text-2xl md:text-4xl font-semibold font-mono text-primary tracking-tight">
                  300+
                </p>
                <p className="text-[11px] md:text-sm text-foreground-secondary mt-1 font-medium">
                  Clients
                </p>
              </div>
              <div className="aspect-square md:aspect-auto rounded-2xl bg-card shadow-sm md:bg-transparent md:shadow-none flex flex-col items-center justify-center text-center p-3">
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-[#F97316] mb-2" />
                <p className="text-2xl md:text-4xl font-semibold font-mono text-primary tracking-tight">
                  1.5s
                </p>
                <p className="text-[11px] md:text-sm text-foreground-secondary mt-1 font-medium">
                  Load
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core services - bento feature grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-5 md:mb-10 space-y-1 md:space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Tại sao chọn Landing Page từ VietKey?
          </h2>
          <p className="text-foreground-secondary text-sm">
            Thiết kế tinh xảo kết hợp hoàn mỹ các công nghệ lập trình và tư vấn
            marketing.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 items-stretch">
          {/* Bento item 1 */}
          <div className="aspect-square md:aspect-auto md:min-h-[300px] bg-card p-3 md:p-8 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-300 flex flex-col items-center justify-center text-center md:items-start md:text-left">
            <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-[#818CF8] flex items-center justify-center mb-2 md:mb-6">
              <Globe2 className="w-5 h-5" />
            </div>
            <p className="text-2xl font-semibold font-mono text-primary md:hidden">
              95+
            </p>
            <h3 className="text-[11px] md:text-lg font-bold text-foreground mb-0 md:mb-2 line-clamp-2">
              Tốc độ tải siêu tốc
            </h3>
            <p className="hidden md:block text-foreground-secondary text-sm leading-relaxed">
              Tối ưu hệ thống lưu tĩnh, tải trang dưới 1.5 giây. Tăng điểm số
              Google PageSpeed leo đỉnh 95+, giữ chân khách hàng tức thì.
            </p>
          </div>

          {/* Bento item 2 */}
          <div className="aspect-square md:aspect-auto md:min-h-[300px] bg-card p-3 md:p-8 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-300 flex flex-col items-center justify-center text-center md:items-start md:text-left">
            <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-[#818CF8] flex items-center justify-center mb-2 md:mb-6">
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-2xl font-semibold font-mono text-primary md:hidden">
              24%
            </p>
            <h3 className="text-[11px] md:text-lg font-bold text-foreground mb-0 md:mb-2 line-clamp-2">
              Tối Ưu Tỷ Lệ Đổi Khách
            </h3>
            <p className="hidden md:block text-foreground-secondary text-sm leading-relaxed">
              Form đặt mua thu lead nhanh, nút chat Zalo/Hotline dính chân trang
              tiện lợi, pop-up vòng quay số, thôi thúc bấm CTA đặt mua ngay.
            </p>
          </div>

          {/* Bento item 3 */}
          <div className="aspect-square md:aspect-auto md:min-h-[300px] bg-card p-3 md:p-8 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-300 flex flex-col items-center justify-center text-center md:items-start md:text-left">
            <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-[#818CF8] flex items-center justify-center mb-2 md:mb-6">
              <Zap className="w-5 h-5" />
            </div>
            <p className="text-2xl font-semibold font-mono text-primary md:hidden">
              1.5s
            </p>
            <h3 className="text-[11px] md:text-lg font-bold text-foreground mb-0 md:mb-2 line-clamp-2">
              Chuẩn SEO Tiêu Chuẩn Cao
            </h3>
            <p className="hidden md:block text-foreground-secondary text-sm leading-relaxed">
              Cấu trúc heading chuẩn mực, tối ưu hóa các thẻ schema, meta tag
              phong phú và thân thiện tuyệt đối với bot thu thập thông tin
              Google.
            </p>
          </div>

          {/* Bento item 4 */}
          <div className="aspect-square md:aspect-auto md:min-h-[300px] bg-card p-3 md:p-8 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-300 flex flex-col items-center justify-center text-center md:items-start md:text-left">
            <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-[#818CF8] flex items-center justify-center mb-2 md:mb-6">
              <Award className="w-5 h-5" />
            </div>
            <p className="text-2xl font-semibold font-mono text-primary md:hidden">
              12m
            </p>
            <h3 className="text-[11px] md:text-lg font-bold text-foreground mb-0 md:mb-2 line-clamp-2">
              Support Warranty
            </h3>
            <p className="hidden md:block text-foreground-secondary text-sm leading-relaxed">
              Maintenance, performance checks, and technical support after
              launch.
            </p>
          </div>
        </div>
      </section>
      {/* 3. DYNAMIC SAMPLES CAROUSEL */}
      <section className="bg-background-secondary py-8 md:py-16 md:border-y md:border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-5 md:mb-10 gap-3 md:gap-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                Dự án Landing Page Tiêu Biểu
              </h2>
              <p className="text-foreground-secondary mt-2 text-sm">
                Tuyển tập những mẫu Landing Page bán chạy, đẹp hiện đại, dễ sử
                dụng.
              </p>
            </div>
            <Link
              to="/landing-pages"
              className="text-primary hover:text-primary-hover font-semibold text-sm inline-flex items-center space-x-1"
            >
              <span>Xem tất cả kho mẫu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, idx) => (
                <div
                  key={idx}
                  className="bg-card rounded-2xl overflow-hidden shadow-sm animate-pulse h-[380px]"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredLps.map((lp) => (
                <div
                  key={lp.id}
                  className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col group duration-300"
                >
                  {/* Thumbnail Area */}
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src={lp.thumbnail}
                      alt={lp.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-primary text-white px-3.5 py-1.5 text-sm font-space font-bold rounded-xl shadow-sm">
                      {lp.price.toLocaleString("vi-VN")}đ
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-bold text-base text-foreground group-hover:text-primary transition line-clamp-1">
                        {lp.title}
                      </h3>
                      <p className="text-foreground-secondary text-xs leading-relaxed mt-2 line-clamp-3">
                        {lp.description}
                      </p>
                    </div>

                    {/* Footer Nav */}
                    <div className="border-t border-border pt-4 flex items-center justify-between">
                      <span className="text-[10px] text-foreground-muted font-mono">
                        #{lp.slug}
                      </span>
                      <Link
                        to={`/landing-pages?demo=${lp.slug}`}
                        className="text-primary hover:text-primary-hover font-semibold text-xs inline-flex items-center space-x-1"
                      >
                        <span>Xem chi tiết Demo</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. WORKFLOW PROCESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <h2 className="text-3xl font-bold text-foreground">
            Quy Trình Triển Khai Chuyên Nghiệp
          </h2>
          <p className="text-foreground-secondary text-sm">
            Từ ý tưởng đến khi vận hành quảng cáo thành công chỉ trong 3 bước
            ngắn gọn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="text-center relative">
            <div className="w-14 h-14 rounded-full bg-primary text-white font-semibold text-lg flex items-center justify-center mx-auto mb-6 shadow-sm border border-border">
              01
            </div>
            <h3 className="text-xs md:text-lg font-bold text-foreground mb-0 md:mb-2 line-clamp-2">
              Chọn mẫu & Lên kịch bản
            </h3>
            <p className="text-foreground-secondary text-sm leading-relaxed px-4">
              Khách hàng chọn kho mẫu có sẵn hoặc mô tả yêu cầu riêng. Team
              VietKey tư vấn tối ưu nội dung chuẩn tập khách hàng.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center relative">
            <div className="w-14 h-14 rounded-full bg-primary/90 text-white font-semibold text-lg flex items-center justify-center mx-auto mb-6 shadow-sm border border-border">
              02
            </div>
            <h3 className="text-xs md:text-lg font-bold text-foreground mb-0 md:mb-2 line-clamp-2">
              Thiết kế & Bố cục SEO
            </h3>
            <p className="text-foreground-secondary text-sm leading-relaxed px-4">
              Tiến hành lập trình giao diện chuẩn responsive, nén dung lượng,
              cấu hình SEO on-page, cấu hình tracking Google Analytics/FB Pixel.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center relative">
            <div className="w-14 h-14 rounded-full bg-primary/80 text-white font-semibold text-lg flex items-center justify-center mx-auto mb-6 shadow-sm border border-border">
              03
            </div>
            <h3 className="text-xs md:text-lg font-bold text-foreground mb-0 md:mb-2 line-clamp-2">
              Bàn giao & Hỗ trợ trọn đời
            </h3>
            <p className="text-foreground-secondary text-sm leading-relaxed px-4">
              Bàn giao full mã nguồn chính chủ, bảo hành 12 tháng, hỗ trợ trỏ
              tên miền và cập nhật miễn phí cho bạn an tâm vận hành.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Hotline CTA card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[linear-gradient(135deg,var(--brand-button),color-mix(in_srgb,var(--brand-button)_78%,#0f172a))] border border-white/20 dark:border-slate-800 rounded-3xl p-6 md:p-10 text-white shadow-lg relative overflow-hidden">
          <div className="absolute -bottom-12 -right-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -top-16 left-1/3 w-52 h-52 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-10 items-center">
            <div className="rounded-2xl bg-slate-950/28 p-5 md:p-6 ring-1 ring-white/15 backdrop-blur-sm">
              <p className="mb-3 text-[11px] font-black uppercase tracking-[0.22em] text-white/75">
                Custom landing page
              </p>
              <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white">
                Cần một thiết kế Landing Page hoàn toàn độc bản?
              </h2>
              <p className="mt-4 max-w-3xl text-sm md:text-base leading-relaxed font-medium text-white/88">
                Hãy cung cấp ý tưởng kinh doanh của bạn, VietKey Shop hân hạnh
                đồng hành thiết kế giao diện độc quyền, phân tích UI/UX đúng tâm
                lý mua hàng của ngành.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col xl:flex-row gap-3 md:justify-end rounded-2xl bg-white/12 p-4 ring-1 ring-white/15 backdrop-blur-sm">
              <Link
                to="/services"
                className="px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-950 text-center rounded-xl font-black text-sm transition duration-250 whitespace-nowrap shadow-md"
              >
                Yêu Cầu Tùy Biến
              </Link>
              <a
                href={settings.zalo}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-center rounded-xl font-black text-sm transition duration-250 whitespace-nowrap flex items-center justify-center space-x-1 text-white shadow-md"
              >
                <span>Nhắn Zalo Ngay</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
