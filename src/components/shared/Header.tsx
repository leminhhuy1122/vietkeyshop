import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Sun,
  Moon,
  LogIn,
  PhoneCall,
  LayoutDashboard,
} from "lucide-react";
import { SiteSetting } from "../../types/index.js";

interface HeaderProps {
  settings: SiteSetting;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function Header({
  settings,
  darkMode,
  setDarkMode,
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Kiểm tra token xem đã đăng nhập admin chưa để hiện shortcut admin dashboard
  const token = localStorage.getItem("vietkey_admin_token");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Trang chủ", path: "/" },
    { name: "Mẫu Landing Page", path: "/landing-pages" },
    { name: "Dịch vụ thiết kế", path: "/services" },
    { name: "Bảng giá", path: "/pricing" },
    { name: "Blog SEO", path: "/blog" },
    { name: "Liên hệ", path: "/contact" },
  ];

  const currentPath = location.pathname;

  return (
    <header
      id="global-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background-secondary/80 dark:bg-background/80 backdrop-blur-md shadow-md border-b border-border py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center group"
            aria-label="VietKey Shop"
          >
            <img
              src="/logo1.png"
              alt="VietKey Shop"
              className="h-11 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive =
                link.path === "/"
                  ? currentPath === "/"
                  : currentPath.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "text-primary dark:text-[#818CF8] bg-badge-bg font-semibold"
                      : "text-slate-700 dark:text-slate-350 hover:text-primary dark:hover:text-[#818CF8] hover:bg-slate-100 dark:hover:bg-slate-800/40"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <button
              id="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg border border-border text-foreground-secondary hover:bg-card-hover transition"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-primary" />
              )}
            </button>

            {token ? (
              <Link
                to="/admin/dashboard"
                className="flex items-center space-x-1.5 px-4 py-2 border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 hover:bg-indigo-100/50 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-semibold transition"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Admin Panel</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-white transition"
                title="Đăng nhập Admin"
              >
                <LogIn className="w-4.5 h-4.5" />
              </Link>
            )}

            {/* Hotline CTA */}
            <a
              id="hotline-btn"
              href={`tel:${settings.hotline.replace(/\./g, "")}`}
              className="flex items-center space-x-2 px-4.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm shadow-indigo-100 hover:shadow duration-200 transition"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{settings.hotline}</span>
            </a>
          </div>

          {/* Mobile Right Icons & Menu button */}
          <div className="flex items-center md:hidden space-x-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg border border-border text-foreground-secondary transition"
            >
              {darkMode ? (
                <Sun className="w-4.5 h-4.5 text-amber-400" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-primary" />
              )}
            </button>

            {token && (
              <Link to="/admin/dashboard" className="p-2 text-primary">
                <LayoutDashboard className="w-5 h-5" />
              </Link>
            )}

            <button
              id="mobile-menu-btn"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-card border border-border text-foreground-secondary hover:text-foreground focus:outline-none"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background-secondary border-b border-border shadow-xl transition-all p-4 space-y-2 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive =
                link.path === "/"
                  ? currentPath === "/"
                  : currentPath.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-xl text-base font-medium transition ${
                    isActive
                      ? "text-primary dark:text-[#818CF8] bg-badge-bg font-semibold"
                      : "text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800/40"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
          <div className="border-t border-border my-3 pt-3 flex flex-col space-y-2">
            <a
              href={`tel:${settings.hotline.replace(/\./g, "")}`}
              className="flex items-center justify-center space-x-2 w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-xl text-base font-bold shadow-sm shadow-indigo-100"
            >
              <PhoneCall className="w-5 h-5" />
              <span>Gọi tư vấn: {settings.hotline}</span>
            </a>
            {!token && (
              <Link
                to="/admin/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center space-x-2 w-full py-2.5 border border-border text-foreground-secondary hover:bg-card-hover rounded-xl text-sm font-medium"
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng nhập nội bộ (Admin)</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
