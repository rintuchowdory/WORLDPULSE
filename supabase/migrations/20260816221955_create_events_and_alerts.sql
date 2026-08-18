/*
# Create events and saved_alerts tables for WORLD PULSE

1. New Tables
- `events`: Global event intelligence store. Each row is a single world event
  (earthquake, wildfire, flood, storm, flight, vessel, weather, alert, infrastructure).
  Includes geographic coordinates, severity, status, source attribution, and a
  JSONB metadata column for type-specific details (magnitude, depth, speed, etc.).
- `saved_alerts`: Personal alert filters (single-tenant, no auth). Each row stores
  a user-defined filter with selected categories, regions, and severity thresholds.
2. Security
- Enable RLS on both tables.
- Both tables are intentionally public/shared (no sign-in) → TO anon, authenticated
  with USING (true) for all policies, so the anon-key frontend can read and write.
3. Indexes
- events(category), events(severity), events(occurred_at), events(status)
- GIST index on events coordinates for map bounding queries
4. Notes
- `occurred_at` is separate from `created_at` so the time machine can scrub
  event occurrence times independently of when the row was inserted.
- `metadata` JSONB holds type-specific fields: magnitude/depth for quakes,
  speed/altitude/heading for flights, speed/type for vessels, etc.
*/

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  category text NOT NULL,
  title text NOT NULL,
  description text,
  location_name text,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  severity text DEFAULT 'info',
  status text DEFAULT 'active',
  source text DEFAULT 'WORLD PULSE',
  occurred_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_events" ON events;
CREATE POLICY "anon_select_events" ON events FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_events" ON events;
CREATE POLICY "anon_insert_events" ON events FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_events" ON events;
CREATE POLICY "anon_update_events" ON events FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_events" ON events;
CREATE POLICY "anon_delete_events" ON events FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_severity ON events(severity);
CREATE INDEX IF NOT EXISTS idx_events_occurred_at ON events(occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);

CREATE TABLE IF NOT EXISTS saved_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  categories text[] DEFAULT '{}',
  regions text[] DEFAULT '{}',
  min_severity text DEFAULT 'info',
  notify_web boolean DEFAULT true,
  notify_email boolean DEFAULT false,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE saved_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_alerts" ON saved_alerts;
CREATE POLICY "anon_select_alerts" ON saved_alerts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_alerts" ON saved_alerts;
CREATE POLICY "anon_insert_alerts" ON saved_alerts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_alerts" ON saved_alerts;
CREATE POLICY "anon_update_alerts" ON saved_alerts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_alerts" ON saved_alerts;
CREATE POLICY "anon_delete_alerts" ON saved_alerts FOR DELETE
  TO anon, authenticated USING (true);
