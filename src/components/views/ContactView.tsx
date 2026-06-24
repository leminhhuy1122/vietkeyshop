// @ts-ignore: Ignore missing type declarations for react in this environment
import React, { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  CheckCircle,
  Send,
  Loader2,
  Sparkles,
  Facebook,
} from "lucide-react";
import { SiteSetting } from "../../types/index.js";

interface ContactViewProps {
  settings: SiteSetting;
}

export default function ContactView({ settings }: ContactViewProps) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      alert("Họ tên và Số điện thoại là bắt buộc!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          industry: "Liên hệ chung",
          budget: "Chưa phân hạng",
          message: form.message,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setForm({ name: "", phone: "", email: "", message: "" });
      } else {
        alert("Gặp sự cố khi kết nối máy chủ. Vui lòng liên hệ Hotline.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="contact-view" className="pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 animate-fade-in">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight leading-tight animate-fade-in">
            Kết Nối Với Chúng Tôi
          </h1>
          <p className="text-foreground-secondary text-sm md:text-base leading-relaxed font-normal">
            VietKey Shop luôn sẵn sàng lắng nghe ý tưởng kinh doanh của bạn để
            tìm ra cấu trúc Landing Page bứt phá nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* Left info cards (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">
                Thông Tin Trực Tuyến
              </h2>
              <p className="text-foreground-secondary text-sm leading-relaxed">
                Các phương thức liên hệ mua Landing Page mẫu, đăng ký gia hạn
                hosting hoặc báo lỗi kỹ thuật 24/7 của chúng tôi.
              </p>
            </div>

            {/* Metas Cards info */}
            <div className="space-y-4 flex-1 my-6">
              {/* Hotline Card */}
              <div className="bg-card p-5 rounded-2xl border border-border flex items-start space-x-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground-secondary text-sm">
                    Điện thoại / Hotline
                  </h4>
                  <p className="text-foreground font-black text-base mt-0.5">
                    {settings.hotline}
                  </p>
                  <p className="text-xs text-foreground-muted mt-0.5">
                    Làm việc kể cả thứ 7, Chủ Nhật và ngày lễ
                  </p>
                </div>
              </div>

              {/* Zalo Card */}
              <div className="bg-card p-5 rounded-2xl border border-border flex items-start space-x-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#05a0eb]/10 text-[#05a0eb] flex items-center justify-center shrink-0 mt-0.5">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground-secondary text-sm">
                    Zalo Tư Vấn Mua Mẫu
                  </h4>
                  <a
                    href={settings.zalo}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#05a0eb] hover:text-[#048ccf] font-bold text-xs inline-flex items-center space-x-1.5 mt-1 transition duration-200"
                  >
                    <span>Click nhắn tin Zalo ngay</span>
                  </a>
                </div>
              </div>

              {/* Email Card */}
              <div className="bg-card p-5 rounded-2xl border border-border flex items-start space-x-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground-secondary text-sm">
                    Địa chỉ hòm thư
                  </h4>
                  <p className="text-foreground font-mono text-sm select-all mt-1">
                    {settings.email}
                  </p>
                  <p className="text-xs text-foreground-muted mt-0.5">
                    Nhận hồ sơ yêu cầu thiết kế / đấu thầu
                  </p>
                </div>
              </div>
            </div>

            {/* Address Area */}
            <div className="flex items-center space-x-2 bg-background-secondary border border-border p-4.5 rounded-2xl text-xs text-foreground-secondary font-normal">
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <span>
                <b>VietKey Hồ Chí Minh:</b> Lầu 6, Tòa nhà công nghệ VietKey,
                CMT8, Quận 3, TP. Hồ Chí Minh
              </span>
            </div>
          </div>

          {/* Right form (7 cols) */}
          <div className="lg:col-span-7 bg-card p-8 rounded-3xl border border-border shadow-lg flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Đăng Ký Tư Vấn Nhanh
              </h3>
              <p className="text-foreground-secondary text-xs mb-6 font-normal">
                Bạn có bất kỳ băn khoăn gì cần giải đáp, đừng ngần ngại ghi lại
                thông tin tại đây.
              </p>

              {success ? (
                <div className="py-16 text-center space-y-4 animate-in fade-in">
                  <div className="w-16 h-16 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 stroke-[3]" />
                  </div>
                  <h4 className="text-lg font-bold text-foreground">
                    Gửi Thông Tin Thành Công!
                  </h4>
                  <p className="text-sm text-foreground-secondary leading-normal max-w-md mx-auto">
                    Mong bạn chú ý điện thoại, nhân viên VietKey Shop sẽ lập tức
                    liên lạc tư vấn trọn vẹn thông tin các mẫu Landing page
                    chuẩn SEO.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground-secondary">
                        Họ và tên của bạn *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Nguyễn Thị Thu"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-foreground font-normal placeholder:text-foreground-muted"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground-secondary">
                        Số điện thoại liên hệ *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="0911xxxxxx"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-foreground font-normal placeholder:text-foreground-muted"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground-secondary">
                      Địa chỉ Email
                    </label>
                    <input
                      type="email"
                      placeholder="thunguyen@gmail.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-foreground font-normal placeholder:text-foreground-muted"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground-secondary">
                      Ghi chú câu hỏi / yêu cầu:
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Ghi nội dung của bạn tại đây..."
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm text-foreground font-normal placeholder:text-foreground-muted"
                    />
                  </div>

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
                        <span>Gửi Tin Nhắn Hỗ Trợ</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Embedded Map Simulation with premium frame layout */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-foreground">
            Vị Trí Bản Đồ Trực Quan
          </h3>
          <div className="rounded-3xl overflow-hidden h-96 shadow-lg border border-border relative bg-background-secondary">
            {/* Embedded Iframe Maps */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4602324354228!2d106.67891827471607!3d10.7760193893729!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f2f39f37241%3A0xe1ab91ede5a0e6c5!2sCMT8%2C%20Qu%E1%BA%ADn%203%2C%20Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh!5e0!3m2!1svi!2s!4v1718000000000!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
