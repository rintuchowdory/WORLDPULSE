export type EventType =
  | 'earthquake'
  | 'wildfire'
  | 'flood'
  | 'storm'
  | 'volcano'
  | 'flight'
  | 'vessel'
  | 'weather'
  | 'alert'
  | 'infrastructure';

export type EventCategory = 'disaster' | 'live' | 'weather' | 'alert' | 'infrastructure';

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type EventStatus =
  | 'active'
  | 'confirmed'
  | 'warning'
  | 'advisory'
  | 'normal'
  | 'degraded';

export interface EventMetadata {
  magnitude?: number;
  depth?: number;
  magnitude_type?: string;
  acres_burned?: number;
  containment?: number;
  confidence?: number;
  affected_people?: number;
  water_level?: number;
  wind_speed?: number;
  pressure?: number;
  category?: string;
  volcano_type?: string;
  alert_level?: string;
  ash_height?: number;
  callsign?: string;
  aircraft?: string;
  origin?: string;
  destination?: string;
  altitude?: number;
  speed?: number;
  heading?: number;
  name?: string;
  type?: string;
  mmsi?: number;
  temperature?: number;
  condition?: string;
  humidity?: number;
  snowfall?: number;
  alert_type?: string;
  expires_in_hours?: number;
  provider?: string;
  region?: string;
  status?: string;
}

export interface WorldEvent {
  id: string;
  type: EventType;
  category: EventCategory;
  title: string;
  description: string | null;
  location_name: string | null;
  latitude: number;
  longitude: number;
  severity: Severity;
  status: EventStatus;
  source: string | null;
  occurred_at: string;
  created_at: string;
  metadata: EventMetadata;
}

export interface SavedAlert {
  id: string;
  name: string;
  categories: string[];
  regions: string[];
  min_severity: Severity;
  notify_web: boolean;
  notify_email: boolean;
  active: boolean;
  created_at: string;
}
