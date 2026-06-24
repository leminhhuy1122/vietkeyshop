import React, { useState, useEffect } from "react";
import {
  Check,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Send,
  Loader2,
  DollarSign,
  Layout,
  PencilRuler,
} from "lucide-react";
import { SiteSetting } from "../../types/index.js";

interface ServicesViewProps {
  settings: SiteSetting;
}

export default function ServicesView({ settings }: ServicesViewProps) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    industry: "Nhà hàng & Cafe",
    budget: "1.500.000đ - 3.000.000đ",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const industries = [
    "Nhà hàng & Cafe",
    "Spa & Làm đẹp",
    "Bất động sản",
    "Giáo dục & Khóa học",
    "Garage Ô tô / Xe cộ",
    "Du lịch & Khách sạn / Homestay",
    "Nội thất / Thiết kế kiến trúc",
    "Y tế / Nha khoa / Sức khỏe",
    "Bán hàng / Thương mại điện tử",
    "Ngành nghề tùy chỉnh khác",
  ];

  const budgets = [
    "Dưới 1.500.000đ (Ngân sách tiết kiệm)",
    "1.500.000đ - 3.000.000đ (Phổ thông)",
    "3.000.000đ - 5.000.000đ (Chuyên nghiệp)",
    "Trên 5.000.000đ (Thiết kế độc quyền cao cấp)",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      alert("Vui lòng điền Họ tên và Số điện thoại!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccess(true);
        setForm({
          name: "",
          phone: "",
          email: "",
          industry: "Nhà hàng & Cafe",
          budget: "1.500.000đ - 3.000.000đ",
          message: "",
        });
      } else {
        alert("Có lỗi xảy ra, vui lòng gửi lại hoặc liên hệ trực tiếp.");
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi hệ thống, xin vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="services-view" className="pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Banner Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 animate-fade-in">
          <div className="inline-flex items-center space-x-1.5 bg-badge-bg px-3.5 py-1.5 rounded-full text-xs font-semibold text-badge-text border border-border uppercase tracking-widest">
            <PencilRuler className="w-3.5 h-3.5" />
            <span>Đo ni đóng giày cho mọi ý tưởng</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight leading-tight">
            Thiết Kế Landing Page Theo Yêu Cầu Riêng
          </h1>
          <p className="text-foreground-secondary leading-relaxed text-sm md:text-base font-normal">
            Duy nhất một trang đích lôi cuốn giữ chân khách hàng tức thì. Chúng
            tôi cam kết tạo ra giao diện độc quyền, phân tích cấu trúc kinh
            doanh của bạn để đưa ra khối thông tin có tỷ lệ ra đơn hàng tối đa.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Custom Design Highlights (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <h2 className="text-2xl font-bold text-foreground">
              Tại sao nên thuê thiết kế riêng biệt?
            </h2>

            <div className="space-y-6">
              <div className="flex space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary dark:text-[#818CF8] flex items-center justify-center shrink-0">
                  <Layout className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">
                    Độc Quyền Bản Sắc Thương Hiệu
                  </h3>
                  <p className="text-sm text-foreground-secondary leading-relaxed mt-1">
                    Giao diện được may đo hoàn hảo theo bộ nhận diện thương
                    hiệu, màu sắc phong thủy và văn hóa của doanh nghiệp bạn.
                    Không lo đụng hàng hay sao chép từ bất kỳ đối thủ nào.
                  </p>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary dark:text-[#818CF8] flex items-center justify-center shrink-0">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">
                    Tối Ưu Sát Với Hành Vi
                  </h3>
                  <p className="text-sm text-foreground-secondary leading-relaxed mt-1">
                    VietKey bố trí luồng thông tin (Sales Angle) khoa học: từ
                    khơi gợi nỗi đau, chứng minh giải pháp, đưa ra feedback
                    thật, bảng giá thuyết phục và kết thúc bằng form chốt deal
                    dồn dập.
                  </p>
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-success/10 text-success flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">
                    Sẵn sàng Kết Nối API Phức Tạp
                  </h3>
                  <p className="text-sm text-foreground-secondary leading-relaxed mt-1">
                    Tích hợp thông báo đẩy qua Gmail, tự động gửi dữ liệu Lead
                    khách hàng về Google Sheet hoặc hệ thống CRM nội bộ (Lark,
                    Getfly, Pancake) chỉ trong tích tắc sau khi khách bấm điền
                    form.
                  </p>
                </div>
              </div>
            </div>

            {/* Workflow List card */}
            <div className="bg-background-secondary p-6 rounded-3xl border border-border">
              <h4 className="font-bold text-foreground text-sm uppercase tracking-wider mb-4">
                Mỗi gói thiết kế yêu cầu đều bao gồm:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-foreground-secondary font-medium">
                {[
                  "Miễn phí 1 năm Hosting tốc độ cao",
                  "Tặng Tên miền quốc tế (.com / .net)",
                  "Tích hợp nút Zalo & Hotline bám đuôi",
                  "Cấu hình Schema JSON-LD SEO",
                  "Tối ưu ảnh nhỏ và nén file CSS/JS",
                  "Bàn giao toàn bộ mã nguồn trọn đời",
                ].map((item, ix) => (
                  <div key={ix} className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-full bg-primary/10 text-primary dark:text-[#818CF8] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Modern Proposal Form (5 cols) */}
          <div className="lg:col-span-5 bg-card p-8 rounded-3xl border border-border shadow-lg relative">
            <h3 className="text-xl font-bold text-foreground mb-1">
              Gửi Yêu Cầu Thiết Kế
            </h3>
            <p className="text-foreground-secondary text-xs mb-6">
              Xin vui lòng cung cấp đôi chút nhu cầu của bạn, tư vấn viên sẽ gọi
              lại sau 5 - 10 phút.
            </p>

            {success ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h4 className="text-lg font-bold text-foreground animate-bounce">
                  Gửi thông tin thành công!
                </h4>
                <p className="text-sm text-foreground-secondary leading-normal px-4">
                  Đội ngũ VietKey đã ghi nhận dự án của bạn và đang lập dự thảo
                  báo giá chi tiết gửi đến số điện thoại/Zalo trong ít phút.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2 bg-background-secondary border border-border text-foreground-secondary text-xs font-bold rounded-lg transition hover:bg-card-hover"
                >
                  Gửi thêm yêu cầu mới
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4.5">
                {/* Họ tên */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground-secondary">
                    Họ và tên của bạn *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Nguyễn Văn Hải"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-foreground placeholder:text-foreground-muted font-normal"
                  />
                </div>

                {/* Sdt */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground-secondary">
                    Số điện thoại liên hệ *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ví dụ: 0988xxxxxx"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-foreground placeholder:text-foreground-muted font-normal"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground-secondary">
                    Địa chỉ Email (Nhận file thiết kế)
                  </label>
                  <input
                    type="email"
                    placeholder="hai.nguyen@gmail.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-foreground placeholder:text-foreground-muted font-normal"
                  />
                </div>

                {/* Ngành Nghề */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground-secondary">
                      Lĩnh vực kinh doanh
                    </label>
                    <select
                      value={form.industry}
                      onChange={(e) =>
                        setForm({ ...form, industry: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-xs text-foreground font-normal"
                    >
                      {industries.map((ind) => (
                        <option
                          className="bg-card text-foreground"
                          key={ind}
                          value={ind}
                        >
                          {ind}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground-secondary">
                      Ngân sách dự kiến
                    </label>
                    <select
                      value={form.budget}
                      onChange={(e) =>
                        setForm({ ...form, budget: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-xs text-foreground font-normal"
                    >
                      {budgets.map((b) => (
                        <option
                          className="bg-card text-foreground"
                          key={b}
                          value={b}
                        >
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Mô tả yêu cầu */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground-secondary">
                    Chi tiết nội dung mong muốn:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ví dụ: Landing page có 8 phần, có form gửi về link trang tính Google riêng của mình..."
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-foreground placeholder:text-foreground-muted font-normal"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl text-sm font-semibold shadow-md active:scale-98 transition duration-200 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4.5 h-4.5" />
                      <span>Nhận Báo Giá Dự Án Ngay</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
