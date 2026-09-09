export interface ScoreResult {
  score: number;
  category: "Hot" | "Warm" | "Cold";
  factors: string[];
}

export const calculateLeadScore = (lead: {
  dealValue?: number;
  priority?: string;
  status?: string;
  source?: string;
  notes?: any[];
  phone?: string;
  company?: string;
}): ScoreResult => {
  let score = 20; // Base score
  const factors: string[] = [];

  // Deal Value factor
  const value = Number(lead.dealValue || 0);
  if (value >= 25000) {
    score += 30;
    factors.push("Enterprise deal value ($25k+)");
  } else if (value >= 10000) {
    score += 20;
    factors.push("High deal value ($10k+)");
  } else if (value >= 3000) {
    score += 12;
    factors.push("Mid-tier deal value ($3k+)");
  } else if (value > 0) {
    score += 5;
    factors.push("Defined deal value");
  }

  // Priority factor
  if (lead.priority === "Urgent") {
    score += 25;
    factors.push("Urgent priority timeline");
  } else if (lead.priority === "High") {
    score += 18;
    factors.push("High priority interest");
  } else if (lead.priority === "Medium") {
    score += 8;
  }

  // Status / Pipeline Stage factor
  if (lead.status === "Won") {
    return {
      score: 100,
      category: "Hot",
      factors: ["Deal successfully closed won (100%)"],
    };
  } else if (lead.status === "Lost") {
    return {
      score: 5,
      category: "Cold",
      factors: ["Deal marked closed lost"],
    };
  } else if (lead.status === "Proposal Sent") {
    score += 25;
    factors.push("Proposal delivered and under review");
  } else if (lead.status === "Qualified") {
    score += 18;
    factors.push("Budget and decision-maker verified");
  } else if (lead.status === "In Progress") {
    score += 12;
    factors.push("Active sales discovery ongoing");
  } else if (lead.status === "Contacted") {
    score += 6;
    factors.push("Initial contact established");
  }

  // Source factor
  if (lead.source === "Referral") {
    score += 18;
    factors.push("High-converting referral channel");
  } else if (lead.source === "LinkedIn") {
    score += 14;
    factors.push("B2B LinkedIn acquisition");
  } else if (lead.source === "Event") {
    score += 12;
    factors.push("In-person event contact");
  } else if (lead.source === "Website" || lead.source === "Google Ads") {
    score += 8;
    factors.push("Inbound digital inquiry");
  }

  // Completeness & Engagement
  if (lead.phone && lead.phone.trim().length > 5) {
    score += 5;
    factors.push("Verified phone number provided");
  }
  if (lead.company && lead.company !== "Individual" && lead.company.trim().length > 1) {
    score += 5;
    factors.push("Registered corporate entity");
  }

  const notesCount = Array.isArray(lead.notes) ? lead.notes.length : 0;
  if (notesCount >= 3) {
    score += 10;
    factors.push("High engagement history (3+ interactions)");
  } else if (notesCount >= 1) {
    score += 5;
    factors.push("Active interaction logged");
  }

  // Clamp score between 1 and 99
  const finalScore = Math.max(5, Math.min(99, score));
  let category: "Hot" | "Warm" | "Cold" = "Warm";

  if (finalScore >= 75) {
    category = "Hot";
  } else if (finalScore < 45) {
    category = "Cold";
  }

  return {
    score: finalScore,
    category,
    factors: factors.slice(0, 4),
  };
};
