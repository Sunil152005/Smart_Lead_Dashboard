import React from "react";
import {
  Flame,
  Zap,
  Snowflake,
  Mail,
  Phone,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Building2,
  ExternalLink,
} from "lucide-react";
import type { ILead, LeadStatus } from "../types";

interface LeadTableProps {
  leads: ILead[];
  loading: boolean;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onSelectLead: (lead: ILead) => void;
  onEditLead: (lead: ILead) => void;
  onDeleteLead: (id: string, name: string) => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
  role: string | null;
}

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  loading,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onSelectLead,
  onEditLead,
  onDeleteLead,
  onUpdateStatus,
  sortBy,
  sortOrder,
  onSort,
  role,
}) => {
  const isAllSelected = leads.length > 0 && selectedIds.length === leads.length;

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-60 group-hover:opacity-100" />;
    }
    return sortOrder === "asc" ? (
      <ChevronUp className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
    );
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Won":
        return "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800";
      case "Proposal Sent":
        return "bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800";
      case "Qualified":
        return "bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800";
      case "In Progress":
        return "bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800";
      case "Contacted":
        return "bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-800";
      case "Lost":
        return "bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800";
      default:
        return "bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800";
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="p-4 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </th>
              <th
                onClick={() => onSort("name")}
                className="p-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span>Lead Contact & Account</span>
                  {renderSortIcon("name")}
                </div>
              </th>
              <th
                onClick={() => onSort("dealValue")}
                className="p-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span>Deal Value</span>
                  {renderSortIcon("dealValue")}
                </div>
              </th>
              <th
                onClick={() => onSort("leadScore")}
                className="p-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span>AI Score</span>
                  {renderSortIcon("leadScore")}
                </div>
              </th>
              <th
                onClick={() => onSort("status")}
                className="p-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span>Stage Status</span>
                  {renderSortIcon("status")}
                </div>
              </th>
              <th
                onClick={() => onSort("priority")}
                className="p-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group select-none"
              >
                <div className="flex items-center gap-1.5">
                  <span>Priority</span>
                  {renderSortIcon("priority")}
                </div>
              </th>
              <th className="p-4">Source & Owner</th>
              <th className="p-4 text-right">Quick Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {loading ? (
              <tr>
                <td colSpan={8} className="p-8 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-slate-500 font-medium">
                      Loading leads...
                    </span>
                  </div>
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
                      <ExternalLink className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-base">
                      No leads matching filters
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Try adjusting your search keywords, stage, or priority filters.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              leads.map((lead) => {
                const isSelected = selectedIds.includes(lead._id);

                return (
                  <tr
                    key={lead._id}
                    onClick={() => onSelectLead(lead)}
                    className={`cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                      isSelected
                        ? "bg-indigo-50/50 dark:bg-indigo-950/20"
                        : ""
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
                        onChange={() => onToggleSelect(lead._id)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>

                    {/* Contact & Company */}
                    <td className="p-4">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                          {lead.name}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          <span>{lead.company || "Individual"}</span>
                          <span className="text-slate-300 dark:text-slate-600">•</span>
                          <span>{lead.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Deal Value */}
                    <td className="p-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        ${(lead.dealValue || 0).toLocaleString()}
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase">
                        {lead.currency || "USD"}
                      </span>
                    </td>

                    {/* AI Score */}
                    <td className="p-4">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          lead.leadScoreCategory === "Hot"
                            ? "bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900"
                            : lead.leadScoreCategory === "Warm"
                            ? "bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {lead.leadScoreCategory === "Hot" && (
                          <Flame className="w-3.5 h-3.5 text-rose-500" />
                        )}
                        {lead.leadScoreCategory === "Warm" && (
                          <Zap className="w-3.5 h-3.5 text-amber-500" />
                        )}
                        {lead.leadScoreCategory === "Cold" && (
                          <Snowflake className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        <span>{lead.leadScore || 50} pts</span>
                      </div>
                    </td>

                    {/* Stage Status with Inline Selector */}
                    <td
                      className="p-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          onUpdateStatus(lead._id, e.target.value as LeadStatus)
                        }
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:outline-none ${getStatusBadgeClass(
                          lead.status
                        )}`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Proposal Sent">Proposal Sent</option>
                        <option value="Won">Closed Won 🏆</option>
                        <option value="Lost">Closed Lost</option>
                      </select>
                    </td>

                    {/* Priority */}
                    <td className="p-4">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          lead.priority === "Urgent"
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                            : lead.priority === "High"
                            ? "bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300"
                            : lead.priority === "Medium"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {lead.priority}
                      </span>
                    </td>

                    {/* Source & Owner */}
                    <td className="p-4">
                      <div className="text-xs font-medium text-slate-900 dark:text-white">
                        {lead.source}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {lead.assignedTo}
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td
                      className="p-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Mailto link */}
                        <a
                          href={`mailto:${lead.email}?subject=Follow-up regarding ${lead.company || "our partnership"}`}
                          title={`Send Email to ${lead.email}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                        </a>

                        {/* Phone call / WhatsApp link */}
                        {lead.phone && (
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={`Contact via WhatsApp / Phone: ${lead.phone}`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        )}

                        {/* Edit Button */}
                        <button
                          onClick={() => onEditLead(lead)}
                          title="Edit Lead"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Delete Button (Admin Only) */}
                        {role === "ADMIN" && (
                          <button
                            onClick={() => onDeleteLead(lead._id, lead.name)}
                            title="Delete Lead (Admin Only)"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
    </div>
  );
};
