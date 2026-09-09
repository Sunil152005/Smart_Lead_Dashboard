export type LeadStatus =
  | "New"
  | "Contacted"
  | "In Progress"
  | "Qualified"
  | "Proposal Sent"
  | "Won"
  | "Lost";

export type LeadPriority = "Low" | "Medium" | "High" | "Urgent";

export type LeadSource =
  | "Website"
  | "LinkedIn"
  | "Instagram"
  | "Google Ads"
  | "Referral"
  | "Cold Outreach"
  | "Event"
  | "Other";

export type ScoreCategory = "Hot" | "Warm" | "Cold";

export interface ILeadNote {
  _id?: string;
  author: string;
  content: string;
  type: "note" | "call" | "email" | "stage_change";
  createdAt: string | Date;
}

export interface ILead {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  dealValue: number;
  currency: string;
  status: LeadStatus;
  priority: LeadPriority;
  source: LeadSource;
  assignedTo: string;
  leadScore: number;
  leadScoreCategory: ScoreCategory;
  scoreFactors: string[];
  followUpDate?: string | Date | null;
  tags: string[];
  notes: ILeadNote[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SALES";
  avatar?: string;
}

export interface AnalyticsData {
  totalLeads: number;
  pipelineValue: number;
  wonRevenue: number;
  lostValue: number;
  conversionRate: number;
  avgDealSize: number;
  hotLeadsCount: number;
  statusCounts: Record<string, { count: number; value: number }>;
  sourceCounts: Record<string, number>;
  priorityCounts: Record<string, number>;
}

export interface LeadFilterOptions {
  search: string;
  status: string;
  source: string;
  priority: string;
  assignedTo: string;
  category: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  page: number;
}
