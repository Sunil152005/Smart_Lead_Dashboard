import React, { useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  UserCheck,
  Lock,
  Mail,
  User,
  ArrowRight,
  Zap,
} from "lucide-react";
import API from "../api";
import { useToast } from "../context/ToastContext";

export const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"ADMIN" | "SALES">("SALES");
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isRegister && !name)) {
      showToast("Please fill in all required fields.", "warning");
      return;
    }

    setLoading(true);
    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const payload = isRegister
        ? { name, email, password, role }
        : { email, password };

      const res = await API.post(endpoint, payload);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role || "SALES");
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      showToast(
        isRegister ? "Account created! Welcome to Smart Lead CRM." : "Login successful! Welcome back.",
        "success"
      );

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 400);
    } catch (error: any) {
      console.error(error);
      const msg =
        error.response?.data?.message || "Authentication failed. Please check credentials.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoRole: "ADMIN" | "SALES") => {
    setLoading(true);
    const demoEmail = demoRole === "ADMIN" ? "rahul@gmail.com" : "priya@sales.com";
    const demoPassword = "123456";

    setEmail(demoEmail);
    setPassword(demoPassword);

    try {
      const res = await API.post("/auth/login", {
        email: demoEmail,
        password: demoPassword,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role || demoRole);
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      showToast(`Logged in as ${demoRole === "ADMIN" ? "Admin (Rahul Sharma)" : "Sales Rep (Priya Patel)"}!`, "success");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 400);
    } catch (error: any) {
      console.error(error);
      showToast("Failed to connect to backend demo server.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-blue-50 flex flex-col justify-center items-center p-4 relative font-sans text-slate-900">
      {/* Soft luminous background decorative orbs */}
      <div className="absolute top-12 left-1/4 w-80 h-80 bg-indigo-200/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 right-1/4 w-80 h-80 bg-blue-200/50 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="mb-6 text-center z-10 max-w-lg">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-200 shadow-sm text-indigo-700 text-xs font-bold mb-3">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Smart Lead Dashboard CRM</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
          Smart Sales & Lead Management
        </h1>
        <p className="text-sm text-slate-600 mt-1.5 font-medium">
          Automated AI scoring, stage tracking, and instant 1-click workflows.
        </p>
      </div>

      {/* Main Clean White Card */}
      <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-7 sm:p-8 shadow-xl shadow-indigo-100/60 z-10">
        {/* 1-Click Instant Demo Access */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-50/80 to-blue-50/80 border border-indigo-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 mb-2.5">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>1-Click Instant Demo Login:</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin("ADMIN")}
              disabled={loading}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all transform active:scale-95 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin (Rahul)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin("SALES")}
              disabled={loading}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-sm transition-all transform active:scale-95 cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Sales (Priya)</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher (Sign In / Register) */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl mb-5 border border-slate-200/80">
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              !isRegister
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(true)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              isRegister
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required={isRegister}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rahul@gmail.com"
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Account Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "ADMIN" | "SALES")}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
              >
                <option value="SALES">Sales Representative (Create & Manage Leads)</option>
                <option value="ADMIN">Admin Manager (Full Access & Delete)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md shadow-indigo-200 transition-all transform active:scale-98 cursor-pointer mt-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{isRegister ? "Register & Enter Dashboard" : "Sign In to Dashboard"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Credentials Info */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          <p className="font-semibold text-slate-700 mb-1">Demo Credentials:</p>
          <p className="text-slate-600">
            Admin: <span className="text-indigo-600 font-bold font-mono">rahul@gmail.com</span> (Password: <span className="font-mono font-bold">123456</span>)
          </p>
          <p className="text-slate-600 mt-0.5">
            Sales: <span className="text-emerald-600 font-bold font-mono">priya@sales.com</span> (Password: <span className="font-mono font-bold">123456</span>)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;