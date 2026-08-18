import { Sparkles, TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import type { WorldEvent } from '@/types';
import { EVENT_TYPES } from '@/data/eventConfig';
import type { EventType } from '@/types';

interface GlobalPulseProps {
  events: WorldEvent[];
}

export function GlobalPulse({ events }: GlobalPulseProps) {
  // Generate a summary based on event data
  const summary = generateSummary(events);
  const topCategory = summary.topCategories[0];
  const topCategoryDef = topCategory ? EVENT_TYPES[topCategory.type as EventType] : null;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0d1320] via-[#0d1320] to-[#101a2e] p-6">
        {/* Background glow */}
        <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">AI Global Pulse</span>
            <span className="rounded-full bg-white/5 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide text-gray-500">
              Auto-generated
            </span>
          </div>

          <h2 className="mt-3 text-xl font-bold leading-snug text-white sm:text-2xl">
            {summary.headline}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-400">{summary.body}</p>

          {/* Quick stats */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              icon={<Activity className="h-3.5 w-3.5" />}
              label="Total Events"
              value={summary.total}
              color="text-cyan-400"
            />
            <StatCard
              icon={<AlertTriangle className="h-3.5 w-3.5" />}
              label="Critical"
              value={summary.critical}
              color="text-red-400"
            />
            <StatCard
              icon={<TrendingUp className="h-3.5 w-3.5" />}
              label="Most Active"
              value={topCategoryDef?.label ?? '—'}
              color={topCategoryDef?.textColor ?? 'text-gray-400'}
            />
            <StatCard
              icon={<Activity className="h-3.5 w-3.5" />}
              label="Live Tracking"
              value={summary.liveCount}
              color="text-emerald-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
      <div className={`flex items-center gap-1.5 ${color}`}>
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-1 text-lg font-bold text-white tabular-nums">{value}</p>
    </div>
  );
}

function generateSummary(events: WorldEvent[]) {
  const total = events.length;
  const critical = events.filter((e) => e.severity === 'critical' || e.severity === 'high').length;
  const liveCount = events.filter((e) => e.category === 'live').length;

  const typeCounts = new Map<string, number>();
  events.forEach((e) => typeCounts.set(e.type, (typeCounts.get(e.type) ?? 0) + 1));
  const topCategories = [...typeCounts.entries()]
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  const quakes = events.filter((e) => e.type === 'earthquake');
  const fires = events.filter((e) => e.type === 'wildfire');
  const storms = events.filter((e) => e.type === 'storm');
  const alerts = events.filter((e) => e.type === 'alert');

  const parts: string[] = [];
  if (quakes.length > 0) {
    const biggest = quakes.reduce((a, b) =>
      (a.metadata.magnitude ?? 0) > (b.metadata.magnitude ?? 0) ? a : b
    );
    parts.push(
      `${quakes.length} earthquake${quakes.length > 1 ? 's' : ''} recorded, with the strongest a M${biggest.metadata.magnitude} event near ${biggest.location_name}`
    );
  }
  if (fires.length > 0) {
    parts.push(`${fires.length} active wildfire${fires.length > 1 ? 's' : ''} burning across ${fires.map((f) => f.location_name).filter(Boolean).join(', ')}`);
  }
  if (storms.length > 0) {
    parts.push(`${storms.length} storm system${storms.length > 1 ? 's' : ''} being monitored`);
  }
  if (alerts.length > 0) {
    parts.push(`${alerts.length} official alert${alerts.length > 1 ? 's' : ''} issued by authorities`);
  }

  const body = parts.length > 0
    ? parts.join('. ') + '. ' + `${liveCount} flights and vessels currently tracked in real time.`
    : 'No significant events detected in the current time window. The platform is monitoring global data sources continuously.';

  const headline = critical > 5
    ? 'Elevated global event activity detected'
    : critical > 0
      ? 'Moderate event activity across multiple regions'
      : 'Global event activity is stable';

  return { headline, body, total, critical, liveCount, topCategories };
}
