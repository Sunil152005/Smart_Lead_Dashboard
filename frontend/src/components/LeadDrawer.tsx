import React, { useState } from "react";
import {
  X,
  Flame,
  Zap,
  Snowflake,
  Mail,
  Phone,
  Building2,
  Send,
  Sparkles,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import type { ILead, LeadStatus } from "../types";

interface LeadDrawerProps {
  lead: ILead | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onAddNote: (id: string, content: string, type: "note" | "call" | "email") => void;
  onEdit: (lead: ILead) => void;
  role: string | null;
}

export const LeadDrawer: React.FC<LeadDrawerProps> = ({
  lead,
  onClose,
  onUpdateStatus,
  onAddNote,
  onEdit,
}) => {
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState<"note" | "call" | "email">("note");
  const [submittingNote, setSubmittingNote] = useState(false);

  if (!lead) return null;

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setSubmittingNote(true);
    await onAddNote(lead._id, newNote.trim(), noteType);
    setNewNote("");
    setSubmittingNote(false);
  };

  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (date: string | Date | null | undefined) => {
    if (!date) return "";
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in flex justify-end">
      <div
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-slide-left overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-start justify-between bg-slate-50">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                  lead.status === "Won"
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                    : lead.status === "Lost"
                    ? "bg-rose-100 text-rose-800 border-rose-300"
                    : "bg-indigo-100 text-indigo-800 border-indigo-300"
                }`}
              >
                {lead.status}
              </span>
              <span className="text-xs text-slate-500 font-mono">ID: {lead._id}</span>
            </div>

            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {lead.name}
            </h2>

            <div className="flex items-center gap-2 text-xs text-slate-600 mt-1 font-medium">
              <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-bold text-slate-800">{lead.company || "Individual Account"}</span>
              <span>•</span>
              <span>{lead.jobTitle || "Lead Contact"}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(lead)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors cursor-pointer"
            >
              Edit Lead
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          {/* Smart AI Lead Score Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 border border-indigo-200 shadow-xs">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-extrabold text-indigo-900 uppercase tracking-wider">
                  Smart AI Lead Score
                </span>
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-extrabold px-3 py-1 rounded-full border ${
                  lead.leadScoreCategory === "Hot"
                    ? "bg-rose-100 text-rose-800 border-rose-300"
                    : lead.leadScoreCategory === "Warm"
                    ? "bg-amber-100 text-amber-800 border-amber-300"
                    : "bg-slate-100 text-slate-800 border-slate-300"
                }`}
              >
                {lead.leadScoreCategory === "Hot" && <Flame className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />}
                {lead.leadScoreCategory === "Warm" && <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />}
                {lead.leadScoreCategory === "Cold" && <Snowflake className="w-3.5 h-3.5 text-slate-500" />}
                <span>{lead.leadScoreCategory} Priority ({lead.leadScore || 50}/100)</span>
              </div>
            </div>

            {/* Score progress bar */}
            <div className="w-full bg-slate-200 rounded-full h-2.5 mb-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  lead.leadScoreCategory === "Hot"
                    ? "bg-gradient-to-r from-rose-500 to-amber-500"
                    : lead.leadScoreCategory === "Warm"
                    ? "bg-gradient-to-r from-amber-500 to-yellow-500"
                    : "bg-slate-400"
                }`}
                style={{ width: `${lead.leadScore || 50}%` }}
              />
            </div>

            {/* Score Factors */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700">
                Key AI Assessment Factors:
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {(lead.scoreFactors && lead.scoreFactors.length > 0
                  ? lead.scoreFactors
                  : ["Inquiry established", "Qualified buyer profile", "Target deal tier"]
                ).map((factor, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-1.5 text-xs text-slate-800 bg-white px-2.5 py-1.5 rounded-xl border border-indigo-100 shadow-2xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate font-semibold">{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Contact Buttons */}
          <div className="grid grid-cols-3 gap-2.5">
            <a
              href={`mailto:${lead.email}`}
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-colors"
            >
              <Mail className="w-4 h-4 text-indigo-600" />
              <span>Send Email</span>
            </a>
            {lead.phone ? (
              <a
                href={`tel:${lead.phone}`}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-colors"
              >
                <Phone className="w-4 h-4 text-blue-600" />
                <span>Call Phone</span>
              </a>
            ) : (
              <button
                disabled
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold cursor-not-allowed opacity-60"
              >
                <Phone className="w-4 h-4" />
                <span>No Phone</span>
              </button>
            )}
            {lead.phone ? (
              <a
                href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp</span>
              </a>
            ) : (
              <button
                disabled
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-bold cursor-not-allowed opacity-60"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>
            )}
          </div>

          {/* Deal & Contact Information Details */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
              Deal & Opportunity Details
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 font-semibold">Deal Value:</span>
                <p className="font-black text-slate-900 text-lg mt-0.5">
                  ${(lead.dealValue || 0).toLocaleString()} {lead.currency || "USD"}
                </p>
              </div>

              <div>
                <span className="text-slate-500 font-semibold">Pipeline Stage:</span>
                <div className="mt-1">
                  <select
                    value={lead.status}
                    onChange={(e) =>
                      onUpdateStatus(lead._id, e.target.value as LeadStatus)
                    }
                    className="w-full text-xs font-bold p-1.5 rounded-xl border border-slate-300 bg-white text-slate-900 cursor-pointer shadow-2xs"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Won">Closed Won 🏆</option>
                    <option value="Lost">Closed Lost</option>
                  </select>
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-semibold">Priority Level:</span>
                <p className="font-bold text-slate-900 mt-0.5">
                  {lead.priority}
                </p>
              </div>

              <div>
                <span className="text-slate-500 font-semibold">Acquisition Channel:</span>
                <p className="font-bold text-slate-900 mt-0.5">
                  {lead.source}
                </p>
              </div>

              <div>
                <span className="text-slate-500 font-semibold">Assigned Sales Rep:</span>
                <p className="font-bold text-slate-900 mt-0.5">
                  {lead.assignedTo}
                </p>
              </div>

              <div>
                <span className="text-slate-500 font-semibold">Follow-up Reminder:</span>
                <p className="font-bold text-slate-900 mt-0.5">
                  {formatDate(lead.followUpDate)}
                </p>
              </div>
            </div>

            {/* Tags */}
            {lead.tags && lead.tags.length > 0 && (
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500 text-xs font-semibold block mb-1.5">Tags:</span>
                <div className="flex flex-wrap gap-1.5">
                  {lead.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white text-indigo-700 border border-indigo-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Activity Log & Notes Timeline */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Activity Timeline & Interaction History ({lead.notes?.length || 0})
              </h3>
            </div>

            {/* Note Composer */}
            <form onSubmit={handleAddNote} className="mb-4">
              <div className="p-3 rounded-2xl border border-slate-300 bg-white shadow-xs focus-within:border-indigo-500">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                  <span className="text-[11px] text-slate-500 font-bold">Activity:</span>
                  <button
                    type="button"
                    onClick={() => setNoteType("note")}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                      noteType === "note"
                        ? "bg-indigo-100 text-indigo-700"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Note
                  </button>
                  <button
                    type="button"
                    onClick={() => setNoteType("call")}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                      noteType === "call"
                        ? "bg-emerald-100 text-emerald-700"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Call Log
                  </button>
                  <button
                    type="button"
                    onClick={() => setNoteType("email")}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                      noteType === "email"
                        ? "bg-sky-100 text-sky-700"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Email
                  </button>
                </div>

                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder={`Write a ${noteType} or follow-up note...`}
                  rows={2}
                  className="w-full text-xs bg-transparent border-none focus:outline-none resize-none text-slate-900 placeholder:text-slate-400"
                />

                <div className="flex justify-end pt-2 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={!newNote.trim() || submittingNote}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white transition-colors cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Post Activity</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Timeline List */}
            <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {(!lead.notes || lead.notes.length === 0) ? (
                <p className="text-xs text-slate-400 pl-8">No activities recorded yet.</p>
              ) : (
                [...lead.notes].reverse().map((item, idx) => (
                  <div key={idx} className="relative flex items-start gap-3 pl-8">
                    {/* Timeline bullet */}
                    <div
                      className={`absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center shadow-xs ${
                        item.type === "call"
                          ? "bg-emerald-500"
                          : item.type === "email"
                          ? "bg-sky-500"
                          : item.type === "stage_change"
                          ? "bg-purple-500"
                          : "bg-indigo-500"
                      }`}
                    />

                    <div className="flex-1 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-slate-900">
                          {item.author}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          {formatDateTime(item.createdAt)}
                        </span>
                      </div>
                      <p className="text-slate-800 font-medium leading-relaxed whitespace-pre-wrap">
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
