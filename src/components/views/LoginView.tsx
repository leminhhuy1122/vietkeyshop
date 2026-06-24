import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  AlertCircle,
} from "lucide-react";

export default function LoginView() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Nếu có token sẵn, điều hướng thẳng tới dashboard
    const token = localStorage.getItem("vietkey_admin_token");
    if (token) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("vietkey_admin_token", data.token);
        localStorage.setItem("vietkey_admin_user", JSON.stringify(data.user));
        // Kích hoạt reload nhẹ để header nhận diện trạng thái login mới
        window.location.href = "/admin/dashboard";
      } else {
        setErrorMsg(data.message || "Email hoặc mật khẩu không chính xác.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Không thể kết nối máy chủ API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="login-view"
      className="pt-32 pb-20 min-h-screen flex items-center justify-center bg-slate-50/20 dark:bg-[#0c0f17]/10"
    >
      <div className="w-full max-w-md px-4">
        {/* Card Box */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-8 shadow-sm relative overflow-hidden">
          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-center mx-auto shadow-sm text-indigo-600 dark:text-indigo-400 animate-pulse">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Khu Vực Quản Trị
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              VietKey Shop - Quản lý Leads, Sản phẩm và Tin Tức SEO
            </p>
          </div>

          {errorMsg && (
            <div className="mb-5 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs flex items-start space-x-2">
              <AlertCircle className="w-4.5 h-4.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Tài khoản Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="admin@vietkey.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/85 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm dark:text-white font-normal"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/85 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm dark:text-white font-normal"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5" />
                  ) : (
                    <Eye className="w-4.5 h-4.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Recover */}
            <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <span className="text-slate-400 italic">VietKey Staff Only</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl text-sm font-semibold shadow-sm shadow-indigo-100 hover:shadow-indigo-500/20 active:scale-98 transition flex items-center justify-center space-x-1.5"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span>Đăng Nhập Quản Trị</span>
              )}
            </button>
          </form>

          {/* Quick Info Credentials for user testing directly */}
          <div className="mt-8 border-t border-slate-100 dark:border-slate-800/80 pt-4 text-center">
            <p className="text-[11px] text-slate-400 font-medium">
              Tài khoản trải nghiệm nhanh:
            </p>
            <div className="mt-2 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl text-[10px] text-slate-500 dark:text-slate-400 space-y-1 font-mono">
              <p>
                Email:{" "}
                <span className="font-bold select-all text-indigo-600 dark:text-indigo-400">
                  admin@vietkey.vn
                </span>{" "}
                / Pass:{" "}
                <span className="font-bold select-all text-indigo-600 dark:text-indigo-400">
                  admin123
                </span>
              </p>
              <p>
                Email:{" "}
                <span className="font-bold select-all text-indigo-500">
                  editor@vietkey.vn
                </span>{" "}
                / Pass:{" "}
                <span className="font-bold select-all text-indigo-500">
                  editor123
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
