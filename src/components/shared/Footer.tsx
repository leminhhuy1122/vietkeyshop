import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MessageSquare,
  Facebook,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import { SiteSetting } from "../../types/index.js";

interface FooterProps {
  settings: SiteSetting;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="global-footer"
      className="brand-footer bg-slate-900 text-slate-400 border-t border-slate-800"
    >
      {/* Top Banner Accent */}
      <div className="brand-button h-[3px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-flex items-center"
              aria-label="VietKey Shop"
            >
              <img
                src={settings.logo || "/logo1.png"}
                alt="VietKey Shop"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Chuyên cung cấp các mẫu Landing Page tối ưu chuẩn SEO on-page,
              thúc đẩy chuyển đổi doanh số bán hàng đột phá. Hỗ trợ thiết kế
              theo yêu cầu riêng biệt cho từng doanh nghiệp.
            </p>
            <div className="flex space-x-3 pt-2">
              <a
                href={settings.zalo}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition"
                title="Zalo Chat"
              >
                <MessageSquare className="w-5 h-5" />
              </a>
              {settings.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition"
                  title="Facebook Fanpage"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Core Categories Links */}
          <div>
            <h3 className="text-white text-base font-bold tracking-wider uppercase mb-4">
              Các mẫu chủ đạo
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/landing-pages?category=nha-hang-cafe"
                  className="hover:text-indigo-400 transition"
                >
                  Nhà hàng & Cafe
                </Link>
              </li>
              <li>
                <Link
                  to="/landing-pages?category=spa-lam-dep"
                  className="hover:text-indigo-400 transition"
                >
                  Spa & Làm đẹp
                </Link>
              </li>
              <li>
                <Link
                  to="/landing-pages?category=bat-dong-san"
                  className="hover:text-indigo-400 transition"
                >
                  Bất động sản
                </Link>
              </li>
              <li>
                <Link
                  to="/landing-pages?category=giao-duc-khoa-hoc"
                  className="hover:text-indigo-400 transition"
                >
                  Giáo dục & Khóa học
                </Link>
              </li>
              <li>
                <Link
                  to="/landing-pages?category=garage-o-to"
                  className="hover:text-indigo-400 transition"
                >
                  Garage Ô tô
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Navigate */}
          <div>
            <h3 className="text-white text-base font-bold tracking-wider uppercase mb-4">
              Điều Hướng Nhanh
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/services"
                  className="hover:text-indigo-400 transition flex items-center space-x-1"
                >
                  <span>Yêu cầu thiết kế</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="hover:text-indigo-400 transition"
                >
                  So sánh bảng giá
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-indigo-400 transition">
                  Kinh nghiệm SEO Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-indigo-400 transition"
                >
                  Chỉ đường Google Map
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/login"
                  className="text-slate-600 dark:text-slate-500 hover:text-indigo-400 transition text-xs"
                >
                  Khu vực nhân viên (Login)
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white text-base font-bold tracking-wider uppercase mb-4">
              Liên Hệ Mua Mẫu
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-300 font-bold">{settings.hotline}</p>
                  <p className="text-xs text-slate-500">
                    Tổng đài tiếp nhận 24/7
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-300 select-all">{settings.email}</p>
                  <p className="text-xs text-slate-500">
                    Nhận báo giá theo yêu cầu
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-2 bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <p className="text-xs text-slate-300 leading-normal">
                  Chính sách bàn giao mã nguồn 100%, bảo hành 1 năm, hỗ trợ cấu
                  hình SEO miễn phí.
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {currentYear} VietKey Shop. Tất cả các quyền được bảo hộ.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <span className="hover:text-slate-400 transition cursor-help flex items-center space-x-0.5">
              <HelpCircle className="w-3 h-3" />
              <span>Cú pháp chuẩn SEO 2026</span>
            </span>
            <span className="text-slate-700">|</span>
            <span>Thiết kế bởi VietKey Agency</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
