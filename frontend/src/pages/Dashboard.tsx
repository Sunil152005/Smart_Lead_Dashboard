import React, { useEffect, useState, useCallback } from "react";
import { CSVLink } from "react-csv";
import {
  Search,
  Download,
  Trash2,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Plus,
  Upload,
  UserCheck,
  LogOut,
  Sparkles,
  Flame,
  Zap,
  Snowflake,
  Mail,
  Phone,
  Edit2,
  Building2,
  DollarSign,
  Trophy,
  Percent,
  Target,
  Layers,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import API from "../api";
import { LeadDrawer } from "../components/LeadDrawer";
import { LeadModal } from "../components/LeadModal";
import { ImportModal } from "../components/ImportModal";
import { useToast } from "../context/ToastContext";
import type { ILead, LeadStatus, AnalyticsData, LeadFilterOptions } from "../types";

export const Dashboard: React.FC = () => {
  const [leads, setLeads] = useState<ILead[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);

  // User state
  const role = localStorage.getItem("role");
  const [userName, setUserName] = useState<string>("Sales Rep");

  // Filters and Pagination
  const [filters, setFilters] = useState<LeadFilterOptions>({
    search: "",
    status: "ALL",
    source: "ALL",
    priority: "ALL",
    assignedTo: "ALL",
    category: "ALL",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
  });

  const [activeQuickFilter, setActiveQuickFilter] = useState<string>("ALL");
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);

  // Selected leads for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals and Drawer state
  const [selectedLead, setSelectedLead] = useState<ILead | null>(null);
  const [editingLead, setEditingLead] = useState<ILead | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const { showToast } = useToast();

  // Load User details
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setUserName(u.name || (role === "ADMIN" ? "Rahul Sharma" : "Priya Patel"));
      } catch (e) {
        setUserName(role === "ADMIN" ? "Rahul Sharma" : "Priya Patel");
      }
    } else {
      setUserName(role === "ADMIN" ? "Rahul Sharma" : "Priya Patel");
    }
  }, [role]);

  // Fetch Leads from Backend
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.status && filters.status !== "ALL") params.append("status", filters.status);
      if (filters.source && filters.source !== "ALL") params.append("source", filters.source);
      if (filters.priority && filters.priority !== "ALL") params.append("priority", filters.priority);
      if (filters.assignedTo && filters.assignedTo !== "ALL") params.append("assignedTo", filters.assignedTo);
      if (filters.category && filters.category !== "ALL") params.append("category", filters.category);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);
      params.append("page", String(filters.page));
      params.append("limit", "15");

      const res = await API.get(`/leads?${params.toString()}`);
      setLeads(res.data.leads || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalLeads(res.data.totalLeads || 0);
    } catch (error: any) {
      console.error("Fetch Leads Error:", error);
      showToast("Failed to load leads from server.", "error");
    } finally {
      setLoading(false);
    }
  }, [filters, showToast]);

  // Fetch Analytics from Backend
  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await API.get("/leads/analytics");
      setAnalytics(res.data);
    } catch (error) {
      console.error("Fetch Analytics Error:", error);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
    fetchAnalytics();
  }, [fetchLeads, fetchAnalytics]);

  // Quick Filter Presets
  const applyQuickFilter = (preset: string) => {
    setActiveQuickFilter(preset);
    if (preset === "ALL") {
      setFilters((prev) => ({ ...prev, status: "ALL", category: "ALL", search: "", page: 1 }));
    } else if (preset === "HOT") {
      setFilters((prev) => ({ ...prev, category: "Hot", status: "ALL", page: 1 }));
    } else if (preset === "WON") {
      setFilters((prev) => ({ ...prev, status: "Won", category: "ALL", page: 1 }));
    } else if (preset === "QUALIFIED") {
      setFilters((prev) => ({ ...prev, status: "Qualified", category: "ALL", page: 1 }));
    } else if (preset === "PROPOSAL") {
      setFilters((prev) => ({ ...prev, status: "Proposal Sent", category: "ALL", page: 1 }));
    }
  };

  // Handle Create Lead
  const handleCreateLead = async (leadData: Partial<ILead>) => {
    try {
      await API.post("/leads", leadData);
      showToast("New lead created with Smart AI Score!", "success");
      fetchLeads();
      fetchAnalytics();
    } catch (error: any) {
      console.error(error);
      showToast(error.response?.data?.message || "Failed to create lead", "error");
    }
  };

  // Handle Update Lead
  const handleUpdateLead = async (leadData: Partial<ILead>) => {
    if (!editingLead) return;
    try {
      const res = await API.put(`/leads/${editingLead._id}`, leadData);
      showToast("Lead updated successfully!", "success");
      setEditingLead(null);
      if (selectedLead && selectedLead._id === editingLead._id) {
        setSelectedLead(res.data);
      }
      fetchLeads();
      fetchAnalytics();
    } catch (error: any) {
      console.error(error);
      showToast(error.response?.data?.message || "Failed to update lead", "error");
    }
  };

  // Handle Update Stage Status
  const handleUpdateStatus = async (id: string, newStatus: LeadStatus) => {
    try {
      const res = await API.put(`/leads/${id}`, { status: newStatus });
      showToast(`Stage updated to "${newStatus}"!`, "success");
      if (selectedLead && selectedLead._id === id) {
        setSelectedLead(res.data);
      }
      fetchLeads();
      fetchAnalytics();
    } catch (error: any) {
      console.error(error);
      showToast("Failed to update status", "error");
    }
  };

  // Handle Add Note
  const handleAddNote = async (
    id: string,
    content: string,
    type: "note" | "call" | "email"
  ) => {
    try {
      const res = await API.post(`/leads/${id}/notes`, { content, type });
      showToast("Activity note added to timeline!", "success");
      setSelectedLead(res.data);
      fetchLeads();
      fetchAnalytics();
    } catch (error: any) {
      console.error(error);
      showToast("Failed to add note", "error");
    }
  };

  // Handle Delete Single Lead
  const handleDeleteLead = async (id: string, name: string) => {
    if (role !== "ADMIN") {
      showToast("Only Admins have permission to delete leads.", "warning");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete lead "${name}"?`)) {
      return;
    }

    try {
      await API.delete(`/leads/${id}`);
      showToast(`Lead "${name}" deleted.`, "success");
      if (selectedLead?._id === id) setSelectedLead(null);
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      fetchLeads();
      fetchAnalytics();
    } catch (error: any) {
      console.error(error);
      showToast(error.response?.data?.message || "Failed to delete lead", "error");
    }
  };

  // Handle Bulk Delete
  const handleBulkDelete = async () => {
    if (role !== "ADMIN") {
      showToast("Only Admins can delete leads in bulk.", "warning");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedIds.length} selected leads?`
      )
    ) {
      return;
    }

    try {
      await API.post("/leads/bulk-delete", { ids: selectedIds });
      showToast(`${selectedIds.length} leads deleted successfully.`, "success");
      setSelectedIds([]);
      fetchLeads();
      fetchAnalytics();
    } catch (error: any) {
      console.error(error);
      showToast("Bulk delete failed", "error");
    }
  };

  // Handle Bulk Status Change
  const handleBulkStatusChange = async (newStatus: LeadStatus) => {
    try {
      await API.post("/leads/bulk-update", {
        ids: selectedIds,
        updates: { status: newStatus },
      });
      showToast(`${selectedIds.length} leads moved to "${newStatus}".`, "success");
      setSelectedIds([]);
      fetchLeads();
      fetchAnalytics();
    } catch (error: any) {
      console.error(error);
      showToast("Bulk update failed", "error");
    }
  };

  // Handle CSV Batch Import
  const handleImportLeads = async (importedLeads: Partial<ILead>[]) => {
    try {
      const res = await API.post("/leads/import", { leads: importedLeads });
      showToast(res.data.message || "Leads imported successfully!", "success");
      fetchLeads();
      fetchAnalytics();
    } catch (error: any) {
      console.error(error);
      showToast("Import failed. Please check CSV format.", "error");
    }
  };

  // Sorting Handler
  const handleSort = (field: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  // Toggle Selection
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === leads.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(leads.map((l) => l._id));
    }
  };

  // Quick Switch Role (between Admin and Sales)
  const handleQuickSwitchRole = async (targetRole: "ADMIN" | "SALES") => {
    const targetEmail = targetRole === "ADMIN" ? "rahul@gmail.com" : "priya@sales.com";
    try {
      const res = await API.post("/auth/login", {
        email: targetEmail,
        password: "123456",
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
      showToast(`Switched account to ${targetRole === "ADMIN" ? "Rahul (Admin)" : "Priya (Sales Rep)"}!`, "info");
      window.location.reload();
    } catch (e) {
      showToast("Failed to switch role.", "error");
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setActiveQuickFilter("ALL");
    setFilters({
      search: "",
      status: "ALL",
      source: "ALL",
      priority: "ALL",
      assignedTo: "ALL",
      category: "ALL",
      sortBy: "createdAt",
      sortOrder: "desc",
      page: 1,
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    showToast("Logged out successfully.", "info");
    window.location.href = "/";
  };

  const formatCurrency = (val: number = 0) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`;
    return `$${val.toLocaleString()}`;
  };

  const renderSortIcon = (field: string) => {
    if (filters.sortBy !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-60" />;
    }
    return filters.sortOrder === "asc" ? (
      <ChevronUp className="w-3.5 h-3.5 text-indigo-600 font-bold" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5 text-indigo-600 font-bold" />
    );
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Won":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Proposal Sent":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Qualified":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "In Progress":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "Contacted":
        return "bg-sky-100 text-sky-800 border-sky-300";
      case "Lost":
        return "bg-rose-100 text-rose-800 border-rose-300";
      default:
        return "bg-indigo-100 text-indigo-800 border-indigo-300";
    }
  };

  // Prepare CSV Export Data
  const csvData = leads.map((l) => ({
    ID: l._id,
    Name: l.name,
    Email: l.email,
    Phone: l.phone || "",
    Company: l.company || "",
    JobTitle: l.jobTitle || "",
    DealValue: l.dealValue || 0,
    Currency: l.currency || "USD",
    Status: l.status,
    Priority: l.priority,
    Source: l.source,
    LeadScore: l.leadScore,
    Category: l.leadScoreCategory,
    AssignedTo: l.assignedTo,
    FollowUpDate: l.followUpDate ? new Date(l.followUpDate).toISOString().split("T")[0] : "",
    CreatedAt: new Date(l.createdAt).toISOString(),
  }));

  const pipelineStages = [
    { key: "New", label: "New", color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-200" },
    { key: "Contacted", label: "Contacted", color: "text-sky-600", bg: "bg-sky-50 border-sky-200" },
    { key: "In Progress", label: "In Progress", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
    { key: "Qualified", label: "Qualified", color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
    { key: "Proposal Sent", label: "Proposal", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
    { key: "Won", label: "Won 🏆", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
    { key: "Lost", label: "Lost", color: "text-rose-600", bg: "bg-rose-50 border-rose-200" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 text-slate-900 font-sans">
      {/* Top Clean White Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center shadow-md shadow-indigo-200 text-white font-bold">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-lg text-slate-900 tracking-tight">
                    Smart Lead Dashboard
                  </h1>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 border border-indigo-200">
                    CRM Pro
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Real-time sales & prospect intelligence
                </p>
              </div>
            </div>

            {/* Actions & Profile */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md shadow-indigo-200 transition-all transform active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Lead</span>
              </button>

              <button
                onClick={() => setIsImportModalOpen(true)}
                title="Import Leads from CSV"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4 text-indigo-600" />
                <span>Import CSV</span>
              </button>

              <CSVLink
                data={csvData}
                filename={`smart_leads_${new Date().toISOString().split("T")[0]}.csv`}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </CSVLink>

              {/* User Profile Pill */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-900">{userName}</span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      role === "ADMIN" ? "text-purple-600" : "text-blue-600"
                    }`}
                  >
                    {role || "SALES"}
                  </span>
                </div>

                {/* 1-Click Role Switcher */}
                <button
                  onClick={() =>
                    handleQuickSwitchRole(role === "ADMIN" ? "SALES" : "ADMIN")
                  }
                  title={`Switch to ${role === "ADMIN" ? "Sales (Priya)" : "Admin (Rahul)"}`}
                  className="hidden sm:flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Switch to {role === "ADMIN" ? "Sales" : "Admin"}</span>
                </button>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Single-Page Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 1. Colorful Smart KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Pipeline Value */}
          <div className="p-4 rounded-2xl bg-white border border-blue-200/90 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-500">Pipeline Value</span>
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {formatCurrency(analytics?.pipelineValue)}
            </div>
            <p className="text-[11px] font-semibold text-blue-700 mt-1">
              {analytics?.totalLeads || 0} active prospects
            </p>
          </div>

          {/* Won Revenue */}
          <div className="p-4 rounded-2xl bg-white border border-emerald-200/90 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-500">Won Revenue</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {formatCurrency(analytics?.wonRevenue)}
            </div>
            <p className="text-[11px] font-semibold text-emerald-700 mt-1">
              {analytics?.statusCounts?.Won?.count || 0} deals closed won
            </p>
          </div>

          {/* Conversion Rate */}
          <div className="p-4 rounded-2xl bg-white border border-purple-200/90 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-500">Win Rate</span>
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {analytics?.conversionRate || 0}%
            </div>
            <p className="text-[11px] font-semibold text-purple-700 mt-1">
              Lead-to-client conversion
            </p>
          </div>

          {/* Hot AI Leads */}
          <div className="p-4 rounded-2xl bg-white border border-rose-200/90 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-500">Hot AI Leads 🔥</span>
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <Flame className="w-4 h-4 text-rose-600" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {analytics?.hotLeadsCount || 0}
            </div>
            <p className="text-[11px] font-semibold text-rose-700 mt-1">
              Score 75+ (High probability)
            </p>
          </div>

          {/* Average Deal Size */}
          <div className="p-4 rounded-2xl bg-white border border-cyan-200/90 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-500">Avg Deal Size</span>
              <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {formatCurrency(analytics?.avgDealSize)}
            </div>
            <p className="text-[11px] font-semibold text-cyan-700 mt-1">
              Per qualified customer
            </p>
          </div>
        </div>

        {/* 2. Interactive Pipeline Stage Visual Tracker */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Pipeline Stages Overview (Click to filter):
              </h3>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {pipelineStages.map((stage) => {
              const count = analytics?.statusCounts?.[stage.key]?.count || 0;
              const val = analytics?.statusCounts?.[stage.key]?.value || 0;
              const isSelected = filters.status === stage.key;

              return (
                <button
                  key={stage.key}
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      status: isSelected ? "ALL" : stage.key,
                      page: 1,
                    }))
                  }
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "ring-2 ring-indigo-600 bg-indigo-50/80 border-indigo-300 shadow-sm"
                      : `${stage.bg} hover:shadow-xs`
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-extrabold ${stage.color}`}>
                      {stage.label}
                    </span>
                    <span className="text-xs font-bold px-1.5 py-0.2 bg-white rounded-md text-slate-800 shadow-2xs">
                      {count}
                    </span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-600 mt-1">
                    {formatCurrency(val)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Search & Filter Bar */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full lg:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value, page: 1 })
                }
                placeholder="Search by name, company, email, tag..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto">
              <button
                onClick={() => applyQuickFilter("ALL")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeQuickFilter === "ALL" && filters.status === "ALL" && filters.category === "ALL"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                All Leads
              </button>

              <button
                onClick={() => applyQuickFilter("HOT")}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filters.category === "Hot"
                    ? "bg-rose-600 text-white shadow-sm"
                    : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>Hot Leads 🔥</span>
              </button>

              <button
                onClick={() => applyQuickFilter("PROPOSAL")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filters.status === "Proposal Sent"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                }`}
              >
                Proposals Sent
              </button>

              <button
                onClick={() => applyQuickFilter("WON")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filters.status === "Won"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                }`}
              >
                Won Deals 🏆
              </button>

              {/* Source Filter Dropdown */}
              <select
                value={filters.source}
                onChange={(e) =>
                  setFilters({ ...filters, source: e.target.value, page: 1 })
                }
                className="text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Channels</option>
                <option value="Website">Website</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Instagram">Instagram</option>
                <option value="Google Ads">Google Ads</option>
                <option value="Referral">Referral</option>
                <option value="Cold Outreach">Cold Outreach</option>
                <option value="Event">Event</option>
              </select>

              {/* Priority Filter Dropdown */}
              <select
                value={filters.priority}
                onChange={(e) =>
                  setFilters({ ...filters, priority: e.target.value, page: 1 })
                }
                className="text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Priority</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. Bulk Action Banner (when items are selected) */}
        {selectedIds.length > 0 && (
          <div className="p-3 rounded-2xl bg-indigo-900 text-white shadow-lg flex flex-wrap items-center justify-between gap-3 animate-slide-up">
            <div className="flex items-center gap-2 text-xs font-bold pl-2">
              <CheckSquare className="w-4 h-4 text-indigo-300" />
              <span>{selectedIds.length} leads selected</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-indigo-200">Move to:</span>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleBulkStatusChange(e.target.value as LeadStatus);
                  }
                }}
                defaultValue=""
                className="bg-indigo-950 text-white text-xs font-bold px-2.5 py-1 rounded-lg border border-indigo-700 cursor-pointer"
              >
                <option value="" disabled>
                  Select stage...
                </option>
                <option value="Contacted">Contacted</option>
                <option value="In Progress">In Progress</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>

              {role === "ADMIN" && (
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Selected</span>
                </button>
              )}

              <button
                onClick={() => setSelectedIds([])}
                className="px-2.5 py-1 rounded-lg text-xs text-indigo-200 hover:text-white"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* 5. Clean, Bright Lead Data Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/90 border-b border-slate-200 text-xs font-extrabold text-slate-600 uppercase tracking-wider select-none">
                  <th className="p-4 w-10">
                    <input
                      type="checkbox"
                      checked={leads.length > 0 && selectedIds.length === leads.length}
                      onChange={handleToggleSelectAll}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                  </th>
                  <th
                    onClick={() => handleSort("name")}
                    className="p-4 cursor-pointer hover:bg-slate-200/70 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Lead Contact & Account</span>
                      {renderSortIcon("name")}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort("dealValue")}
                    className="p-4 cursor-pointer hover:bg-slate-200/70 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Deal Value</span>
                      {renderSortIcon("dealValue")}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort("leadScore")}
                    className="p-4 cursor-pointer hover:bg-slate-200/70 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>AI Score</span>
                      {renderSortIcon("leadScore")}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort("status")}
                    className="p-4 cursor-pointer hover:bg-slate-200/70 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Pipeline Stage</span>
                      {renderSortIcon("status")}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort("priority")}
                    className="p-4 cursor-pointer hover:bg-slate-200/70 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Priority</span>
                      {renderSortIcon("priority")}
                    </div>
                  </th>
                  <th className="p-4">Channel & Owner</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs font-bold text-slate-500">
                          Loading leads...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-12 text-center">
                      <div className="max-w-sm mx-auto">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mx-auto mb-2">
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-base">
                          No leads found
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          Try searching for a different keyword or reset filters.
                        </p>
                        <button
                          onClick={handleResetFilters}
                          className="mt-3 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white"
                        >
                          Reset Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => {
                    const isSelected = selectedIds.includes(lead._id);

                    return (
                      <tr
                        key={lead._id}
                        onClick={() => setSelectedLead(lead)}
                        className={`cursor-pointer hover:bg-indigo-50/40 transition-colors ${
                          isSelected ? "bg-indigo-50/60" : ""
                        }`}
                      >
                        {/* Checkbox */}
                        <td
                          className="p-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(lead._id)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>

                        {/* Name & Company */}
                        <td className="p-4">
                          <div className="font-extrabold text-slate-900 hover:text-indigo-600 transition-colors">
                            {lead.name}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="font-semibold text-slate-700">
                              {lead.company || "Individual"}
                            </span>
                            <span>•</span>
                            <span>{lead.email}</span>
                          </div>
                        </td>

                        {/* Deal Value */}
                        <td className="p-4">
                          <div className="font-extrabold text-slate-900 text-base">
                            ${(lead.dealValue || 0).toLocaleString()}
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            {lead.currency || "USD"}
                          </span>
                        </td>

                        {/* Smart AI Score */}
                        <td className="p-4">
                          <div
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
                              lead.leadScoreCategory === "Hot"
                                ? "bg-rose-100 text-rose-800 border border-rose-300"
                                : lead.leadScoreCategory === "Warm"
                                ? "bg-amber-100 text-amber-800 border border-amber-300"
                                : "bg-slate-100 text-slate-700 border border-slate-300"
                            }`}
                          >
                            {lead.leadScoreCategory === "Hot" && (
                              <Flame className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                            )}
                            {lead.leadScoreCategory === "Warm" && (
                              <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                            )}
                            {lead.leadScoreCategory === "Cold" && (
                              <Snowflake className="w-3.5 h-3.5 text-slate-500" />
                            )}
                            <span>{lead.leadScore || 50} pts</span>
                          </div>
                        </td>

                        {/* Stage Dropdown */}
                        <td
                          className="p-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <select
                            value={lead.status}
                            onChange={(e) =>
                              handleUpdateStatus(lead._id, e.target.value as LeadStatus)
                            }
                            className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:outline-none ${getStatusBadgeClass(
                              lead.status
                            )}`}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Qualified">Qualified</option>
                            <option value="Proposal Sent">Proposal Sent</option>
                            <option value="Won">Won 🏆</option>
                            <option value="Lost">Lost</option>
                          </select>
                        </td>

                        {/* Priority */}
                        <td className="p-4">
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                              lead.priority === "Urgent"
                                ? "bg-rose-100 text-rose-800 border border-rose-200"
                                : lead.priority === "High"
                                ? "bg-orange-100 text-orange-800 border border-orange-200"
                                : lead.priority === "Medium"
                                ? "bg-amber-100 text-amber-800 border border-amber-200"
                                : "bg-slate-100 text-slate-800 border border-slate-200"
                            }`}
                          >
                            {lead.priority}
                          </span>
                        </td>

                        {/* Source & Owner */}
                        <td className="p-4">
                          <div className="text-xs font-bold text-slate-900">
                            {lead.source}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">
                            {lead.assignedTo}
                          </div>
                        </td>

                        {/* Actions */}
                        <td
                          className="p-4 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1">
                            {/* Email Mailto */}
                            <a
                              href={`mailto:${lead.email}?subject=Follow-up from Smart Lead CRM`}
                              title="Send Email"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            >
                              <Mail className="w-4 h-4" />
                            </a>

                            {/* WhatsApp / Phone */}
                            {lead.phone && (
                              <a
                                href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Contact via WhatsApp / Phone"
                                className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                              >
                                <Phone className="w-4 h-4" />
                              </a>
                            )}

                            {/* Edit */}
                            <button
                              onClick={() => setEditingLead(lead)}
                              title="Edit Lead"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            {/* Delete (Admin Only) */}
                            {role === "ADMIN" && (
                              <button
                                onClick={() => handleDeleteLead(lead._id, lead.name)}
                                title="Delete Lead (Admin Only)"
                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Bar */}
          <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-slate-50/50">
            <span className="text-xs font-bold text-slate-600">
              Showing {leads.length} of {totalLeads} leads (Page {filters.page} of {totalPages})
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={filters.page <= 1}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))
                }
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-300 disabled:opacity-40 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              <button
                disabled={filters.page >= totalPages}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-300 disabled:opacity-40 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Slide-over Profile Drawer */}
      <LeadDrawer
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onUpdateStatus={handleUpdateStatus}
        onAddNote={handleAddNote}
        onEdit={(lead) => {
          setSelectedLead(null);
          setEditingLead(lead);
        }}
        role={role}
      />

      {/* Create / Edit Modal */}
      <LeadModal
        isOpen={isCreateModalOpen || !!editingLead}
        initialLead={editingLead}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingLead(null);
        }}
        onSubmit={editingLead ? handleUpdateLead : handleCreateLead}
      />

      {/* CSV Import Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportLeads}
      />
    </div>
  );
};

export default Dashboard;