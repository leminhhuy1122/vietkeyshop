import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sun,
  Moon,
  LogIn,
  PhoneCall,
  LayoutDashboard,
  Home,
  Layers,
  Briefcase,
  BadgeDollarSign,
  BookOpen,
  MessageCircle,
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
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem("vietkey_admin_token");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Products", path: "/landing-pages", icon: Layers },
    { name: "Services", path: "/services", icon: Briefcase },
    { name: "Pricing", path: "/pricing", icon: BadgeDollarSign },
    { name: "Blog", path: "/blog", icon: BookOpen },
    { name: "Contact", path: "/contact", icon: MessageCircle },
  ];

  const mobileNavLinks = navLinks.filter((link) =>
    ["/", "/landing-pages", "/blog", "/contact"].includes(link.path),
  );

  const currentPath = location.pathname;

  return (
    <>
      <header
      id="global-header"
      className={`brand-header fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background-secondary/80 dark:bg-background/80 backdrop-blur-md shadow-md border-b border-border py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center group"
            aria-label="VietKey Shop"
          >
            <img
              src={settings.logo || "/logo1.png"}
              alt="VietKey Shop"
              className="h-11 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </Link>

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

          <div className="hidden md:flex items-center space-x-3">
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
                title="Admin login"
                aria-label="Admin login"
              >
                <LogIn className="w-4.5 h-4.5" />
              </Link>
            )}

            <a
              id="hotline-btn"
              href={`tel:${settings.hotline.replace(/\./g, "")}`}
              className="brand-button flex items-center space-x-2 px-4.5 py-2 text-white rounded-lg text-xs font-semibold shadow-sm hover:shadow duration-200 transition"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{settings.hotline}</span>
            </a>
          </div>

          <div className="flex items-center md:hidden space-x-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="min-w-11 min-h-11 rounded-full border border-border bg-card text-foreground-secondary transition flex items-center justify-center active:scale-95"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <Sun className="w-4.5 h-4.5 text-amber-400" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-primary" />
              )}
            </button>

            {token && (
              <Link
                to="/admin/dashboard"
                className="min-w-11 min-h-11 rounded-full text-primary flex items-center justify-center active:scale-95"
                aria-label="Admin dashboard"
              >
                <LayoutDashboard className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </div>
      </header>

      <nav className="fixed inset-x-5 bottom-3 z-[80] md:hidden rounded-[1.75rem] bg-slate-950/92 text-white shadow-[0_18px_50px_rgba(15,23,42,0.32)] backdrop-blur-xl ring-1 ring-white/10">
        <div className="grid grid-cols-4 gap-1 p-2">
          {mobileNavLinks.map((link) => {
            const isActive =
              link.path === "/"
                ? currentPath === "/"
                : currentPath.startsWith(link.path);
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                aria-label={link.name}
                className={`min-h-11 rounded-2xl flex items-center justify-center transition active:scale-95 ${
                  isActive
                    ? "bg-[#F97316] text-white shadow-lg shadow-orange-500/25"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
