import { EVENT_TYPES } from '@/data/eventConfig';
import type { EventType, WorldEvent } from '@/types';

interface StatsBarProps {
  events: WorldEvent[];
}

export function StatsBar({ events }: StatsBarProps) {
  const types = Object.keys(EVENT_TYPES) as EventType[];
  const counts = types.map((type) => ({
    type,
    count: events.filter((e) => e.type === type).length,
    def: EVENT_TYPES[type],
  }));

  return (
    <div className="flex items-center gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
      {counts.map(({ type, count, def }) => {
        const Icon = def.icon;
        const isLive = def.category === 'live';
        return (
          <div
            key={type}
            className="flex min-w-[110px] flex-col gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 transition hover:bg-white/[0.06]"
          >
            <div className="flex items-center gap-2">
              <Icon className={`h-4 w-4 ${def.textColor}`} />
              <span className="text-xs font-medium text-gray-400">{def.label}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold text-white tabular-nums">{count}</span>
              {isLive && count > 0 && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
                  <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  LIVE
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
