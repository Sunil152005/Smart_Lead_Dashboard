import React from "react";
import {
  Flame,
  Zap,
  Snowflake,
  ArrowRight,
  ArrowLeft,
  Building2,
  DollarSign,
} from "lucide-react";
import type { ILead, LeadStatus } from "../types";

interface KanbanBoardProps {
  leads: ILead[];
  onSelectLead: (lead: ILead) => void;
  onUpdateStatus: (id: string, newStatus: LeadStatus) => void;
  role: string | null;
}

const STAGES: { id: LeadStatus; label: string; color: string; border: string; bg: string }[] = [
  {
    id: "New",
    label: "New Leads",
    color: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-200 dark:border-indigo-900",
    bg: "bg-indigo-50/70 dark:bg-indigo-950/30",
  },
  {
    id: "Contacted",
    label: "Contacted",
    color: "text-sky-600 dark:text-sky-400",
    border: "border-sky-200 dark:border-sky-900",
    bg: "bg-sky-50/70 dark:bg-sky-950/30",
  },
  {
    id: "In Progress",
    label: "In Progress",
    color: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-900",
    bg: "bg-amber-50/70 dark:bg-amber-950/30",
  },
  {
    id: "Qualified",
    label: "Qualified",
    color: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-900",
    bg: "bg-purple-50/70 dark:bg-purple-950/30",
  },
  {
    id: "Proposal Sent",
    label: "Proposal Sent",
    color: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-900",
    bg: "bg-blue-50/70 dark:bg-blue-950/30",
  },
  {
    id: "Won",
    label: "Closed Won 🏆",
    color: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-900",
    bg: "bg-emerald-50/70 dark:bg-emerald-950/30",
  },
  {
    id: "Lost",
    label: "Closed Lost",
    color: "text-rose-600 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-900",
    bg: "bg-rose-50/70 dark:bg-rose-950/30",
  },
];

const STAGE_ORDER: LeadStatus[] = [
  "New",
  "Contacted",
  "In Progress",
  "Qualified",
  "Proposal Sent",
  "Won",
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  leads,
  onSelectLead,
  onUpdateStatus,
}) => {
  const getNextStage = (current: LeadStatus): LeadStatus | null => {
    const idx = STAGE_ORDER.indexOf(current);
    if (idx !== -1 && idx < STAGE_ORDER.length - 1) {
      return STAGE_ORDER[idx + 1];
    }
    return null;
  };

  const getPrevStage = (current: LeadStatus): LeadStatus | null => {
    const idx = STAGE_ORDER.indexOf(current);
    if (idx > 0) {
      return STAGE_ORDER[idx - 1];
    }
    return null;
  };

  const formatCurrency = (val: number = 0) => {
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`;
    return `$${val.toLocaleString()}`;
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-1 select-none min-h-[580px] custom-scrollbar">
      {STAGES.map((stage) => {
        const stageLeads = leads.filter((l) => l.status === stage.id);
        const stageTotalValue = stageLeads.reduce(
          (sum, l) => sum + (Number(l.dealValue) || 0),
          0
        );

        return (
          <div
            key={stage.id}
            className={`w-80 shrink-0 flex flex-col rounded-2xl border ${stage.border} ${stage.bg} backdrop-blur-sm p-3`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${stage.color} uppercase tracking-wider`}>
                  {stage.label}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-xs">
                  {stageLeads.length}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                {formatCurrency(stageTotalValue)}
              </span>
            </div>

            {/* Cards List */}
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1 max-h-[640px]">
              {stageLeads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  <p className="text-xs font-medium text-slate-400">
                    No leads in this stage
                  </p>
                </div>
              ) : (
                stageLeads.map((lead) => {
                  const next = getNextStage(lead.status);
                  const prev = getPrevStage(lead.status);

                  return (
                    <div
                      key={lead._id}
                      onClick={() => onSelectLead(lead)}
                      className="group cursor-pointer bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200"
                    >
                      {/* Top Badges: Score & Priority */}
                      <div className="flex items-center justify-between mb-2">
                        {/* AI Score Badge */}
                        <div
                          className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            lead.leadScoreCategory === "Hot"
                              ? "bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900"
                              : lead.leadScoreCategory === "Warm"
                              ? "bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {lead.leadScoreCategory === "Hot" && (
                            <Flame className="w-3 h-3 text-rose-500 animate-pulse" />
                          )}
                          {lead.leadScoreCategory === "Warm" && (
                            <Zap className="w-3 h-3 text-amber-500" />
                          )}
                          {lead.leadScoreCategory === "Cold" && (
                            <Snowflake className="w-3 h-3 text-slate-400" />
                          )}
                          <span>{lead.leadScore || 50} pts</span>
                        </div>

                        {/* Priority Badge */}
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            lead.priority === "Urgent"
                              ? "bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900"
                              : lead.priority === "High"
                              ? "bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {lead.priority}
                        </span>
                      </div>

                      {/* Lead Name & Company */}
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {lead.name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <Building2 className="w-3 h-3 shrink-0" />
                        <span className="truncate">{lead.company || "Individual"}</span>
                      </div>

                      {/* Deal Value & Source */}
                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <DollarSign className="w-3.5 h-3.5 -mr-0.5" />
                          <span>{(lead.dealValue || 0).toLocaleString()}</span>
                        </div>
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {lead.source}
                        </span>
                      </div>

                      {/* Quick Stage Progression Buttons */}
                      <div
                        className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/60"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-[10px] text-slate-400 font-medium truncate max-w-[100px]">
                          Rep: {lead.assignedTo?.split(" ")[0]}
                        </span>

                        <div className="flex items-center gap-1">
                          {prev && (
                            <button
                              onClick={() => onUpdateStatus(lead._id, prev)}
                              title={`Move back to ${prev}`}
                              className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {next && (
                            <button
                              onClick={() => onUpdateStatus(lead._id, next)}
                              title={`Advance to ${next}`}
                              className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-300 transition-colors"
                            >
                              <span>Next</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
