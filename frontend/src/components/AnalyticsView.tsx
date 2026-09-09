import React from "react";
import {
  Target,
  Flame,
  Zap,
  Snowflake,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import type { AnalyticsData, ILead } from "../types";

interface AnalyticsViewProps {
  analytics: AnalyticsData | null;
  leads: ILead[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  analytics,
  leads,
}) => {
  if (!analytics) return null;

  const totalLeads = analytics.totalLeads || 1;
  const statusCounts = analytics.statusCounts || {};
  const sourceCounts = analytics.sourceCounts || {};

  const stages = [
    { key: "New", label: "New Leads", color: "bg-indigo-500", text: "text-indigo-500" },
    { key: "Contacted", label: "Contacted", color: "bg-sky-500", text: "text-sky-500" },
    { key: "In Progress", label: "In Progress", color: "bg-amber-500", text: "text-amber-500" },
    { key: "Qualified", label: "Qualified", color: "bg-purple-500", text: "text-purple-500" },
    { key: "Proposal Sent", label: "Proposal Sent", color: "bg-blue-500", text: "text-blue-500" },
    { key: "Won", label: "Closed Won 🏆", color: "bg-emerald-500", text: "text-emerald-500" },
    { key: "Lost", label: "Closed Lost", color: "bg-rose-500", text: "text-rose-500" },
  ];

  const formatCurrency = (val: number = 0) => {
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`;
    return `$${val.toLocaleString()}`;
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Conversion Funnel */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Sales Pipeline Conversion Funnel
              </h3>
              <p className="text-xs text-slate-500">
                Lead progression across deal stages and pipeline volume
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
            Total Pipeline: ${analytics.pipelineValue.toLocaleString()}
          </span>
        </div>

        {/* Funnel Stage Bars */}
        <div className="space-y-4">
          {stages.map((st) => {
            const data = statusCounts[st.key] || { count: 0, value: 0 };
            const pct = Math.round((data.count / totalLeads) * 100) || 0;

            return (
              <div key={st.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-800 dark:text-slate-200 font-bold">
                      {st.label}
                    </span>
                    <span className="text-slate-400 font-normal">
                      ({data.count} leads)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-600 dark:text-slate-400">
                      {formatCurrency(data.value)}
                    </span>
                    <span className="w-10 text-right font-bold text-slate-900 dark:text-white">
                      {pct}%
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${st.color} transition-all duration-700`}
                    style={{ width: `${Math.max(4, pct)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Acquisition Channels & Lead Quality */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Channels */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Acquisition Channel Breakdown
              </h3>
              <p className="text-xs text-slate-500">
                Performance by lead acquisition source
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {Object.entries(sourceCounts).map(([source, count], idx) => {
              const pct = Math.round((count / totalLeads) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">
                      {source}
                    </span>
                    <span className="text-slate-500">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${Math.max(6, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Lead Score Health */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Smart AI Lead Quality Distribution
              </h3>
              <p className="text-xs text-slate-500">
                Probability breakdown based on deal parameters
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {/* Hot */}
            <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/60 text-center">
              <Flame className="w-6 h-6 text-rose-500 mx-auto mb-1 animate-pulse" />
              <div className="text-2xl font-black text-rose-700 dark:text-rose-300">
                {analytics.hotLeadsCount}
              </div>
              <div className="text-xs font-bold text-rose-600 dark:text-rose-400">
                Hot Leads 🔥
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Score &gt;= 75</div>
            </div>

            {/* Warm */}
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/60 text-center">
              <Zap className="w-6 h-6 text-amber-500 mx-auto mb-1" />
              <div className="text-2xl font-black text-amber-700 dark:text-amber-300">
                {leads.filter((l) => l.leadScoreCategory === "Warm").length}
              </div>
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400">
                Warm Leads ⚡
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Score 45–74</div>
            </div>

            {/* Cold */}
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center">
              <Snowflake className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <div className="text-2xl font-black text-slate-700 dark:text-slate-300">
                {leads.filter((l) => l.leadScoreCategory === "Cold").length}
              </div>
              <div className="text-xs font-bold text-slate-600 dark:text-slate-400">
                Cold Leads ❄️
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Score &lt; 45</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 border border-indigo-200/60 dark:border-indigo-900/60 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                Sales Action Recommendation
              </span>
              <p className="text-[11px] text-indigo-700 dark:text-indigo-400 mt-0.5">
                Focus on {analytics.hotLeadsCount} hot leads in Proposal & Qualified stages to maximize Q3 close rates.
              </p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-indigo-500 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
};
