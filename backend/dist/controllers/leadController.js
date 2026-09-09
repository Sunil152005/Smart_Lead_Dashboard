"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalytics = exports.importLeads = exports.bulkUpdateLeads = exports.bulkDeleteLeads = exports.addNote = exports.deleteLead = exports.updateLead = exports.getLeads = exports.createLead = void 0;
const Lead_1 = __importDefault(require("../models/Lead"));
const db_1 = require("../services/db");
const leadScorer_1 = require("../services/leadScorer");
const createLead = async (req, res) => {
    try {
        const data = req.body;
        if (!data.name || !data.email) {
            return res.status(400).json({ message: "Lead name and email are required." });
        }
        const scoring = (0, leadScorer_1.calculateLeadScore)(data);
        const initialNotes = Array.isArray(data.notes) ? [...data.notes] : [];
        const creatorName = req.user?.name || "Sales Rep";
        initialNotes.push({
            author: creatorName,
            content: `Lead created in CRM via ${data.source || "Direct"}.`,
            type: "note",
            createdAt: new Date(),
        });
        const leadPayload = {
            ...data,
            dealValue: Number(data.dealValue || 0),
            currency: data.currency || "USD",
            status: data.status || "New",
            priority: data.priority || "Medium",
            source: data.source || "Website",
            assignedTo: data.assignedTo || creatorName,
            leadScore: scoring.score,
            leadScoreCategory: scoring.category,
            scoreFactors: scoring.factors,
            tags: Array.isArray(data.tags) ? data.tags : [],
            notes: initialNotes,
        };
        let createdLead;
        if (db_1.isMongoConnected) {
            createdLead = await Lead_1.default.create(leadPayload);
        }
        else {
            createdLead = {
                _id: `lead_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                ...leadPayload,
                notes: initialNotes.map((n, i) => ({
                    _id: `note_${Date.now()}_${i}`,
                    ...n,
                })),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            db_1.memoryStore.leads.unshift(createdLead);
        }
        return res.status(201).json(createdLead);
    }
    catch (error) {
        console.error("Create Lead Error:", error);
        return res.status(500).json({ message: "Failed to create lead", error: error.message });
    }
};
exports.createLead = createLead;
const getLeads = async (req, res) => {
    try {
        const { search, status, source, priority, assignedTo, category, sortBy = "createdAt", sortOrder = "desc", page = 1, limit = 10, } = req.query;
        if (db_1.isMongoConnected) {
            const query = {};
            if (status && status !== "ALL") {
                query.status = status;
            }
            if (source && source !== "ALL") {
                query.source = source;
            }
            if (priority && priority !== "ALL") {
                query.priority = priority;
            }
            if (assignedTo && assignedTo !== "ALL") {
                query.assignedTo = assignedTo;
            }
            if (category && category !== "ALL") {
                query.leadScoreCategory = category;
            }
            if (search) {
                const searchStr = String(search).trim();
                query.$or = [
                    { name: { $regex: searchStr, $options: "i" } },
                    { email: { $regex: searchStr, $options: "i" } },
                    { company: { $regex: searchStr, $options: "i" } },
                    { phone: { $regex: searchStr, $options: "i" } },
                    { tags: { $in: [new RegExp(searchStr, "i")] } },
                ];
            }
            const sortDirection = sortOrder === "asc" ? 1 : -1;
            const sortObj = { [String(sortBy)]: sortDirection };
            const pageNum = Math.max(1, Number(page));
            const limitNum = limit === "all" ? 1000 : Math.max(1, Number(limit));
            const skip = (pageNum - 1) * limitNum;
            const [leads, total] = await Promise.all([
                Lead_1.default.find(query).sort(sortObj).skip(skip).limit(limitNum),
                Lead_1.default.countDocuments(query),
            ]);
            return res.json({
                leads,
                totalLeads: total,
                totalPages: Math.ceil(total / limitNum) || 1,
                currentPage: pageNum,
            });
        }
        else {
            // Memory Store Querying
            let filtered = [...db_1.memoryStore.leads];
            if (status && status !== "ALL") {
                filtered = filtered.filter((l) => l.status === status);
            }
            if (source && source !== "ALL") {
                filtered = filtered.filter((l) => l.source === source);
            }
            if (priority && priority !== "ALL") {
                filtered = filtered.filter((l) => l.priority === priority);
            }
            if (assignedTo && assignedTo !== "ALL") {
                filtered = filtered.filter((l) => l.assignedTo === assignedTo);
            }
            if (category && category !== "ALL") {
                filtered = filtered.filter((l) => l.leadScoreCategory === category);
            }
            if (search) {
                const q = String(search).toLowerCase().trim();
                filtered = filtered.filter((l) => {
                    const matchName = l.name?.toLowerCase().includes(q);
                    const matchEmail = l.email?.toLowerCase().includes(q);
                    const matchCompany = l.company?.toLowerCase().includes(q);
                    const matchPhone = l.phone?.toLowerCase().includes(q);
                    const matchTags = Array.isArray(l.tags) && l.tags.some((t) => t.toLowerCase().includes(q));
                    return matchName || matchEmail || matchCompany || matchPhone || matchTags;
                });
            }
            // Sorting
            const sortField = String(sortBy);
            const isAsc = sortOrder === "asc";
            filtered.sort((a, b) => {
                let valA = a[sortField];
                let valB = b[sortField];
                if (sortField === "createdAt" || sortField === "updatedAt") {
                    valA = new Date(valA || 0).getTime();
                    valB = new Date(valB || 0).getTime();
                }
                else if (typeof valA === "string") {
                    valA = valA.toLowerCase();
                    valB = (valB || "").toLowerCase();
                }
                if (valA < valB)
                    return isAsc ? -1 : 1;
                if (valA > valB)
                    return isAsc ? 1 : -1;
                return 0;
            });
            const total = filtered.length;
            const pageNum = Math.max(1, Number(page));
            const limitNum = limit === "all" ? 1000 : Math.max(1, Number(limit));
            const skip = (pageNum - 1) * limitNum;
            const paginatedLeads = filtered.slice(skip, skip + limitNum);
            return res.json({
                leads: paginatedLeads,
                totalLeads: total,
                totalPages: Math.ceil(total / limitNum) || 1,
                currentPage: pageNum,
            });
        }
    }
    catch (error) {
        console.error("Get Leads Error:", error);
        return res.status(500).json({ message: "Failed to fetch leads", error: error.message });
    }
};
exports.getLeads = getLeads;
const updateLead = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };
        let existingLead = null;
        if (db_1.isMongoConnected) {
            existingLead = await Lead_1.default.findById(id);
        }
        else {
            existingLead = db_1.memoryStore.leads.find((l) => String(l._id) === String(id));
        }
        if (!existingLead) {
            return res.status(404).json({ message: "Lead not found." });
        }
        // Check if status changed to log activity
        const notes = existingLead.notes ? [...existingLead.notes] : [];
        if (updates.status && updates.status !== existingLead.status) {
            const updater = req.user?.name || "Team Member";
            notes.push({
                _id: `note_${Date.now()}`,
                author: updater,
                content: `Stage changed from "${existingLead.status}" to "${updates.status}".`,
                type: "stage_change",
                createdAt: new Date(),
            });
            updates.notes = notes;
        }
        // Recalculate score with updated fields
        const mergedForScore = {
            ...existingLead.toObject ? existingLead.toObject() : existingLead,
            ...updates,
        };
        const scoring = (0, leadScorer_1.calculateLeadScore)(mergedForScore);
        updates.leadScore = scoring.score;
        updates.leadScoreCategory = scoring.category;
        updates.scoreFactors = scoring.factors;
        updates.updatedAt = new Date();
        let updatedResult;
        if (db_1.isMongoConnected) {
            updatedResult = await Lead_1.default.findByIdAndUpdate(id, updates, { new: true });
        }
        else {
            const idx = db_1.memoryStore.leads.findIndex((l) => String(l._id) === String(id));
            if (idx !== -1) {
                db_1.memoryStore.leads[idx] = {
                    ...db_1.memoryStore.leads[idx],
                    ...updates,
                };
                updatedResult = db_1.memoryStore.leads[idx];
            }
        }
        return res.json(updatedResult);
    }
    catch (error) {
        console.error("Update Lead Error:", error);
        return res.status(500).json({ message: "Failed to update lead", error: error.message });
    }
};
exports.updateLead = updateLead;
const deleteLead = async (req, res) => {
    try {
        const { id } = req.params;
        if (db_1.isMongoConnected) {
            const result = await Lead_1.default.findByIdAndDelete(id);
            if (!result) {
                return res.status(404).json({ message: "Lead not found." });
            }
        }
        else {
            const idx = db_1.memoryStore.leads.findIndex((l) => String(l._id) === String(id));
            if (idx === -1) {
                return res.status(404).json({ message: "Lead not found." });
            }
            db_1.memoryStore.leads.splice(idx, 1);
        }
        return res.json({ message: "Lead deleted successfully", id });
    }
    catch (error) {
        console.error("Delete Lead Error:", error);
        return res.status(500).json({ message: "Failed to delete lead", error: error.message });
    }
};
exports.deleteLead = deleteLead;
const addNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { content, type = "note" } = req.body;
        if (!content) {
            return res.status(400).json({ message: "Note content is required." });
        }
        const author = req.user?.name || "Sales Rep";
        const newNote = {
            author,
            content,
            type: type,
            createdAt: new Date(),
        };
        let updatedLead;
        if (db_1.isMongoConnected) {
            const lead = await Lead_1.default.findById(id);
            if (!lead)
                return res.status(404).json({ message: "Lead not found." });
            lead.notes.push(newNote);
            const scoring = (0, leadScorer_1.calculateLeadScore)(lead);
            lead.leadScore = scoring.score;
            lead.leadScoreCategory = scoring.category;
            lead.scoreFactors = scoring.factors;
            await lead.save();
            updatedLead = lead;
        }
        else {
            const idx = db_1.memoryStore.leads.findIndex((l) => String(l._id) === String(id));
            if (idx === -1)
                return res.status(404).json({ message: "Lead not found." });
            const lead = db_1.memoryStore.leads[idx];
            const noteItem = { _id: `note_${Date.now()}`, ...newNote };
            lead.notes = [...(lead.notes || []), noteItem];
            const scoring = (0, leadScorer_1.calculateLeadScore)(lead);
            lead.leadScore = scoring.score;
            lead.leadScoreCategory = scoring.category;
            lead.scoreFactors = scoring.factors;
            lead.updatedAt = new Date();
            updatedLead = lead;
        }
        return res.json(updatedLead);
    }
    catch (error) {
        console.error("Add Note Error:", error);
        return res.status(500).json({ message: "Failed to add note", error: error.message });
    }
};
exports.addNote = addNote;
const bulkDeleteLeads = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "Array of lead IDs is required." });
        }
        if (db_1.isMongoConnected) {
            await Lead_1.default.deleteMany({ _id: { $in: ids } });
        }
        else {
            db_1.memoryStore.leads = db_1.memoryStore.leads.filter((l) => !ids.map(String).includes(String(l._id)));
        }
        return res.json({ message: `${ids.length} leads deleted successfully.` });
    }
    catch (error) {
        console.error("Bulk Delete Error:", error);
        return res.status(500).json({ message: "Bulk delete failed", error: error.message });
    }
};
exports.bulkDeleteLeads = bulkDeleteLeads;
const bulkUpdateLeads = async (req, res) => {
    try {
        const { ids, updates } = req.body;
        if (!Array.isArray(ids) || ids.length === 0 || !updates) {
            return res.status(400).json({ message: "IDs and update fields are required." });
        }
        if (db_1.isMongoConnected) {
            await Lead_1.default.updateMany({ _id: { $in: ids } }, { $set: updates });
        }
        else {
            db_1.memoryStore.leads = db_1.memoryStore.leads.map((lead) => {
                if (ids.map(String).includes(String(lead._id))) {
                    return { ...lead, ...updates, updatedAt: new Date() };
                }
                return lead;
            });
        }
        return res.json({ message: `${ids.length} leads updated successfully.` });
    }
    catch (error) {
        console.error("Bulk Update Error:", error);
        return res.status(500).json({ message: "Bulk update failed", error: error.message });
    }
};
exports.bulkUpdateLeads = bulkUpdateLeads;
const importLeads = async (req, res) => {
    try {
        const { leads } = req.body;
        if (!Array.isArray(leads) || leads.length === 0) {
            return res.status(400).json({ message: "Array of lead objects is required." });
        }
        const processedLeads = [];
        const author = req.user?.name || "Import Engine";
        for (const item of leads) {
            if (!item.name || !item.email)
                continue;
            const scoring = (0, leadScorer_1.calculateLeadScore)(item);
            const leadObj = {
                name: item.name.trim(),
                email: item.email.trim(),
                phone: item.phone || "",
                company: item.company || "Company",
                jobTitle: item.jobTitle || "Contact",
                dealValue: Number(item.dealValue || 0),
                currency: item.currency || "USD",
                status: item.status || "New",
                priority: item.priority || "Medium",
                source: item.source || "Website",
                assignedTo: item.assignedTo || author,
                leadScore: scoring.score,
                leadScoreCategory: scoring.category,
                scoreFactors: scoring.factors,
                tags: Array.isArray(item.tags) ? item.tags : (item.tags ? String(item.tags).split(",") : []),
                notes: [
                    {
                        author,
                        content: "Lead imported via CSV batch upload.",
                        type: "note",
                        createdAt: new Date(),
                    },
                ],
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            processedLeads.push(leadObj);
        }
        if (db_1.isMongoConnected) {
            await Lead_1.default.insertMany(processedLeads);
        }
        else {
            const timestamped = processedLeads.map((l, i) => ({
                _id: `lead_imp_${Date.now()}_${i}`,
                ...l,
            }));
            db_1.memoryStore.leads.unshift(...timestamped);
        }
        return res.status(201).json({
            message: `Successfully imported ${processedLeads.length} leads.`,
            count: processedLeads.length,
        });
    }
    catch (error) {
        console.error("Import Leads Error:", error);
        return res.status(500).json({ message: "Import failed", error: error.message });
    }
};
exports.importLeads = importLeads;
const getAnalytics = async (_req, res) => {
    try {
        let allLeads = [];
        if (db_1.isMongoConnected) {
            allLeads = await Lead_1.default.find({});
        }
        else {
            allLeads = db_1.memoryStore.leads;
        }
        const totalLeads = allLeads.length;
        let pipelineValue = 0;
        let wonRevenue = 0;
        let lostValue = 0;
        let wonCount = 0;
        let hotLeadsCount = 0;
        const statusCounts = {
            New: { count: 0, value: 0 },
            Contacted: { count: 0, value: 0 },
            "In Progress": { count: 0, value: 0 },
            Qualified: { count: 0, value: 0 },
            "Proposal Sent": { count: 0, value: 0 },
            Won: { count: 0, value: 0 },
            Lost: { count: 0, value: 0 },
        };
        const sourceCounts = {};
        const priorityCounts = {
            Low: 0,
            Medium: 0,
            High: 0,
            Urgent: 0,
        };
        for (const lead of allLeads) {
            const val = Number(lead.dealValue || 0);
            pipelineValue += val;
            if (lead.status === "Won") {
                wonRevenue += val;
                wonCount++;
            }
            else if (lead.status === "Lost") {
                lostValue += val;
            }
            if (lead.leadScoreCategory === "Hot" || lead.leadScore >= 75) {
                hotLeadsCount++;
            }
            // Status breakdown
            if (!statusCounts[lead.status]) {
                statusCounts[lead.status] = { count: 0, value: 0 };
            }
            statusCounts[lead.status].count++;
            statusCounts[lead.status].value += val;
            // Source breakdown
            const src = lead.source || "Other";
            sourceCounts[src] = (sourceCounts[src] || 0) + 1;
            // Priority breakdown
            const prio = lead.priority || "Medium";
            priorityCounts[prio] = (priorityCounts[prio] || 0) + 1;
        }
        const conversionRate = totalLeads > 0 ? Number(((wonCount / totalLeads) * 100).toFixed(1)) : 0;
        const avgDealSize = totalLeads > 0 ? Math.round(pipelineValue / totalLeads) : 0;
        return res.json({
            totalLeads,
            pipelineValue,
            wonRevenue,
            lostValue,
            conversionRate,
            avgDealSize,
            hotLeadsCount,
            statusCounts,
            sourceCounts,
            priorityCounts,
        });
    }
    catch (error) {
        console.error("Analytics Error:", error);
        return res.status(500).json({ message: "Failed to generate analytics", error: error.message });
    }
};
exports.getAnalytics = getAnalytics;
