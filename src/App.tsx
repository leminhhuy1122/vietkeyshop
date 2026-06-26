import { lazy, Suspense, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { SiteSetting } from "./types/index.js";

const EMPTY_SETTINGS: SiteSetting = {
  id: "",
  logo: "/logo1.png",
  hotline: "",
  email: "",
  contactEmail: "",
  zalo: "",
  facebook: "",
  tiktok: "",
  youtube: "",
  analytics: "",
  gtm: "",
  brandPrimaryColor: "#9A3412",
  brandSecondaryColor: "#EA580C",
  brandAccentColor: "#F59E0B",
  brandHeaderColor: "#FFFDFC",
  brandFooterColor: "#0F172A",
  brandButtonColor: "#9A3412",
  brandTitleColor: "#3F190F",
  brandFontFamily: "Inter",
  brandFontSource: "preset",
  brandFontUrl: "",
};

// Shared shell loads immediately; views are split per route for faster first paint.
import Header from "./components/shared/Header.tsx";
import Footer from "./components/shared/Footer.tsx";

const HomeView = lazy(() => import("./components/views/HomeView.tsx"));
const LandingPagesView = lazy(() => import("./components/views/LandingPagesView.tsx"));
const ServicesView = lazy(() => import("./components/views/ServicesView.tsx"));
const PricingView = lazy(() => import("./components/views/PricingView.tsx"));
const BlogView = lazy(() => import("./components/views/BlogView.tsx"));
const ContactView = lazy(() => import("./components/views/ContactView.tsx"));
const LoginView = lazy(() => import("./components/views/LoginView.tsx"));
const AdminDashboardView = lazy(() => import("./components/views/AdminDashboardView.tsx"));

function AppContent() {
  const location = useLocation();
  const [settings, setSettings] = useState<SiteSetting>(EMPTY_SETTINGS);
  const [hydrating, setHydrating] = useState(true);
  const [refreshSettings, setRefreshSettings] = useState(false);

  // Darkmode state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("vietkey_theme");
    if (saved) {
      return saved === "dark";
    }
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // Dong bo Site Settings tu API - luon lay tu DB, khong dung localStorage
  useEffect(() => {
    const loaderTimer = window.setTimeout(() => setHydrating(false), 450);
    const controller = new AbortController();

    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings", {
          signal: controller.signal,
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          // Merge vao EMPTY_SETTINGS de dam bao tat ca field ton tai
          // Khong dung DEFAULT_SETTINGS co hardcode de tranh ghi de du lieu DB
          setSettings({ ...EMPTY_SETTINGS, ...data });
        }
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          console.error("Loi lay cai dat web:", err);
        }
      } finally {
        setRefreshSettings(false);
        window.clearTimeout(loaderTimer);
        setHydrating(false);
      }
    };

    fetchSettings();

    return () => {
      window.clearTimeout(loaderTimer);
      controller.abort();
    };
  }, [refreshSettings]);

  // Dong bo class dark vao document.documentElement
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("vietkey_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("vietkey_theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const root = document.documentElement;
    const fontFamily = settings.brandFontFamily || "Inter";
    const safeFontFamily = fontFamily.replace(/[^a-zA-Z0-9 _-]/g, "").trim() || "Inter";
    const bodyFont = `"${safeFontFamily}", "Inter", "Segoe UI", sans-serif`;

    const primaryColor = settings.brandPrimaryColor || "#9A3412";
    const secondaryColor = settings.brandSecondaryColor || "#EA580C";
    const accentColor = settings.brandAccentColor || "#F59E0B";
    const buttonColor = settings.brandButtonColor || primaryColor;
    const titleColor = settings.brandTitleColor || "#3F190F";

    root.style.setProperty("--primary", primaryColor);
    root.style.setProperty("--primary-hover", secondaryColor);
    root.style.setProperty("--secondary", accentColor);
    root.style.setProperty("--brand-header", settings.brandHeaderColor || "#FFFDFC");
    root.style.setProperty("--brand-footer", settings.brandFooterColor || "#0F172A");
    root.style.setProperty("--brand-button", buttonColor);
    root.style.setProperty("--brand-title", titleColor);
    root.style.setProperty("--brand-accent", accentColor);
    root.style.setProperty("--brand-primary-soft", `color-mix(in srgb, ${primaryColor} 12%, transparent)`);
    root.style.setProperty("--brand-primary-muted", `color-mix(in srgb, ${primaryColor} 18%, white)`);
    root.style.setProperty("--font-sans", bodyFont);
    root.style.setProperty("--font-space", bodyFont);

    ["500", "600", "650", "700", "750"].forEach((shade) => {
      root.style.setProperty(`--color-indigo-${shade}`, primaryColor);
      root.style.setProperty(`--color-violet-${shade}`, primaryColor);
    });
    root.style.setProperty("--color-indigo-50", `color-mix(in srgb, ${primaryColor} 10%, white)`);
    root.style.setProperty("--color-indigo-100", `color-mix(in srgb, ${primaryColor} 18%, white)`);
    root.style.setProperty("--color-indigo-200", `color-mix(in srgb, ${primaryColor} 28%, white)`);
    root.style.setProperty("--color-orange-500", accentColor);
    root.style.setProperty("--color-amber-500", accentColor);

    const styleId = "uploaded-brand-font";
    document.getElementById(styleId)?.remove();
    if (settings.brandFontSource === "uploaded" && settings.brandFontUrl) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `@font-face { font-family: "${safeFontFamily}"; src: url("${settings.brandFontUrl}"); font-display: swap; }`;
      document.head.appendChild(style);
    }
  }, [settings]);

  // Admin dashboard hoan toan tach biet layout voi trang khach hang
  const isAdminArea = location.pathname.startsWith("/admin/dashboard");

  return (
    <div className={`flex flex-col min-h-screen ${isAdminArea ? "" : "vietkey-public-shell"}`}>
      {hydrating && (
        <div className="fixed inset-x-0 top-0 z-[70] h-1 bg-indigo-100/80 dark:bg-slate-800" aria-live="polite">
          <div className="h-full w-2/3 origin-left animate-[vietkey-load_450ms_ease-out_forwards] bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-400 shadow-[0_0_18px_rgba(79,70,229,0.45)]" />
        </div>
      )}
      {/* Chi hien thi Header neu khong nam trong admin areas dashboard */}
      {!isAdminArea && <Header settings={settings} darkMode={darkMode} setDarkMode={setDarkMode} />}

      <div className="flex-grow">
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <Routes>
          <Route path="/" element={<HomeView settings={settings} />} />
          <Route path="/landing-pages" element={<LandingPagesView settings={settings} />} />
          <Route path="/services" element={<ServicesView settings={settings} />} />
          <Route path="/pricing" element={<PricingView />} />
          <Route path="/blog" element={<BlogView settings={settings} />} />
          <Route path="/contact" element={<ContactView settings={settings} />} />
          <Route path="/admin/login" element={<LoginView />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminDashboardView
                settings={settings}
                setRefreshSettings={setRefreshSettings}
                onSettingsSaved={(updatedSettings) =>
                  setSettings({ ...EMPTY_SETTINGS, ...updatedSettings })
                }
              />
            }
          />
          {/* Fallback route */}
          <Route path="*" element={<HomeView settings={settings} />} />
        </Routes>
        </Suspense>
      </div>

      {/* Chi hien thi Footer neu khong nam trong admin areas dashboard */}
      {!isAdminArea && <Footer settings={settings} />}

      {/* Floating Zalo Button */}
      {!isAdminArea && settings.zalo && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 pointer-events-none">
          {/* Label prompt */}
          <a
            href={settings.zalo}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto hidden sm:flex items-center space-x-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl px-4 py-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/85 transition-all duration-200"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-100 tracking-wider uppercase">
              Tu Van Zalo Ngay
            </span>
          </a>
          
          {/* Main Round Pulsing Button */}
          <a
            href={settings.zalo}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto relative w-14 h-14 bg-[#0068FF] hover:bg-[#005AD2] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group ring-4 ring-white dark:ring-slate-900 animate-bounce"
            style={{ animationDuration: '4s' }}
          >
            {/* Ping ring */}
            <span className="absolute -inset-1 rounded-full bg-[#0068FF]/30 animate-pulse" />
            <span className="relative font-sans font-black text-[14px] italic tracking-tight select-none">
              Zalo
            </span>
          </a>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
