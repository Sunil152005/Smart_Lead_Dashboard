import React from "react";
import {
  DollarSign,
  Trophy,
  Flame,
  Target,
  Percent,
} from "lucide-react";
import type { AnalyticsData } from "../types";

interface KPIStatsProps {
  analytics: AnalyticsData | null;
  loading: boolean;
}

export const KPIStats: React.FC<KPIStatsProps> = ({ analytics, loading }) => {
  const formatCurrency = (val: number = 0) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`;
    return `$${val.toLocaleString()}`;
  };

  const cards = [
    {
      title: "Total Pipeline Value",
      value: formatCurrency(analytics?.pipelineValue),
      subtext: `${analytics?.totalLeads || 0} active leads in pipeline`,
      icon: DollarSign,
      gradient: "from-blue-600 to-indigo-600",
      textColor: "text-blue-600 dark:text-blue-400",
      bgLight: "bg-blue-50 dark:bg-blue-950/40",
      border: "border-blue-200/80 dark:border-blue-900/60",
    },
    {
      title: "Won Revenue Closed",
      value: formatCurrency(analytics?.wonRevenue),
      subtext: `${analytics?.statusCounts?.Won?.count || 0} deals converted`,
      icon: Trophy,
      gradient: "from-emerald-600 to-teal-600",
      textColor: "text-emerald-600 dark:text-emerald-400",
      bgLight: "bg-emerald-50 dark:bg-emerald-950/40",
      border: "border-emerald-200/80 dark:border-emerald-900/60",
    },
    {
      title: "Conversion Rate",
      value: `${analytics?.conversionRate || 0}%`,
      subtext: "Lead-to-Win benchmark",
      icon: Percent,
      gradient: "from-purple-600 to-pink-600",
      textColor: "text-purple-600 dark:text-purple-400",
      bgLight: "bg-purple-50 dark:bg-purple-950/40",
      border: "border-purple-200/80 dark:border-purple-900/60",
    },
    {
      title: "Hot AI Leads 🔥",
      value: analytics?.hotLeadsCount || 0,
      subtext: "Score 75+ (High closing prob)",
      icon: Flame,
      gradient: "from-amber-500 to-rose-600",
      textColor: "text-rose-600 dark:text-rose-400",
      bgLight: "bg-rose-50 dark:bg-rose-950/40",
      border: "border-rose-200/80 dark:border-rose-900/60",
    },
    {
      title: "Average Deal Size",
      value: formatCurrency(analytics?.avgDealSize),
      subtext: "Per qualified account",
      icon: Target,
      gradient: "from-cyan-600 to-blue-600",
      textColor: "text-cyan-600 dark:text-cyan-400",
      bgLight: "bg-cyan-50 dark:bg-cyan-950/40",
      border: "border-cyan-200/80 dark:border-cyan-900/60",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`relative overflow-hidden p-4 rounded-2xl bg-white dark:bg-slate-900/90 border ${card.border} shadow-sm hover:shadow-md transition-all group`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 line-clamp-1">
                {card.title}
              </span>
              <div
                className={`w-8 h-8 rounded-xl ${card.bgLight} ${card.textColor} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              {loading ? (
                <div className="h-7 w-20 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
              ) : (
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {card.value}
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 font-medium">
              {card.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
};
