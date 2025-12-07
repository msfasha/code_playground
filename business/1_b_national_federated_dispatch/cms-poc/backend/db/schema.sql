-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Agencies table
CREATE TABLE IF NOT EXISTS agencies (
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Jordanian agencies
INSERT INTO agencies (name_en, name_ar, code) VALUES
    ('Public Security Directorate', 'دائرة الأمن العام', 'PSD'),
    ('Civil Defense Directorate', 'الدفاع المدني', 'CIVIL_DEFENSE'),
    ('Ministry of Health', 'وزارة الصحة', 'MOH'),
    ('Ministry of Public Works', 'وزارة الأشغال العامة', 'MOPW'),
    ('Armed Forces', 'القوات المسلحة', 'ARMED_FORCES'),
    ('Governorate Headquarters', 'مقر المحافظة', 'GOV_HQ')
ON CONFLICT (code) DO NOTHING;

-- Incidents table
CREATE TABLE IF NOT EXISTS incidents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Reported',
    location GEOMETRY(POINT, 4326) NOT NULL,
    reporting_agency_id INTEGER REFERENCES agencies(id),
    reporting_user VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create spatial index on incidents location
CREATE INDEX IF NOT EXISTS idx_incidents_location ON incidents USING GIST(location);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    incident_id INTEGER REFERENCES incidents(id) ON DELETE CASCADE,
    agency_id INTEGER REFERENCES agencies(id),
    sender_type VARCHAR(50) NOT NULL, -- 'USER' or 'AGENCY'
    sender_name VARCHAR(255) NOT NULL,
    content TEXT,
    is_voice_message BOOLEAN DEFAULT FALSE,
    voice_transcript TEXT,
    voice_audio_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    incident_id INTEGER REFERENCES incidents(id) ON DELETE SET NULL,
    user_name VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Incident attachments table
CREATE TABLE IF NOT EXISTS incident_attachments (
    id SERIAL PRIMARY KEY,
    incident_id INTEGER REFERENCES incidents(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(100),
    file_size INTEGER,
    uploaded_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON incidents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


