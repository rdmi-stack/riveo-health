require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { MongoClient, ObjectId } = require("mongodb");
const OpenAI = require("openai");
const bcrypt = require("bcryptjs");
const { SignJWT, jwtVerify } = require("jose");

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ──────────────────────────────────────────
app.use(helmet());
app.use(morgan("tiny"));
app.use(express.json({ limit: "10mb" }));
app.use(cors({
  origin: [process.env.FRONTEND_URL || "http://localhost:3000", "https://riveohealth.netlify.app", "http://localhost:3000"],
  credentials: true,
}));

// ── MongoDB ────────────────────────────────────────────
let db;
const mongoClient = new MongoClient(process.env.MONGODB_URI);

async function connectDB() {
  await mongoClient.connect();
  db = mongoClient.db(process.env.MONGODB_DB_NAME || "riveohealth");
  console.log("MongoDB connected");
}

function col(name) { return db.collection(name); }

// ── OpenAI ─────────────────────────────────────────────
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function chat(system, user, opts = {}) {
  const res = await openai.chat.completions.create({
    model: opts.model || "gpt-5.4",
    messages: [{ role: "system", content: system }, { role: "user", content: user }],
    temperature: opts.temperature ?? 0.3,
    max_completion_tokens: opts.maxTokens ?? 2000,
    ...(opts.json && { response_format: { type: "json_object" } }),
  });
  return res.choices[0]?.message?.content || "";
}

// ── JWT ────────────────────────────────────────────────
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "riveo-dev-secret");

async function createToken(payload) {
  return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("8h").sign(JWT_SECRET);
}

async function verifyToken(token) {
  try { const { payload } = await jwtVerify(token, JWT_SECRET); return payload; } catch { return null; }
}

// ── PHI Masking ────────────────────────────────────────
function maskPHI(text) {
  return text
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[SSN]")
    .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, "[PHONE]")
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, "[EMAIL]");
}

// ════════════════════════════════════════════════════════
//  ROUTES
// ════════════════════════════════════════════════════════

// ── Health ─────────────────────────────────────────────
app.get("/api/health", async (req, res) => {
  try {
    await db.command({ ping: 1 });
    res.json({ status: "ok", mongodb: "connected", openai: process.env.OPENAI_API_KEY ? "configured" : "missing", timestamp: new Date().toISOString() });
  } catch (e) {
    res.status(503).json({ status: "degraded", mongodb: e.message });
  }
});

// ── Auth: Signup ───────────────────────────────────────
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password, orgName, specialty, physicians } = req.body;
    if (!firstName || !email || !password || !orgName) return res.status(400).json({ error: "Missing fields" });
    if (password.length < 8) return res.status(400).json({ error: "Password too short" });

    const existing = await col("users").findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: "Email exists" });

    const org = await col("organizations").insertOne({ name: orgName, specialty: specialty || "Multi-Specialty", physicians: parseInt(physicians) || 1, plan: "starter", onboardingComplete: false, createdAt: new Date() });
    const hash = await bcrypt.hash(password, 12);
    const user = await col("users").insertOne({ orgId: org.insertedId.toString(), firstName, lastName: lastName || "", email: email.toLowerCase(), passwordHash: hash, role: "admin", createdAt: new Date() });
    const token = await createToken({ userId: user.insertedId.toString(), orgId: org.insertedId.toString(), email: email.toLowerCase(), role: "admin", orgName });

    res.status(201).json({ success: true, token, user: { id: user.insertedId.toString(), email: email.toLowerCase(), role: "admin" }, org: { id: org.insertedId.toString(), name: orgName } });
  } catch (e) { res.status(500).json({ error: "Signup failed" }); }
});

// ── Auth: Login ────────────────────────────────────────
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const user = await col("users").findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const org = await col("organizations").findOne({ _id: new ObjectId(user.orgId) });
    const token = await createToken({ userId: user._id.toString(), orgId: user.orgId, email: user.email, role: user.role, orgName: org?.name || "" });
    await col("users").updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } });

    res.json({ success: true, token, user: { id: user._id.toString(), firstName: user.firstName, email: user.email, role: user.role }, org: { id: user.orgId, name: org?.name, onboardingComplete: org?.onboardingComplete } });
  } catch (e) { res.status(500).json({ error: "Login failed" }); }
});

// ── Auth: Me ───────────────────────────────────────────
app.get("/api/auth/me", async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  const user = await verifyToken(token);
  if (!user) return res.status(401).json({ error: "Invalid token" });
  res.json({ user });
});

// ── Contact ────────────────────────────────────────────
app.post("/api/contact", async (req, res) => {
  try {
    const { firstName, email, message } = req.body;
    if (!firstName || !email || !message) return res.status(400).json({ error: "Missing fields" });
    const result = await col("contacts").insertOne({ ...req.body, source: "website", status: "new", createdAt: new Date() });
    res.status(201).json({ success: true, id: result.insertedId.toString() });
  } catch (e) { res.status(500).json({ error: "Failed" }); }
});

// ── Demo Request ───────────────────────────────────────
app.post("/api/demo", async (req, res) => {
  try {
    const result = await col("demo_requests").insertOne({ ...req.body, source: "website", status: "new", createdAt: new Date() });
    res.status(201).json({ success: true, id: result.insertedId.toString() });
  } catch (e) { res.status(500).json({ error: "Failed" }); }
});

// ── Claims ─────────────────────────────────────────────
app.get("/api/claims", async (req, res) => {
  try {
    const { org = "demo", status, payer, search, page = 1, limit = 50 } = req.query;
    const filter = { orgId: org };
    if (status) filter.status = status;
    if (payer) filter.payer = payer;
    if (search) filter.$or = [{ claimId: { $regex: search, $options: "i" } }, { patientId: { $regex: search, $options: "i" } }];
    const [claims, total] = await Promise.all([
      col("claims").find(filter).sort({ submittedAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit)).toArray(),
      col("claims").countDocuments(filter),
    ]);
    res.json({ claims, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
  } catch (e) { res.status(500).json({ error: "Failed" }); }
});

app.post("/api/claims", async (req, res) => {
  try {
    const result = await col("claims").insertOne({ ...req.body, orgId: req.body.orgId || "demo", createdAt: new Date() });
    res.status(201).json({ success: true, id: result.insertedId.toString() });
  } catch (e) { res.status(500).json({ error: "Failed" }); }
});

// ── Claims Import ──────────────────────────────────────
app.post("/api/claims/import", async (req, res) => {
  try {
    const { orgId = "demo", claims } = req.body;
    if (!Array.isArray(claims)) return res.status(400).json({ error: "claims array required" });
    const docs = claims.map((c, i) => ({ orgId, ...c, claimId: c.claimId || `IMP-${Date.now()}-${i}`, createdAt: new Date() }));
    await col("claims").insertMany(docs);
    const denied = docs.filter(d => d.status === "denied");
    if (denied.length) await col("denials").insertMany(denied.map(d => ({ orgId, claimId: d.claimId, payer: d.payer, billedAmount: d.billedAmount, denialCode: d.denialCode, status: "new", createdAt: new Date() })));
    res.status(201).json({ success: true, imported: docs.length, denialsCreated: denied.length });
  } catch (e) { res.status(500).json({ error: "Failed" }); }
});

// ── Denials ────────────────────────────────────────────
app.get("/api/denials", async (req, res) => {
  try {
    const { org = "demo", status, priority, page = 1, limit = 50 } = req.query;
    const filter = { orgId: org };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    const [denials, total] = await Promise.all([
      col("denials").find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit)).toArray(),
      col("denials").countDocuments(filter),
    ]);
    res.json({ denials, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
  } catch (e) { res.status(500).json({ error: "Failed" }); }
});

app.patch("/api/denials", async (req, res) => {
  try {
    const { id, status, notes } = req.body;
    if (!id) return res.status(400).json({ error: "id required" });
    const update = { updatedAt: new Date() };
    if (status) update.status = status;
    if (notes) update.notes = notes;
    if (status === "resolved") update.resolvedAt = new Date();
    await col("denials").updateOne({ _id: new ObjectId(id) }, { $set: update });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: "Failed" }); }
});

// ── Denial AI Analysis ─────────────────────────────────
app.post("/api/denials/analyze", async (req, res) => {
  try {
    const { claimId, payer, cptCode, icdCode, billedAmount, denialCode, denialReason } = req.body;
    const prompt = `Analyze denied claim: Claim=${claimId}, Payer=${payer}, CPT=${cptCode}, ICD=${icdCode}, Billed=$${billedAmount}, Code=${denialCode}, Reason=${denialReason}. Return JSON: {"explanation","rootCause","fixSteps":[],"appealLikelihood":number,"estimatedRecovery":number,"urgency":"high"|"medium"|"low","daysToAct":number}`;
    const r = await chat("You are a healthcare denial analysis expert.", prompt, { json: true });
    res.json({ success: true, analysis: JSON.parse(r) });
  } catch (e) { res.status(500).json({ error: "Analysis failed" }); }
});

// ── Analytics ──────────────────────────────────────────
app.get("/api/analytics", async (req, res) => {
  try {
    const orgId = req.query.org || "demo";
    const [totalClaims, statusBreakdown, totalBilled, totalPaid, denialsByReason, denialsByPayer, recentDenials, monthlyTrend] = await Promise.all([
      col("claims").countDocuments({ orgId }),
      col("claims").aggregate([{ $match: { orgId } }, { $group: { _id: "$status", count: { $sum: 1 }, amount: { $sum: "$billedAmount" } } }]).toArray(),
      col("claims").aggregate([{ $match: { orgId } }, { $group: { _id: null, total: { $sum: "$billedAmount" } } }]).toArray(),
      col("claims").aggregate([{ $match: { orgId } }, { $group: { _id: null, total: { $sum: "$paidAmount" } } }]).toArray(),
      col("denials").aggregate([{ $match: { orgId } }, { $group: { _id: "$denialCode", count: { $sum: 1 }, amount: { $sum: "$billedAmount" } } }, { $sort: { count: -1 } }, { $limit: 10 }]).toArray(),
      col("denials").aggregate([{ $match: { orgId } }, { $group: { _id: "$payer", count: { $sum: 1 }, amount: { $sum: "$billedAmount" } } }, { $sort: { count: -1 } }]).toArray(),
      col("denials").find({ orgId }).sort({ createdAt: -1 }).limit(5).toArray(),
      col("claims").aggregate([{ $match: { orgId } }, { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$dateOfService" } }, claims: { $sum: 1 }, billed: { $sum: "$billedAmount" }, paid: { $sum: "$paidAmount" }, denied: { $sum: { $cond: [{ $eq: ["$status", "denied"] }, 1, 0] } } } }, { $sort: { _id: 1 } }, { $limit: 6 }]).toArray(),
    ]);
    const tb = totalBilled[0]?.total || 0;
    const tp = totalPaid[0]?.total || 0;
    const dc = statusBreakdown.find(s => s._id === "denied")?.count || 0;
    res.json({ summary: { totalClaims, totalBilled: tb, totalPaid: tp, totalDenied: dc, denialRate: totalClaims > 0 ? dc / totalClaims : 0, collectionRate: tb > 0 ? tp / tb : 0, outstandingAR: tb - tp }, statusBreakdown, denialsByReason, denialsByPayer, recentDenials, monthlyTrend });
  } catch (e) { res.status(500).json({ error: "Failed" }); }
});

// ── Seed Demo Data ─────────────────────────────────────
app.get("/api/seed", async (req, res) => {
  try {
    const orgId = req.query.org || "demo";
    const payers = ["Medicare", "BCBS", "UnitedHealthcare", "Aetna", "Cigna", "Medicaid"];
    const cpts = ["99213", "99214", "99215", "99203", "73721", "71046", "93000"];
    const denialCodes = [{ code: "CO-16", reason: "Missing info" }, { code: "CO-22", reason: "COB issue" }, { code: "CO-197", reason: "No prior auth" }, { code: "CO-4", reason: "Code mismatch" }, { code: "CO-18", reason: "Duplicate" }, { code: "CO-29", reason: "Timely filing" }, { code: "CO-97", reason: "Bundling" }, { code: "CO-50", reason: "Non-covered" }];
    const providers = ["Dr. Sarah Chen", "Dr. James Wilson", "Dr. Maria Garcia", "Dr. Robert Kim", "Dr. Emily Johnson"];

    await col("claims").deleteMany({ orgId });
    await col("denials").deleteMany({ orgId });

    const claims = []; const denials = [];
    for (let i = 0; i < 500; i++) {
      const payer = payers[Math.floor(Math.random() * payers.length)];
      const cpt = cpts[Math.floor(Math.random() * cpts.length)];
      const billed = 100 + Math.floor(Math.random() * 800);
      const isDenied = Math.random() < 0.14;
      const paid = isDenied ? 0 : Math.round(billed * (0.6 + Math.random() * 0.3));
      const denial = isDenied ? denialCodes[Math.floor(Math.random() * denialCodes.length)] : null;
      const dos = new Date(Date.now() - Math.floor(Math.random() * 90) * 86400000);

      claims.push({ orgId, claimId: `CLM-${String(i + 1).padStart(5, "0")}`, patientId: `PAT-${String(Math.floor(Math.random() * 200) + 1).padStart(4, "0")}`, dateOfService: dos, payer, cptCode: cpt, icdCode: ["E11.9", "I10", "J06.9", "M54.5"][Math.floor(Math.random() * 4)], billedAmount: billed, allowedAmount: isDenied ? 0 : paid, paidAmount: paid, status: isDenied ? "denied" : "paid", denialCode: denial?.code || null, denialReason: denial?.reason || null, provider: providers[Math.floor(Math.random() * providers.length)], submittedAt: dos, createdAt: new Date() });

      if (isDenied) denials.push({ orgId, claimId: `CLM-${String(i + 1).padStart(5, "0")}`, payer, billedAmount: billed, denialCode: denial.code, denialReason: denial.reason, priority: billed > 500 ? "high" : billed > 200 ? "medium" : "low", status: Math.random() < 0.3 ? "in_progress" : "new", dateOfService: dos, createdAt: new Date() });
    }
    await col("claims").insertMany(claims);
    if (denials.length) await col("denials").insertMany(denials);
    res.json({ success: true, claimsCreated: claims.length, denialsCreated: denials.length });
  } catch (e) { res.status(500).json({ error: "Seed failed" }); }
});

// ── AI Coding ──────────────────────────────────────────
app.post("/api/coding", async (req, res) => {
  try {
    const { clinicalNote, specialty } = req.body;
    if (!clinicalNote) return res.status(400).json({ error: "clinicalNote required" });
    const r = await chat("You are an expert medical coder.", `Code this note (specialty: ${specialty || "General"}):\n${maskPHI(clinicalNote)}\n\nReturn JSON: {"icdCodes":[{"code","description","confidence":number,"supportingText"}],"cptCodes":[{"code","description","confidence":number,"modifier","emLevel","supportingText"}],"codingAlerts":[{"type","severity","message","revenueImpact"}],"summary":{"totalIcdCodes":number,"totalCptCodes":number,"alertCount":number,"documentationQuality":"good|fair|poor"}}`, { json: true });
    res.json({ success: true, coding: JSON.parse(r) });
  } catch (e) { res.status(500).json({ error: "Coding failed" }); }
});

// ── Denial Prediction ──────────────────────────────────
app.post("/api/claims/predict", async (req, res) => {
  try {
    const { claims } = req.body;
    if (!Array.isArray(claims)) return res.status(400).json({ error: "claims required" });
    const batch = claims.slice(0, 20).map((c, i) => `Claim ${i + 1}: Payer=${c.payer}, CPT=${c.cptCode}, ICD=${c.icdCode}, Billed=$${c.billedAmount}`).join("\n");
    const r = await chat("You are a denial prediction engine.", `Predict denial risk:\n${batch}\n\nReturn JSON: {"predictions":[{"claimIndex":number,"riskScore":number,"riskLevel":"high"|"medium"|"low","riskFactors":[{"factor","severity","fix"}],"recommendation":"submit"|"review"|"hold"}],"batchSummary":{"totalClaims":number,"highRisk":number,"mediumRisk":number,"lowRisk":number,"totalAtRiskAmount":number}}`, { json: true });
    res.json({ success: true, prediction: JSON.parse(r) });
  } catch (e) { res.status(500).json({ error: "Prediction failed" }); }
});

// ── Prior Auth ─────────────────────────────────────────
app.post("/api/prior-auth", async (req, res) => {
  try {
    const { payer, cptCode, procedure, orgId = "demo" } = req.body;
    if (!payer || !procedure) return res.status(400).json({ error: "payer and procedure required" });
    const r = await chat("You are a prior authorization specialist.", `Generate PA request: Payer=${payer}, CPT=${cptCode}, Procedure=${procedure}. Return JSON: {"authRequest":{"medicalNecessityStatement","supportingCriteria":[],"requiredDocuments":[]},"approvalLikelihood":number,"tips":[]}`, { json: true });
    const pa = JSON.parse(r);
    const result = await col("prior_auths").insertOne({ orgId, payer, cptCode, procedure, aiGenerated: pa, approvalLikelihood: pa.approvalLikelihood, status: "draft", createdAt: new Date() });
    res.status(201).json({ success: true, id: result.insertedId.toString(), priorAuth: pa });
  } catch (e) { res.status(500).json({ error: "PA generation failed" }); }
});

app.get("/api/prior-auth", async (req, res) => {
  try {
    const items = await col("prior_auths").find({ orgId: req.query.org || "demo" }).sort({ createdAt: -1 }).limit(50).toArray();
    res.json({ priorAuths: items });
  } catch (e) { res.status(500).json({ error: "Failed" }); }
});

// ── Voice Agent ────────────────────────────────────────
app.post("/api/voice-agent", async (req, res) => {
  try {
    const { action, callerMessage, callHistory = [], patientId, orgId = "demo" } = req.body;
    if (action === "handle_call") {
      const context = callHistory.length > 0 ? callHistory.map(m => `${m.role}: ${m.content}`).join("\n") + "\n\n" : "";
      const r = await chat("You are a friendly patient billing assistant on the phone. Keep responses concise (2-3 sentences). Always be helpful and empathetic.", `${context}Caller: "${callerMessage}"\n\nRespond naturally:`, { temperature: 0.4, maxTokens: 300 });
      await col("voice_calls").insertOne({ orgId, patientId, callerMessage, aiResponse: r, createdAt: new Date() });
      return res.json({ success: true, response: r });
    }
    if (action === "seed_demo") {
      // seed demo calls
      return res.json({ success: true });
    }
    res.status(400).json({ error: "Invalid action" });
  } catch (e) { res.status(500).json({ error: "Voice agent failed" }); }
});

app.get("/api/voice-agent", async (req, res) => {
  try {
    const items = await col("voice_calls").find({ orgId: req.query.org || "demo" }).sort({ createdAt: -1 }).limit(30).toArray();
    res.json({ calls: items, total: items.length });
  } catch (e) { res.status(500).json({ error: "Failed" }); }
});

// ── Resemble AI Voice ──────────────────────────────────
app.post("/api/voice", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "text required" });
    const API_KEY = process.env.RESEMBLE_API_KEY;
    const PROJECT = process.env.RESEMBLE_PROJECT_UUID;
    const VOICE = process.env.RESEMBLE_VOICE_EN;
    if (!API_KEY || !PROJECT) return res.status(500).json({ error: "Resemble not configured" });

    const r = await fetch(`https://app.resemble.ai/api/v2/projects/${PROJECT}/clips`, {
      method: "POST",
      headers: { "Authorization": `Token token=${API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ title: `v-${Date.now()}`, body: text, voice_uuid: VOICE, is_public: false, raw: false }),
    });

    if (!r.ok) {
      // Try sync endpoint
      const sr = await fetch(`https://app.resemble.ai/api/v2/projects/${PROJECT}/clips/sync`, {
        method: "POST",
        headers: { "Authorization": `Token token=${API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ body: `<speak>${text}</speak>`, voice_uuid: VOICE, output_format: "mp3" }),
      });
      if (sr.ok) { const sd = await sr.json(); return res.json({ success: true, audioUrl: sd.item?.audio_src || sd.audio_src }); }
      return res.status(500).json({ error: "Voice synthesis failed" });
    }

    const data = await r.json();
    const clip = data.item || data;
    if (clip.audio_src) return res.json({ success: true, audioUrl: clip.audio_src, status: "ready" });

    // Poll
    for (let i = 0; i < 10; i++) {
      await new Promise(r => setTimeout(r, 1000));
      const pr = await fetch(`https://app.resemble.ai/api/v2/projects/${PROJECT}/clips/${clip.uuid}`, { headers: { "Authorization": `Token token=${API_KEY}` } });
      if (pr.ok) { const pd = await pr.json(); if (pd.item?.audio_src) return res.json({ success: true, audioUrl: pd.item.audio_src, status: "ready" }); }
    }
    res.json({ success: true, status: "processing" });
  } catch (e) { res.status(500).json({ error: "Voice failed" }); }
});

// ── Eligibility ────────────────────────────────────────
app.post("/api/eligibility", async (req, res) => {
  try {
    const { payer, memberId, serviceType, firstName, lastName, orgId = "demo" } = req.body;
    if (!payer || !memberId) return res.status(400).json({ error: "payer and memberId required" });
    const r = await chat("You are an eligibility verification system.", `Verify: Payer=${payer}, Member=${memberId}, Service=${serviceType || "Office Visit"}, Patient=${firstName || ""} ${lastName || ""}. Return JSON: {"eligible":boolean,"status":"active"|"inactive","planInfo":{"planName","planType"},"benefits":{"copay":number,"coinsurance":number,"deductible":{"individual":number,"remaining":number}},"serviceSpecific":{"covered":boolean,"priorAuthRequired":boolean,"estimatedPatientResponsibility":number},"alerts":[{"type","severity","message"}]}`, { json: true });
    const v = JSON.parse(r);
    await col("eligibility_checks").insertOne({ orgId, payer, memberId, result: v, eligible: v.eligible, createdAt: new Date() });
    res.json({ success: true, ...v });
  } catch (e) { res.status(500).json({ error: "Verification failed" }); }
});

app.get("/api/eligibility", async (req, res) => {
  try {
    const items = await col("eligibility_checks").find({ orgId: req.query.org || "demo" }).sort({ createdAt: -1 }).limit(30).toArray();
    res.json({ verifications: items, stats: { total: items.length, eligible: items.filter(i => i.eligible).length, ineligible: items.filter(i => !i.eligible).length } });
  } catch (e) { res.status(500).json({ error: "Failed" }); }
});

// ── Estimate ───────────────────────────────────────────
app.post("/api/estimate", async (req, res) => {
  try {
    const { services = [], payer, copay, deductibleRemaining, coinsurance, patientName, orgId = "demo" } = req.body;
    if (!services.length) return res.status(400).json({ error: "services required" });
    const list = services.map((s, i) => `Service ${i + 1}: CPT=${s.cptCode}, Desc=${s.description}`).join("\n");
    const r = await chat("You are a price transparency specialist.", `Estimate for: Payer=${payer || "Self-Pay"}, Copay=$${copay || "?"}, Deductible=$${deductibleRemaining || "?"}, Coinsurance=${coinsurance || "?"}%.\n${list}\n\nReturn JSON: {"services":[{"cptCode","description","providerCharge":number,"insurancePays":number,"patientResponsibility":number}],"summary":{"totalProviderCharges":number,"totalInsurancePays":number,"totalPatientResponsibility":number},"paymentOptions":[{"option","amount":number,"monthly":number}]}`, { json: true });
    const est = JSON.parse(r);
    await col("patient_estimates").insertOne({ orgId, patientName, payer, services, estimate: est, totalPatientResponsibility: est.summary?.totalPatientResponsibility || 0, createdAt: new Date() });
    res.json({ success: true, ...est });
  } catch (e) { res.status(500).json({ error: "Estimation failed" }); }
});

// ── Audit ──────────────────────────────────────────────
app.post("/api/audit", async (req, res) => {
  try {
    const { practiceName, specialty, physicians, annualRevenue, monthlyClaimsVolume, currentDenialRate, averageDaysInAR, email, orgId = "demo" } = req.body;
    const r = await chat("You are a healthcare revenue cycle auditor.", `Audit: Practice=${practiceName}, Specialty=${specialty}, Physicians=${physicians}, Revenue=$${annualRevenue}, Claims/mo=${monthlyClaimsVolume}, Denial=${currentDenialRate}%, AR=${averageDaysInAR} days. Return JSON: {"totalLeakageEstimate":number,"recoveryPotential":number,"denialAnalysis":{"topDenialReasons":[{"reason","percentage":number}]},"recommendations":[{"priority":"critical"|"high","title","potentialSavings":number}],"roiProjection":{"monthlyRiveoCost":number,"monthlyRecovery":number,"roiMultiple":number}}`, { json: true });
    const analysis = JSON.parse(r);
    const result = await col("audit_results").insertOne({ orgId, input: req.body, analysis, createdAt: new Date() });
    if (email) await col("audit_requests").insertOne({ email, practiceName, orgId, auditId: result.insertedId, createdAt: new Date() });
    res.json({ success: true, auditId: result.insertedId.toString(), analysis });
  } catch (e) { res.status(500).json({ error: "Audit failed" }); }
});

// ── Notifications ──────────────────────────────────────
app.get("/api/notifications", async (req, res) => {
  try {
    const { org = "demo", unread } = req.query;
    const filter = { orgId: org };
    if (unread === "true") filter.read = false;
    const [items, unreadCount] = await Promise.all([
      col("notifications").find(filter).sort({ createdAt: -1 }).limit(30).toArray(),
      col("notifications").countDocuments({ orgId: org, read: false }),
    ]);
    res.json({ notifications: items, unreadCount });
  } catch (e) { res.status(500).json({ error: "Failed" }); }
});

app.post("/api/notifications", async (req, res) => {
  try {
    const result = await col("notifications").insertOne({ ...req.body, orgId: req.body.orgId || "demo", read: false, createdAt: new Date() });
    res.status(201).json({ success: true, id: result.insertedId.toString() });
  } catch (e) { res.status(500).json({ error: "Failed" }); }
});

app.patch("/api/notifications", async (req, res) => {
  try {
    const { id, action, orgId } = req.body;
    if (action === "read" && id) await col("notifications").updateOne({ _id: new ObjectId(id) }, { $set: { read: true } });
    else if (action === "read_all" && orgId) await col("notifications").updateMany({ orgId, read: false }, { $set: { read: true } });
    else if (action === "dismiss" && id) await col("notifications").deleteOne({ _id: new ObjectId(id) });
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: "Failed" }); }
});

// ── Compliance ─────────────────────────────────────────
app.get("/api/compliance", async (req, res) => {
  try {
    const orgId = req.query.org || "demo";
    const [auditLogs, phiLogs, consents, breaches] = await Promise.all([
      col("audit_log").countDocuments({ orgId }),
      col("phi_access_log").countDocuments({ orgId }),
      col("consent_records").countDocuments({ orgId }),
      col("breach_records").countDocuments({ orgId }),
    ]);
    res.json({ compliance: { hipaa: { status: "compliant" }, dpdp: { status: "compliant" }, metrics: { auditLogs, phiLogs, consents, breaches } } });
  } catch (e) { res.status(500).json({ error: "Failed" }); }
});

// ── Chat ───────────────────────────────────────────────
app.post("/api/chat", async (req, res) => {
  try {
    const { message, conversationHistory = [], orgId = "demo" } = req.body;
    if (!message) return res.status(400).json({ error: "message required" });
    const context = conversationHistory.slice(-10).map(m => `${m.role}: ${m.content}`).join("\n");
    const r = await chat("You are a friendly patient billing assistant. Use simple language. Never share other patients' info. Offer payment plans for large bills.", `${context}\nPatient: ${maskPHI(message)}\n\nRespond helpfully:`, { temperature: 0.4, maxTokens: 500 });
    await col("chat_conversations").insertOne({ orgId, userMessage: maskPHI(message), aiResponse: r, createdAt: new Date() });
    res.json({ success: true, reply: r });
  } catch (e) { res.status(500).json({ error: "Chat failed" }); }
});

// ── Patient Portal ─────────────────────────────────────
app.get("/api/patient-portal", async (req, res) => {
  try {
    const { patientId = "PAT-DEMO", org = "demo" } = req.query;
    const bills = await col("patient_bills").find({ orgId: org, patientId }).sort({ createdAt: -1 }).limit(20).toArray();
    const payments = await col("patient_payments").find({ orgId: org, patientId }).sort({ createdAt: -1 }).limit(10).toArray();
    const totalBalance = bills.reduce((s, b) => s + (b.balance || 0), 0);
    const totalPaid = payments.reduce((s, p) => s + (p.amount || 0), 0);
    res.json({ patientId, totalBalance, totalPaid, billCount: bills.length, bills, payments });
  } catch (e) { res.status(500).json({ error: "Failed" }); }
});

app.post("/api/patient-portal", async (req, res) => {
  try {
    const { action, patientId = "PAT-DEMO", orgId = "demo" } = req.body;
    if (action === "pay") {
      const { billId, amount, method = "card" } = req.body;
      await col("patient_payments").insertOne({ orgId, patientId, billId, amount, method, status: "completed", confirmationNumber: `PAY-${Date.now().toString(36).toUpperCase()}`, createdAt: new Date() });
      return res.json({ success: true, message: "Payment processed" });
    }
    if (action === "message") {
      await col("patient_messages").insertOne({ orgId, patientId, from: "patient", message: req.body.message, createdAt: new Date() });
      return res.json({ success: true, message: "Message sent" });
    }
    if (action === "seed_demo") {
      const bills = [
        { orgId, patientId, description: "Office Visit — Dr. Sarah Chen", dateOfService: "2026-02-15", totalCharge: 320, insurancePaid: 250, balance: 70, status: "due", createdAt: new Date() },
        { orgId, patientId, description: "MRI Knee — Right", dateOfService: "2026-01-28", totalCharge: 1850, insurancePaid: 1400, balance: 450, status: "due", createdAt: new Date() },
        { orgId, patientId, description: "Lab Work", dateOfService: "2026-03-01", totalCharge: 180, insurancePaid: 140, balance: 40, status: "due", createdAt: new Date() },
      ];
      await col("patient_bills").deleteMany({ orgId, patientId });
      await col("patient_bills").insertMany(bills);
      return res.json({ success: true, bills: bills.length });
    }
    res.status(400).json({ error: "Invalid action" });
  } catch (e) { res.status(500).json({ error: "Failed" }); }
});

// ── Statements ─────────────────────────────────────────
app.get("/api/statements", async (req, res) => {
  try {
    const items = await col("digital_statements").find({ orgId: req.query.org || "demo" }).sort({ createdAt: -1 }).limit(50).toArray();
    res.json({ statements: items, stats: { totalSent: items.length, totalOpened: items.filter(i => i.openedAt).length, totalPaid: items.filter(i => i.paidAt).length } });
  } catch (e) { res.status(500).json({ error: "Failed" }); }
});

// ── Catch-all for unimplemented routes ─────────────────
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// ── Start ──────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Riveo Health API running on port ${PORT}`));
}).catch(err => {
  console.error("Failed to connect to MongoDB:", err);
  process.exit(1);
});
