import React, { useState } from "react";
import { X, Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Download } from "lucide-react";
import type { ILead } from "../types";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (leads: Partial<ILead>[]) => Promise<void>;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [parsedLeads, setParsedLeads] = useState<Partial<ILead>[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError("");

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    try {
      const lines = text.split(/\r\n|\n/).filter((l) => l.trim().length > 0);
      if (lines.length < 2) {
        setError("The CSV file must contain a header row and at least one data row.");
        return;
      }

      const headers = lines[0]
        .split(",")
        .map((h) => h.trim().toLowerCase().replace(/['"]+/g, ""));

      const leads: Partial<ILead>[] = [];

      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(",").map((cell) => cell.trim().replace(/^"|"$/g, ""));
        if (row.length === 0 || !row[0]) continue;

        const lead: any = {
          name: "",
          email: "",
          company: "Company",
          dealValue: 10000,
          status: "New",
          priority: "Medium",
          source: "Website",
        };

        headers.forEach((header, index) => {
          const val = row[index];
          if (!val) return;

          if (header.includes("name")) lead.name = val;
          else if (header.includes("email")) lead.email = val;
          else if (header.includes("phone")) lead.phone = val;
          else if (header.includes("company") || header.includes("account")) lead.company = val;
          else if (header.includes("title") || header.includes("role")) lead.jobTitle = val;
          else if (header.includes("value") || header.includes("deal") || header.includes("amount")) {
            lead.dealValue = Number(val.replace(/[^0-9.]/g, "")) || 0;
          } else if (header.includes("status") || header.includes("stage")) {
            lead.status = val;
          } else if (header.includes("priority")) {
            lead.priority = val;
          } else if (header.includes("source") || header.includes("channel")) {
            lead.source = val;
          }
        });

        if (lead.name && lead.email) {
          leads.push(lead);
        }
      }

      if (leads.length === 0) {
        setError("No valid leads found. Please ensure your CSV has 'Name' and 'Email' columns.");
        return;
      }

      setParsedLeads(leads);
    } catch (err: any) {
      setError("Failed to parse CSV file: " + err.message);
    }
  };

  const handleDownloadSample = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Name,Email,Phone,Company,Job Title,Deal Value,Status,Priority,Source\n" +
      "Alexander King,alex@kingenterprises.com,+1 555-0192,King Enterprises,CEO,45000,New,High,LinkedIn\n" +
      "Sophia Martinez,sophia@apexcloud.io,+1 555-0193,Apex Cloud,VP Engineering,30000,Contacted,Medium,Website\n" +
      "Liam O'Connor,liam@irishfintech.ie,+353 1 234 5678,Irish Fintech,Director,65000,Qualified,Urgent,Referral\n";

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sample_leads_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportSubmit = async () => {
    if (parsedLeads.length === 0) return;
    setLoading(true);
    try {
      await onImport(parsedLeads);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Import Leads from CSV
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Bulk upload prospects with automatic AI lead score computation.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-indigo-200 bg-indigo-50/30 rounded-3xl p-6 text-center hover:border-indigo-500 hover:bg-indigo-50/60 transition-all">
            <input
              type="file"
              accept=".csv"
              id="csvFileInput"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="csvFileInput"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100 mb-2">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-sm font-extrabold text-slate-900">
                {fileName ? fileName : "Click to select CSV file"}
              </span>
              <span className="text-xs text-slate-500 font-medium mt-1">
                Supports standard comma-delimited .csv files
              </span>
            </label>
          </div>

          {/* Sample template download */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Need a ready template?</span>
            <button
              onClick={handleDownloadSample}
              className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Sample CSV</span>
            </button>
          </div>

          {/* Error notice */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Parsed Preview */}
          {parsedLeads.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-slate-900">
                  Ready to Import: {parsedLeads.length} Leads
                </span>
                <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Validated
                </span>
              </div>
              <div className="max-h-36 overflow-y-auto divide-y divide-slate-200 text-xs text-slate-700">
                {parsedLeads.slice(0, 5).map((lead, idx) => (
                  <div key={idx} className="py-1.5 flex justify-between font-medium">
                    <span className="font-bold text-slate-900">
                      {lead.name} ({lead.company})
                    </span>
                    <span>${(lead.dealValue || 0).toLocaleString()}</span>
                  </div>
                ))}
                {parsedLeads.length > 5 && (
                  <div className="pt-1.5 text-center text-slate-500 text-[11px] font-semibold">
                    + {parsedLeads.length - 5} more leads
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleImportSubmit}
              disabled={parsedLeads.length === 0 || loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white shadow-md transition-all cursor-pointer"
            >
              {loading && (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>Import {parsedLeads.length} Leads</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
