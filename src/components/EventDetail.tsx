import { X, ExternalLink, MapPin, Clock, Tag, Activity, Shield } from 'lucide-react';
import { EVENT_TYPES, SEVERITY_CONFIG } from '@/data/eventConfig';
import type { WorldEvent } from '@/types';
import { formatRelativeTime, formatUTCTime } from '@/lib/format';

interface EventDetailProps {
  event: WorldEvent | null;
  onClose: () => void;
}

export function EventDetail({ event, onClose }: EventDetailProps) {
  if (!event) return null;

  const def = EVENT_TYPES[event.type];
  const sev = SEVERITY_CONFIG[event.severity];
  const Icon = def.icon;

  const meta = event.metadata;
  const metaItems: { label: string; value: string | number }[] = [];

  // Type-specific metadata
  switch (event.type) {
    case 'earthquake':
      if (meta.magnitude) metaItems.push({ label: 'Magnitude', value: `M${meta.magnitude}` });
      if (meta.depth) metaItems.push({ label: 'Depth', value: `${meta.depth} km` });
      if (meta.magnitude_type) metaItems.push({ label: 'Type', value: meta.magnitude_type });
      break;
    case 'wildfire':
      if (meta.acres_burned) metaItems.push({ label: 'Area Burned', value: `${meta.acres_burned.toLocaleString()} acres` });
      if (meta.containment !== undefined) metaItems.push({ label: 'Containment', value: `${meta.containment}%` });
      if (meta.confidence) metaItems.push({ label: 'Confidence', value: `${meta.confidence}%` });
      break;
    case 'flood':
      if (meta.affected_people) metaItems.push({ label: 'Affected', value: meta.affected_people.toLocaleString() });
      if (meta.water_level) metaItems.push({ label: 'Water Level', value: `${meta.water_level} m` });
      break;
    case 'storm':
      if (meta.wind_speed) metaItems.push({ label: 'Wind Speed', value: `${meta.wind_speed} km/h` });
      if (meta.pressure) metaItems.push({ label: 'Pressure', value: `${meta.pressure} hPa` });
      if (meta.category) metaItems.push({ label: 'Category', value: meta.category });
      break;
    case 'volcano':
      if (meta.volcano_type) metaItems.push({ label: 'Type', value: meta.volcano_type });
      if (meta.alert_level) metaItems.push({ label: 'Alert Level', value: meta.alert_level });
      if (meta.ash_height) metaItems.push({ label: 'Ash Height', value: `${meta.ash_height} m` });
      break;
    case 'flight':
      if (meta.callsign) metaItems.push({ label: 'Callsign', value: meta.callsign });
      if (meta.aircraft) metaItems.push({ label: 'Aircraft', value: meta.aircraft });
      if (meta.origin) metaItems.push({ label: 'Origin', value: meta.origin });
      if (meta.destination) metaItems.push({ label: 'Destination', value: meta.destination });
      if (meta.altitude) metaItems.push({ label: 'Altitude', value: `${meta.altitude.toLocaleString()} ft` });
      if (meta.speed) metaItems.push({ label: 'Speed', value: `${meta.speed} kts` });
      if (meta.heading) metaItems.push({ label: 'Heading', value: `${meta.heading}°` });
      break;
    case 'vessel':
      if (meta.name) metaItems.push({ label: 'Name', value: meta.name });
      if (meta.type) metaItems.push({ label: 'Type', value: meta.type });
      if (meta.speed) metaItems.push({ label: 'Speed', value: `${meta.speed} kn` });
      if (meta.origin) metaItems.push({ label: 'Origin', value: meta.origin });
      if (meta.destination) metaItems.push({ label: 'Destination', value: meta.destination });
      if (meta.mmsi) metaItems.push({ label: 'MMSI', value: meta.mmsi });
      break;
    case 'weather':
      if (meta.condition) metaItems.push({ label: 'Condition', value: meta.condition });
      if (meta.temperature !== undefined) metaItems.push({ label: 'Temperature', value: `${meta.temperature}°C` });
      if (meta.humidity) metaItems.push({ label: 'Humidity', value: `${meta.humidity}%` });
      if (meta.snowfall) metaItems.push({ label: 'Snowfall', value: `${meta.snowfall} cm` });
      break;
    case 'alert':
      if (meta.alert_type) metaItems.push({ label: 'Alert Type', value: meta.alert_type });
      if (meta.expires_in_hours) metaItems.push({ label: 'Expires In', value: `${meta.expires_in_hours}h` });
      break;
    case 'infrastructure':
      if (meta.provider) metaItems.push({ label: 'Provider', value: meta.provider });
      if (meta.region) metaItems.push({ label: 'Region', value: meta.region });
      if (meta.status) metaItems.push({ label: 'Status', value: meta.status });
      break;
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto border-l border-white/10 bg-[#0d1320] shadow-2xl">
        {/* Header banner */}
        <div className="relative h-32 overflow-hidden">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(circle at 30% 50%, ${def.color}66, transparent 70%)`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0d1320]" />
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg border border-white/10 bg-black/30 p-1.5 text-gray-400 transition hover:bg-black/50 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-4 left-5 flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl shadow-lg"
              style={{ backgroundColor: `${def.color}33`, color: def.color, boxShadow: `0 0 20px ${def.color}44` }}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${sev.dot}`} />
                <span className={`text-xs font-bold uppercase tracking-wide ${sev.color}`}>
                  {sev.label}
                </span>
              </div>
              <p className="text-lg font-bold text-white">{def.label}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          <h2 className="text-xl font-bold leading-snug text-white">{event.title}</h2>
          {event.description && <p className="mt-2 text-sm leading-relaxed text-gray-400">{event.description}</p>}

          {/* Status badge */}
          <div className="mt-4 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                event.status === 'active' || event.status === 'confirmed' || event.status === 'warning'
                  ? 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30'
                  : 'bg-white/5 text-gray-400 ring-1 ring-white/10'
              }`}
            >
              <Activity className="h-3 w-3" />
              {event.status}
            </span>
          </div>

          {/* Location & time */}
          <div className="mt-5 space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
            {event.location_name && (
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-gray-500" />
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-gray-600">Location</p>
                  <p className="text-sm font-medium text-gray-200">{event.location_name}</p>
                  <p className="text-[11px] text-gray-600 tabular-nums">
                    {event.latitude.toFixed(4)}, {event.longitude.toFixed(4)}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 border-t border-white/5 pt-3">
              <Clock className="h-4 w-4 shrink-0 text-gray-500" />
              <div>
                <p className="text-[10px] uppercase tracking-wide text-gray-600">Occurred</p>
                <p className="text-sm font-medium text-gray-200">{formatRelativeTime(event.occurred_at)}</p>
                <p className="text-[11px] text-gray-600">{formatUTCTime(event.occurred_at)} UTC</p>
              </div>
            </div>
            <div className="flex items-center gap-3 border-t border-white/5 pt-3">
              <Tag className="h-4 w-4 shrink-0 text-gray-500" />
              <div>
                <p className="text-[10px] uppercase tracking-wide text-gray-600">Source</p>
                <p className="text-sm font-medium text-gray-200">{event.source}</p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          {metaItems.length > 0 && (
            <div className="mt-5">
              <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
                <Shield className="h-3.5 w-3.5" /> Event Details
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {metaItems.map((item) => (
                  <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wide text-gray-600">{item.label}</p>
                    <p className="text-sm font-bold text-white tabular-nums">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Origin / destination for transit */}
          {event.type === 'flight' && meta.origin && meta.destination && (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
              <span className="text-sm font-bold text-cyan-300">{meta.origin}</span>
              <div className="relative flex-1">
                <div className="h-px bg-gradient-to-r from-cyan-500/50 to-cyan-500/50" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Icon className="h-3.5 w-3.5 text-cyan-400" />
                </span>
              </div>
              <span className="text-sm font-bold text-cyan-300">{meta.destination}</span>
            </div>
          )}
          {event.type === 'vessel' && meta.origin && meta.destination && (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-teal-500/20 bg-teal-500/5 p-4">
              <span className="text-sm font-bold text-teal-300">{meta.origin}</span>
              <div className="relative flex-1">
                <div className="h-px bg-gradient-to-r from-teal-500/50 to-teal-500/50" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Icon className="h-3.5 w-3.5 text-teal-400" />
                </span>
              </div>
              <span className="text-sm font-bold text-teal-300">{meta.destination}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
