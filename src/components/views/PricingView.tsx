import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Check,
  X,
  Info,
  Zap,
  Sparkles,
  ShieldAlert,
  Award,
  Clock,
  ArrowRight,
  HelpCircle,
  Layers,
  PlusCircle,
} from "lucide-react";

export default function PricingView() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const tiers = [
    {
      name: "LANDING PAGE BASIC",
      price: "3.900.000",
      type: "Chọn mẫu có sẵn từ thư viện",
      descr:
        "Giải pháp nhanh chóng, tối ưu chi phí để giới thiệu thương hiệu và thu thập thông tin khách hàng tiềm năng dựa trên mẫu thiết kế tiêu chuẩn có sẵn.",
      delivery: "1 - 3 ngày",
      features: [
        { text: "Chọn 1 mẫu Landing Page có sẵn từ thư viện", included: true },
        { text: "Thay thế logo doanh nghiệp", included: true },
        {
          text: "Căn chỉnh màu sắc theo nhận diện thương hiệu",
          included: true,
        },
        { text: "Thay thế nội dung văn bản chuẩn của bạn", included: true },
        { text: "Thay thế hình ảnh sản phẩm/dịch vụ", included: true },
        {
          text: "Cấu hình đầy đủ thông tin liên hệ và nút bấm",
          included: true,
        },
        {
          text: "Kết nối Form tự động gửi email/Google Sheet nhận khách",
          included: true,
        },
        {
          text: "Responsive chuẩn 100% trên Mobile & Máy tính bảng",
          included: true,
        },
        { text: "Tối ưu hóa SEO On-page cơ bản", included: true },
        { text: "Tối ưu tốc độ tải trang (PageSpeed > 85)", included: true },
      ],
      sections: [
        "Hero Banner (Hình ảnh lớn & Tiêu đề chính)",
        "Giới thiệu doanh nghiệp / Sứ mệnh",
        "Dịch vụ / Sản phẩm tiêu biểu",
        "Điểm nổi bật / Khác biệt (USP)",
        "Khách hàng đánh giá (Testimonials)",
        "Form khách hàng liên hệ",
        "Chân trang (Footer)",
      ],
      notIncluded: [
        "Thêm section mới ngoài khung cố định",
        "Xóa bớt hoặc thay đổi vị trí section có sẵn",
        "Thay đổi bố cục cấu trúc thiết kế mẫu",
        "Thiết kế UI mới độc quyền",
        "Chức năng đặc biệt (giỏ hàng, thanh toán, booking...)",
        "Tích hợp API phần mềm bên thứ ba",
      ],
      popular: false,
      cta: "Chọn Gói Basic",
    },
    {
      name: "LANDING PAGE BUSINESS",
      price: "7.900.000",
      type: "Tùy chỉnh linh hoạt từ mẫu có sẵn",
      descr:
        "Lựa chọn tối ưu hàng đầu cho chiến dịch chạy Ads quy mô vừa & lớn, hỗ trợ điều chỉnh giao diện và bổ sung các tính năng nâng cao chuyển đổi.",
      delivery: "3 - 7 ngày",
      features: [
        {
          text: "Toàn bộ quyền lợi của gói BASIC + Các mẫu nâng cấp",
          included: true,
        },
        { text: "Tùy chỉnh thêm tối đa 5 Section riêng", included: true },
        { text: "Điều chỉnh bố cục từng Section linh động", included: true },
        {
          text: "Căn chỉnh màu sắc, hiệu ứng Animation mượt mà và chuyển cảnh",
          included: true,
        },
        { text: "Thêm Popup ưu đãi / Popup nhận báo giá", included: true },
        {
          text: "Bổ sung mục Hỏi đáp thường gặp (FAQ) mở rộng",
          included: true,
        },
        { text: "Thêm bảng giá dịch vụ chi tiết nâng cấp", included: true },
        { text: "Thêm mục Thư viện ảnh / Case Study thực tế", included: true },
        {
          text: "Chèn Video Youtube / Video Reel tự động phát giới thiệu",
          included: true,
        },
        {
          text: "Xuất dữ liệu khách về Google Sheets + Telegram tiện lợi",
          included: true,
        },
      ],
      limit:
        "Tối đa 12 Section bản vẽ, không hỗ trợ UI custom 100% từ đầu phức thảo giấy.",
      notIncluded: [
        "Về thiết kế UI/UX độc quyền mới từ con số 0",
        "Tích hợp các lược lập trình backend riêng biệt",
      ],
      popular: true,
      cta: "Chọn Gói Business",
    },
    {
      name: "LANDING PAGE PREMIUM",
      price: "Báo giá chi tiết",
      type: "Thiết kế và phát triển độc bản 100% từ đầu",
      descr:
        "Đỉnh cao thiết kế chuyển đổi độc quyền cho dự án lớn. May đo và lập trình riêng biệt từ khảo sát phân tích Insight, thiết kế Wireframe cho tới thành phẩm hoàn mỹ.",
      delivery: "Báo giá chi tiết",
      features: [
        {
          text: "Thiết kế giao diện UI/UX riêng biệt trên Figma",
          included: true,
        },
        { text: "Không giới hạn số lượng Section trình bày", included: true },
        {
          text: "Không giới hạn bố cục xây dựng (Thoải mái sáng tạo)",
          included: true,
        },
        {
          text: "Lập trình chức năng nâng cao theo nhu cầu doanh nghiệp",
          included: true,
        },
        {
          text: "Tích hợp API kết nối với các hệ thống ERP, CRM (Hubspot, GetFly)",
          included: true,
        },
        {
          text: "Dashboard tổng quan quản lý thông tin khách hàng (nếu có yêu cầu)",
          included: true,
        },
        {
          text: "Hệ thống đặt lịch thông minh (Booking Calendar)",
          included: true,
        },
        {
          text: "Tích hợp CRM mini lưu lead chuyên nghiệp, bảo mật",
          included: true,
        },
        {
          text: "Email Automation (gửi mail xác nhận tự động cho khách)",
          included: true,
        },
        {
          text: "Tracking nâng cao đo lường hành vi chi tiết (GTM, Pixel, FB API, TikTok)",
          included: true,
        },
      ],
      popular: false,
      cta: "Chọn Gói Premium",
    },
  ];

  const subItems = [
    {
      name: "Thêm 1 Section đơn giản",
      desc: "Section tĩnh, hiển thị chủ yếu với hình ảnh cơ bản",
      price: "100.000đ",
    },
    {
      name: "Thêm 1 Section trung bình",
      desc: "Section có hiệu ứng, slide ảnh chạy, bảng thống kê hoặc tab chuyển",
      price: "300.000đ",
    },
    {
      name: "Thêm 1 Section nâng cao",
      desc: "Bảng so sánh chi tiết, cấu trúc dữ liệu dạng phức tạp",
      price: "600.000đ - 1.000.000đ",
    },
    {
      name: "Thiết kế Popup",
      desc: "Popup quà thưởng, Popup nhận ebook, Popup chức năng, Popup form thông minh",
      price: "300.000đ",
    },
    {
      name: "Form thu lead nhiều bước (Multi-step Form)",
      desc: "Trắc nghiệm chọn lựa để dẫn dắt hành vi và nâng tỷ lệ đăng ký",
      price: "1.000.000đ",
    },
    {
      name: "Tích hợp API bên thứ ba",
      desc: "Đẩy data về phần mềm CRM riêng biệt hoặc Google Sheets",
      price: "Từ 1.500.000đ",
    },
  ];

  const handleSelectTier = (tierName: string) => {
    navigate("/services", { state: { chosenTier: tierName } });
  };

  return (
    <div
      id="pricing-view"
      className="pt-28 pb-20 bg-background text-foreground"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Title Header */}
        <div className="text-center max-w-4xl mx-auto space-y-4 animate-fade-in">
          <div className="inline-flex items-center space-x-1.5 bg-emerald-500/10 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-600 dark:text-emerald-450 border border-emerald-500/20 uppercase tracking-widest">
            <Sparkles
              className="w-3.5 h-3.5 text-emerald-500 animate-spin"
              style={{ animationDuration: "4s" }}
            />
            <span>Mức đầu tư tối ưu - đo lường chính xác</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Giải Pháp Bảng Giá Landing Page Thời Đại Mới
          </h1>
          <p className="text-foreground-secondary leading-relaxed text-sm md:text-base max-w-2xl mx-auto">
            Không chi phí ẩn, báo giá minh bạch trên gói. Thiết kế tối ưu chuyển
            đổi giúp tăng x3 doanh số bán hàng từ mỗi chiến dịch quảng cáo của
            bạn.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`bg-card rounded-3xl p-6 md:p-8 border hover:shadow-2xl transition-all duration-300 relative flex flex-col justify-between ${
                tier.popular
                  ? "border-emerald-500 dark:border-emerald-400 shadow-xl lg:scale-[1.03] ring-4 ring-emerald-500/5 z-10"
                  : "border-border"
              }`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-emerald-600 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-widest shadow-lg">
                  LỰA CHỌN PHỔ BIẾN NHẤT 🔥🔥
                </span>
              )}

              {/* Package Detail */}
              <div className="space-y-4">
                <div className="lg:min-h-[50px]">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white border-b border-dashed border-border pb-2">
                    {tier.name}
                  </h3>
                  <p className="text-[11px] uppercase font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    {tier.type}
                  </p>
                </div>

                <div className="flex items-baseline space-x-1.5 bg-slate-50 dark:bg-card-hover p-4 rounded-2xl border border-border">
                  <span className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                    {tier.price}
                  </span>
                  <span className="text-xs font-black text-foreground-secondary">
                    {tier.price === "Báo giá chi tiết" ? "" : "đ / Trọn gói"}
                  </span>
                </div>

                <p className="text-xs text-foreground-secondary font-medium leading-relaxed">
                  {tier.descr}
                </p>

                {/* Delivery details icon */}
                <div className="flex items-center space-x-2 bg-indigo-50/60 dark:bg-slate-800/40 px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  <Clock className="w-4 h-4" />
                  <span>Thời gian bàn giao: {tier.delivery}</span>
                </div>

                <div className="border-t border-border my-4" />
              </div>

              {/* Package Core Features */}
              <div className="flex-1 space-y-6 my-4 text-[13px]">
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white mb-3 uppercase tracking-wider flex items-center space-x-1">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>Quyền lợi bao gồm:</span>
                  </h4>
                  <ul className="space-y-2.5">
                    {tier.features.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-start space-x-2 leading-relaxed"
                      >
                        <div className="w-4.5 h-4.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="text-foreground-secondary text-xs font-medium">
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sections format for BASIC */}
                {tier.sections && (
                  <div className="bg-emerald-50/30 dark:bg-emerald-950/10 p-4 rounded-2xl border border-emerald-500/10">
                    <h4 className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mb-2.5 flex items-center space-x-1.5 uppercase tracking-wider">
                      <Layers className="w-3.5 h-3.5" />
                      <span>
                        Cấu trúc cố định {tier.sections.length} Sections:
                      </span>
                    </h4>
                    <ol className="list-decimal list-inside space-y-1 text-slate-650 dark:text-slate-300 text-[11px] font-medium leading-relaxed">
                      {tier.sections.map((sec, sIdx) => (
                        <li key={sIdx}>{sec}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Giới hạn đặc biệt cho Business */}
                {tier.limit && (
                  <div className="bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20 text-xs font-bold text-amber-700 dark:text-amber-400">
                    <p className="leading-relaxed">
                      ⚠️ <span className="underline">Giới hạn gói:</span>{" "}
                      {tier.limit}
                    </p>
                  </div>
                )}

                {/* Quyền lợi loại trừ (Không bao gồm) */}
                {tier.notIncluded && (
                  <div className="bg-slate-50 dark:bg-card-hover/50 p-4 rounded-2xl border border-border">
                    <h4 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider flex items-center space-x-1">
                      <X className="w-3.5 h-3.5 text-rose-500" />
                      <span>Không bao gồm:</span>
                    </h4>
                    <ul className="space-y-1.5 text-slate-500 text-[11px] font-medium">
                      {tier.notIncluded.map((noFeature, nfIdx) => (
                        <li
                          key={nfIdx}
                          className="flex items-center space-x-1.5 leading-tight"
                        >
                          <span className="w-1 h-1 bg-slate-400 rounded-full shrink-0" />
                          <span>{noFeature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Trigger Button */}
              <div
                className={
                  tier.popular
                    ? "sticky bottom-6 z-20 -mx-2 mt-6 rounded-[1.35rem] bg-gradient-to-t from-card via-card/95 to-transparent px-2 pt-8 pb-1"
                    : "mt-6"
                }
              >
                <button
                  onClick={() => handleSelectTier(tier.name)}
                  className={`relative w-full overflow-hidden rounded-2xl py-4 text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    tier.popular
                      ? "bg-gradient-to-r from-emerald-700 via-emerald-500 to-green-500 text-white shadow-2xl shadow-emerald-500/40 ring-4 ring-emerald-400/25 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-emerald-500/60 hover:ring-emerald-300/40 active:translate-y-0 active:scale-[0.99]"
                      : "bg-background-secondary border border-border hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground-secondary"
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[pulse_1.8s_ease-in-out_infinite]" />
                  )}
                  <span className="relative inline-flex items-center justify-center gap-1.5">
                    {tier.cta} <span aria-hidden="true">&rarr;</span>
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* QUY ĐỊNH BỔ SUNG & PHỤ PHÍ SECTION (CÁCH TÍNH THÊM SECTION) */}
        <div className="bg-card border border-border rounded-4xl p-6 md:p-10 shadow-lg space-y-8 mt-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-dashed border-border pb-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center space-x-1 bg-amber-500/10 px-3 py-1 rounded-full text-[10px] font-black text-amber-600 dark:text-amber-450 border border-amber-500/20 uppercase tracking-widest">
                <PlusCircle className="w-3 h-3" />
                <span>Chi phí cộng thêm linh hoạt</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Quy định Chi Phí Phát Sinh & Section Phụ Trợ
              </h3>
              <p className="text-xs text-foreground-secondary leading-normal font-medium max-w-xl">
                Bạn muốn mở rộng nội dung ngoài quy chuẩn gói chính? VietKey
                cung cấp cơ chế tính phí module phụ trợ rõ ràng để bạn kiểm soát
                ngân sách dễ dàng.
              </p>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/30 p-4 rounded-2xl flex items-center space-x-3.5">
              <div className="bg-indigo-600 text-white p-2.5 rounded-xl">
                <Info className="w-5 h-5" />
              </div>
              <p className="text-[11px] text-indigo-750 dark:text-indigo-300 font-bold leading-normal max-w-[200px]">
                Áp dụng tính thêm khi khách chọn gói <b>BASIC / BUSINESS</b>{" "}
                nhưng muốn may đo thêm tính năng.
              </p>
            </div>
          </div>

          {/* Pricing Additions Table */}
          <div className="overflow-x-auto rounded-3xl border border-border">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white border-b border-border">
                  <th className="py-4.5 px-6 font-black uppercase text-[10px] tracking-wider w-1/3">
                    Hạng Mục module phụ trợ
                  </th>
                  <th className="py-4.5 px-6 font-black uppercase text-[10px] tracking-wider w-1/2">
                    Chi tiết tính chất kỹ thuật
                  </th>
                  <th className="py-4.5 px-6 font-black uppercase text-[10px] tracking-wider text-right">
                    Đơn giá VND
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {subItems.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-4 px-6 font-extrabold text-slate-850 dark:text-slate-200">
                      {item.name}
                    </td>
                    <td className="py-4 px-6 text-foreground-secondary font-medium">
                      {item.desc}
                    </td>
                    <td className="py-4 px-6 text-right font-mono font-black text-indigo-600 dark:text-indigo-400">
                      {item.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 dark:bg-card-hover/30 p-5 rounded-3xl border border-border text-xs">
            <div className="space-y-1 font-medium text-foreground-secondary">
              <span className="font-extrabold text-slate-900 dark:text-white text-xs block mb-1">
                💡 Tips tiết kiệm ngân sách:
              </span>
              <p>
                1. Hãy chọn gói <b className="text-emerald-600">BUSINESS</b> nếu
                dự án của bạn cần trên 2 section tùy biến hoặc FAQ, vì gói đã
                bao trọn quyền lợi chỉnh bố cục và tặng kèm popup tiết kiệm đăng
                ký.
              </p>
              <p className="mt-1">
                2. Chuẩn bị trước sơ đồ / file nội dung Word rõ ràng sẽ giúp đẩy
                nhanh tiến độ thiết kế trong vòng vỏn vẹn 48 giờ làm việc.
              </p>
            </div>
            <div className="space-y-1 font-medium text-foreground-secondary">
              <span className="font-extrabold text-slate-900 dark:text-white text-xs block mb-1">
                🎁 Quà tặng bàn giao:
              </span>
              <p>
                Mỗi dự án bàn giao bởi VietKey đều đi kèm hướng dẫn sử dụng, cam
                kết tối ưu hóa điểm số Google PageSpeed cực đại để chạy quảng
                cáo Google Ads rẻ nhất.
              </p>
              <p className="mt-1">
                Hỗ trợ trọn gói cài đặt cổng thanh toán mã QR ngân hàng tự động
                điền số tài khoản và nội dung chuyển khoản tiện ích.
              </p>
            </div>
          </div>
        </div>

        {/* Small FAQ expanded */}
        <div className="max-w-4xl mx-auto mt-20 space-y-6">
          <h3 className="text-center text-xl font-bold text-slate-900 dark:text-white flex items-center justify-center space-x-2">
            <HelpCircle className="w-5 h-5 text-indigo-500" />
            <span>Những câu hỏi thường gặp về dịch vụ thiết kế</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="bg-background-secondary p-6 rounded-2xl border border-border space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white">
                Landing Page của VietKey có giới hạn lượt truy cập không?
              </h4>
              <p className="text-foreground-secondary leading-relaxed text-xs font-medium">
                Hoàn toàn <b>không giới hạn</b>. Sau khi bàn giao mã nguồn, bạn
                có thể tự quản trị, cài đặt trên bất kỳ hosting nào với lượng
                truy cập và số lượng khách hàng tiềm năng mà không lo trả thêm
                phí băng thông hằng tháng.
              </p>
            </div>
            <div className="bg-background-secondary p-6 rounded-2xl border border-border space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white">
                Tôi muốn tích hợp Zalo chat, Hotline bám biên được không?
              </h4>
              <p className="text-foreground-secondary leading-relaxed text-xs font-medium">
                Tất cả các gói thiết kế của chúng tôi đều được{" "}
                <b>tích hợp sẵn</b> bộ phím tắt liên hệ nhanh bao gồm: Hotline
                kết nối nhanh thoại, Trực tiếp chat Zalo OA hoặc Zalo cá nhân,
                nhắn tin Fanpage bám cuối màn hình tối ưu tiện lợi cho khách bấm
                gọi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
