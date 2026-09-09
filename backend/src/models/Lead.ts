import mongoose from "mongoose";

export interface ILeadNote {
  _id?: string;
  author: string;
  content: string;
  type: "note" | "call" | "email" | "stage_change";
  createdAt: Date;
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
  status: "New" | "Contacted" | "In Progress" | "Qualified" | "Proposal Sent" | "Won" | "Lost";
  priority: "Low" | "Medium" | "High" | "Urgent";
  source: "Website" | "LinkedIn" | "Instagram" | "Google Ads" | "Referral" | "Cold Outreach" | "Event" | "Other";
  assignedTo: string;
  leadScore: number;
  leadScoreCategory: "Hot" | "Warm" | "Cold";
  scoreFactors: string[];
  followUpDate?: Date | null;
  tags: string[];
  notes: ILeadNote[];
  createdAt: Date;
  updatedAt: Date;
}

const leadNoteSchema = new mongoose.Schema({
  author: { type: String, default: "Sales Team" },
  content: { type: String, required: true },
  type: {
    type: String,
    enum: ["note", "call", "email", "stage_change"],
    default: "note",
  },
  createdAt: { type: Date, default: Date.now },
});

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: "" },
    company: { type: String, default: "Individual" },
    jobTitle: { type: String, default: "Lead Contact" },
    dealValue: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
    status: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "In Progress",
        "Qualified",
        "Proposal Sent",
        "Won",
        "Lost",
      ],
      default: "New",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },
    source: {
      type: String,
      enum: [
        "Website",
        "LinkedIn",
        "Instagram",
        "Google Ads",
        "Referral",
        "Cold Outreach",
        "Event",
        "Other",
      ],
      default: "Website",
    },
    assignedTo: { type: String, default: "Priya Sharma" },
    leadScore: { type: Number, default: 50 },
    leadScoreCategory: {
      type: String,
      enum: ["Hot", "Warm", "Cold"],
      default: "Warm",
    },
    scoreFactors: { type: [String], default: [] },
    followUpDate: { type: Date, default: null },
    tags: { type: [String], default: [] },
    notes: { type: [leadNoteSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Lead", leadSchema);