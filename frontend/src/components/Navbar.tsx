import React from "react";
import {
  Sparkles,
  LayoutGrid,
  Table as TableIcon,
  BarChart3,
  Moon,
  Sun,
  LogOut,
  UserCheck,
  Plus,
  Upload,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface NavbarProps {
  currentView: "kanban" | "table" | "analytics";
  setCurrentView: (view: "kanban" | "table" | "analytics") => void;
  role: string | null;
  userName: string;
  onOpenCreateModal: () => void;
  onOpenImportModal: () => void;
  onLogout: () => void;
  onQuickSwitchRole: (targetRole: "ADMIN" | "SALES") => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  role,
  userName,
  onOpenCreateModal,
  onOpenImportModal,
  onLogout,
  onQuickSwitchRole,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white font-bold text-lg">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                    Smart Lead CRM
                  </h1>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    AI 2.0
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Real-time Active</span>
                </div>
              </div>
            </div>

            {/* Navigation Switcher */}
            <nav className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60 ml-4">
              <button
                onClick={() => setCurrentView("kanban")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentView === "kanban"
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Pipeline Kanban
              </button>
              <button
                onClick={() => setCurrentView("table")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentView === "table"
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <TableIcon className="w-4 h-4" />
                Data Grid
              </button>
              <button
                onClick={() => setCurrentView("analytics")}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentView === "analytics"
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Analytics & Insights
              </button>
            </nav>
          </div>

          {/* Action Buttons & User Menu */}
          <div className="flex items-center gap-3">
            {/* Quick Actions */}
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-md shadow-indigo-500/25 transition-all transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Lead</span>
            </button>

            <button
              onClick={onOpenImportModal}
              title="Import leads from CSV"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-indigo-500" />
              <span>Import</span>
            </button>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* User Profile & Role Switcher */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  {userName || (role === "ADMIN" ? "Rahul Sharma" : "Priya Patel")}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    role === "ADMIN"
                      ? "text-purple-600 dark:text-purple-400"
                      : "text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {role || "SALES"}
                </span>
              </div>

              {/* 1-Click Role Switcher Pill */}
              <button
                onClick={() =>
                  onQuickSwitchRole(role === "ADMIN" ? "SALES" : "ADMIN")
                }
                title={`Switch account to ${
                  role === "ADMIN" ? "Sales Rep (Priya)" : "Admin (Rahul)"
                }`}
                className="hidden sm:flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 transition-colors"
              >
                <UserCheck className="w-3 h-3" />
                <span>Switch to {role === "ADMIN" ? "Sales" : "Admin"}</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                title="Logout"
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setCurrentView("kanban")}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold ${
              currentView === "kanban"
                ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50"
                : "text-slate-500"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Pipeline
          </button>
          <button
            onClick={() => setCurrentView("table")}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold ${
              currentView === "table"
                ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50"
                : "text-slate-500"
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            Data Grid
          </button>
          <button
            onClick={() => setCurrentView("analytics")}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold ${
              currentView === "analytics"
                ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50"
                : "text-slate-500"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Insights
          </button>
        </div>
      </div>
    </header>
  );
};
