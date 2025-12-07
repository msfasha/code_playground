require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const http = require("http");
const { Server } = require("socket.io");
const OpenAI = require("openai");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "cms_db",
  password: process.env.DB_PASSWORD || "postgres",
  port: process.env.DB_PORT || 5432,
});

// Initialize OpenAI client (optional - will work without API key for demo)
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
    console.log('Note: Make sure PostgreSQL is running and database is created');
  } else {
    console.log('Database connected successfully');
  }
});

// Helper function to convert PostGIS point to lat/lng
const pointToLatLng = (point) => {
  if (!point) return { lat: null, lng: null };
  // PostGIS returns point as "POINT(lng lat)" or as object
  if (typeof point === 'string') {
    const match = point.match(/POINT\(([^ ]+) ([^ ]+)\)/);
    if (match) {
      return { lng: parseFloat(match[1]), lat: parseFloat(match[2]) };
    }
  }
  return { lat: point.y || point.lat, lng: point.x || point.lng };
};

// Helper function to create PostGIS point from lat/lng
const latLngToPoint = (lat, lng) => {
  return `POINT(${lng} ${lat})`;
};

// REST API Routes

// Get all incidents
app.get("/api/incidents", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        i.*,
        ST_AsText(i.location) as location_text,
        ST_X(i.location) as lng,
        ST_Y(i.location) as lat,
        a.name_en as agency_name,
        a.name_ar as agency_name_ar,
        a.code as agency_code
      FROM incidents i
      LEFT JOIN agencies a ON i.reporting_agency_id = a.id
      ORDER BY i.created_at DESC
    `);
    
    const incidents = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      type: row.type,
      severity: row.severity,
      status: row.status,
      lat: parseFloat(row.lat),
      lng: parseFloat(row.lng),
      agency: row.agency_name || 'Unknown',
      agencyCode: row.agency_code,
      reportingUser: row.reporting_user,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
    
    res.json(incidents);
  } catch (error) {
    console.error("Error fetching incidents:", error);
    res.status(500).json({ error: "Failed to fetch incidents" });
  }
});

// Get single incident
app.get("/api/incidents/:id", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        i.*,
        ST_X(i.location) as lng,
        ST_Y(i.location) as lat,
        a.name_en as agency_name,
        a.name_ar as agency_name_ar,
        a.code as agency_code
      FROM incidents i
      LEFT JOIN agencies a ON i.reporting_agency_id = a.id
      WHERE i.id = $1
    `, [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Incident not found" });
    }
    
    const row = result.rows[0];
    const incident = {
      id: row.id,
      title: row.title,
      description: row.description,
      type: row.type,
      severity: row.severity,
      status: row.status,
      lat: parseFloat(row.lat),
      lng: parseFloat(row.lng),
      agency: row.agency_name || 'Unknown',
      agencyCode: row.agency_code,
      reportingUser: row.reporting_user,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
    
    res.json(incident);
  } catch (error) {
    console.error("Error fetching incident:", error);
    res.status(500).json({ error: "Failed to fetch incident" });
  }
});

// Create incident
app.post("/api/incidents", async (req, res) => {
  try {
    const { title, description, type, severity, lat, lng, reportingAgencyId, reportingUser } = req.body;
    
    if (!title || !type || !severity || !lat || !lng) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const point = latLngToPoint(lat, lng);
    const result = await pool.query(`
      INSERT INTO incidents (title, description, type, severity, status, location, reporting_agency_id, reporting_user)
      VALUES ($1, $2, $3, $4, $5, ST_GeomFromText($6, 4326), $7, $8)
      RETURNING id, created_at
    `, [title, description || '', type, severity, 'Reported', point, reportingAgencyId || null, reportingUser || 'Admin']);
    
    // Log audit
    await pool.query(`
      INSERT INTO audit_logs (incident_id, user_name, action, details)
      VALUES ($1, $2, 'CREATE', $3)
    `, [result.rows[0].id, reportingUser || 'Admin', JSON.stringify({ title, type, severity })]);
    
    // Emit WebSocket event
    io.emit('incident_created', { id: result.rows[0].id });
    
    res.status(201).json({ id: result.rows[0].id, createdAt: result.rows[0].created_at });
  } catch (error) {
    console.error("Error creating incident:", error);
    res.status(500).json({ error: "Failed to create incident" });
  }
});

// Update incident
app.put("/api/incidents/:id", async (req, res) => {
  try {
    const { title, description, type, severity, status, lat, lng } = req.body;
    const updates = [];
    const values = [];
    let paramCount = 1;
    
    if (title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      values.push(title);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description);
    }
    if (type !== undefined) {
      updates.push(`type = $${paramCount++}`);
      values.push(type);
    }
    if (severity !== undefined) {
      updates.push(`severity = $${paramCount++}`);
      values.push(severity);
    }
    if (status !== undefined) {
      updates.push(`status = $${paramCount++}`);
      values.push(status);
    }
    if (lat !== undefined && lng !== undefined) {
      const point = latLngToPoint(lat, lng);
      updates.push(`location = ST_GeomFromText($${paramCount++}, 4326)`);
      values.push(point);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }
    
    values.push(req.params.id);
    const result = await pool.query(`
      UPDATE incidents 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Incident not found" });
    }
    
    // Log audit
    await pool.query(`
      INSERT INTO audit_logs (incident_id, user_name, action, details)
      VALUES ($1, $2, 'UPDATE', $3)
    `, [req.params.id, 'Admin', JSON.stringify(req.body)]);
    
    // Emit WebSocket event
    io.emit('incident_updated', { id: parseInt(req.params.id) });
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error updating incident:", error);
    res.status(500).json({ error: "Failed to update incident" });
  }
});

// Get messages for an incident
app.get("/api/incidents/:id/messages", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        m.*,
        a.name_en as agency_name,
        a.name_ar as agency_name_ar,
        a.code as agency_code
      FROM messages m
      LEFT JOIN agencies a ON m.agency_id = a.id
      WHERE m.incident_id = $1
      ORDER BY m.created_at ASC
    `, [req.params.id]);
    
    const messages = result.rows.map(row => ({
      id: row.id,
      incidentId: row.incident_id,
      agencyId: row.agency_id,
      agencyName: row.agency_name,
      agencyNameAr: row.agency_name_ar,
      agencyCode: row.agency_code,
      senderType: row.sender_type,
      senderName: row.sender_name,
      content: row.content,
      isVoiceMessage: row.is_voice_message,
      voiceTranscript: row.voice_transcript,
      voiceAudioUrl: row.voice_audio_url,
      createdAt: row.created_at
    }));
    
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Create message
app.post("/api/incidents/:id/messages", async (req, res) => {
  try {
    const { content, senderType, senderName, isVoiceMessage, voiceTranscript, voiceAudioUrl, agencyId } = req.body;
    const incidentId = req.params.id;
    
    if (!content && !voiceTranscript) {
      return res.status(400).json({ error: "Message content or transcript required" });
    }
    
    const result = await pool.query(`
      INSERT INTO messages (incident_id, agency_id, sender_type, sender_name, content, is_voice_message, voice_transcript, voice_audio_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, created_at
    `, [incidentId, agencyId || null, senderType || 'USER', senderName || 'Crisis Management Center', content || '', isVoiceMessage || false, voiceTranscript || null, voiceAudioUrl || null]);
    
    const message = {
      id: result.rows[0].id,
      incidentId: parseInt(incidentId),
      agencyId,
      senderType: senderType || 'USER',
      senderName: senderName || 'Crisis Management Center',
      content: content || '',
      isVoiceMessage: isVoiceMessage || false,
      voiceTranscript: voiceTranscript || null,
      voiceAudioUrl: voiceAudioUrl || null,
      createdAt: result.rows[0].created_at
    };
    
    // Emit WebSocket event
    io.emit('message_created', { incidentId: parseInt(incidentId), message });
    
    res.status(201).json(message);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Failed to create message" });
  }
});

// AI Agency Response Simulation
app.post("/api/incidents/:id/ai-response", async (req, res) => {
  try {
    const { userMessage, incidentType, incidentDescription } = req.body;
    const incidentId = req.params.id;
    
    // Get agencies for this incident type
    const agenciesResult = await pool.query(`
      SELECT id, name_en, name_ar, code FROM agencies
      ORDER BY RANDOM()
      LIMIT 1
    `);
    
    if (agenciesResult.rows.length === 0) {
      return res.status(404).json({ error: "No agencies found" });
    }
    
    const agency = agenciesResult.rows[0];
    
    // Generate AI response
    let aiResponse = '';
    
    if (openai) {
      // Use OpenAI API if available
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are a ${agency.name_en} (${agency.name_ar}) responder in Jordan's Crisis Management System. Respond professionally and concisely in Arabic or English based on the context. Keep responses brief and operational.`
            },
            {
              role: "user",
              content: `Incident Type: ${incidentType || 'General'}\nIncident: ${incidentDescription || ''}\nUser Command: ${userMessage}\n\nRespond as ${agency.name_en}:`
            }
          ],
          max_tokens: 150,
          temperature: 0.7
        });
        aiResponse = completion.choices[0].message.content;
      } catch (aiError) {
        console.error("OpenAI API error:", aiError);
        // Fallback to simple response
        aiResponse = generateSimpleResponse(agency, userMessage, incidentType);
      }
    } else {
      // Simple fallback response generator
      aiResponse = generateSimpleResponse(agency, userMessage, incidentType);
    }
    
    // Save AI response as message
    const result = await pool.query(`
      INSERT INTO messages (incident_id, agency_id, sender_type, sender_name, content)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, created_at
    `, [incidentId, agency.id, 'AGENCY', agency.name_en, aiResponse]);
    
    const message = {
      id: result.rows[0].id,
      incidentId: parseInt(incidentId),
      agencyId: agency.id,
      agencyName: agency.name_en,
      agencyNameAr: agency.name_ar,
      agencyCode: agency.code,
      senderType: 'AGENCY',
      senderName: agency.name_en,
      content: aiResponse,
      isVoiceMessage: false,
      createdAt: result.rows[0].created_at
    };
    
    // Emit WebSocket event
    io.emit('message_created', { incidentId: parseInt(incidentId), message });
    
    res.json(message);
  } catch (error) {
    console.error("Error generating AI response:", error);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
});

// Simple response generator (fallback when OpenAI is not available)
function generateSimpleResponse(agency, userMessage, incidentType) {
  const responses = {
    'PSD': [
      `[${agency.name_ar}] تم استلام الأمر. نقوم بتوجيه دورية إلى الموقع الآن.`,
      `[${agency.name_ar}] We have dispatched units to the location. ETA: 10 minutes.`,
      `[${agency.name_ar}] Situation under control. Units on scene.`
    ],
    'CIVIL_DEFENSE': [
      `[${agency.name_ar}] تم إرسال فرق الإنقاذ والإسعاف.`,
      `[${agency.name_ar}] Rescue teams dispatched. Fire units en route.`,
      `[${agency.name_ar}] All units responding.`
    ],
    'MOH': [
      `[${agency.name_ar}] تم تنسيق مع المستشفيات. الأسرة متاحة.`,
      `[${agency.name_ar}] Coordinating with hospitals. Ambulances dispatched.`,
      `[${agency.name_ar}] Medical teams responding.`
    ],
    'MOPW': [
      `[${agency.name_ar}] تم إرسال فرق الصيانة لتقييم الأضرار.`,
      `[${agency.name_ar}] Maintenance teams dispatched. Assessing damage.`,
      `[${agency.name_ar}] Infrastructure assessment in progress.`
    ],
    'ARMED_FORCES': [
      `[${agency.name_ar}] القوات جاهزة للدعم حسب الحاجة.`,
      `[${agency.name_ar}] Forces on standby. Ready to assist.`,
      `[${agency.name_ar}] Units mobilized.`
    ],
    'GOV_HQ': [
      `[${agency.name_ar}] تم التنسيق مع الجهات المعنية.`,
      `[${agency.name_ar}] Coordinating with relevant authorities.`,
      `[${agency.name_ar}] Local coordination activated.`
    ]
  };
  
  const agencyResponses = responses[agency.code] || responses['PSD'];
  return agencyResponses[Math.floor(Math.random() * agencyResponses.length)];
}

// Get all agencies
app.get("/api/agencies", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name_en, name_ar, code FROM agencies ORDER BY name_en
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching agencies:", error);
    res.status(500).json({ error: "Failed to fetch agencies" });
  }
});

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
  
  socket.on("join_incident", (incidentId) => {
    socket.join(`incident_${incidentId}`);
  });
});

server.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
  console.log(`WebSocket server ready`);
});
