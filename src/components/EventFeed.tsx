import { useEffect, useRef } from 'react';
import { EVENT_TYPES, SEVERITY_CONFIG } from '@/data/eventConfig';
import type { WorldEvent } from '@/types';
import { formatRelativeTime } from '@/lib/format';

interface EventFeedProps {
  events: WorldEvent[];
  selectedEventId: string | null;
  onSelect: (event: WorldEvent) => void;
}

export function EventFeed({ events, selectedEventId, onSelect }: EventFeedProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const previousCount = useRef(0);

  // Auto-scroll to top when new events arrive
  useEffect(() => {
    if (events.length > previousCount.current && listRef.current) {
      listRef.current.scrollTop = 0;
    }
    previousCount.current = events.length;
  }, [events.length]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
          </span>
          <h3 className="text-sm font-bold text-white">Live Event Feed</h3>
        </div>
        <span className="text-xs font-semibold text-gray-500 tabular-nums">{events.length}</span>
      </div>
      <div ref={listRef} className="flex-1 overflow-y-auto">
        {events.length === 0 ? (
          <div className="flex h-full items-center justify-center p-8 text-center">
            <p className="text-sm text-gray-500">No events match your current filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {events.map((event) => {
              const def = EVENT_TYPES[event.type];
              const sev = SEVERITY_CONFIG[event.severity];
              const Icon = def.icon;
              const isSelected = event.id === selectedEventId;

              return (
                <button
                  key={event.id}
                  onClick={() => onSelect(event)}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left transition ${
                    isSelected ? 'bg-cyan-500/10 ring-1 ring-inset ring-cyan-500/30' : 'hover:bg-white/[0.03]'
                  }`}
                >
                  <div
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${def.color}22`, color: def.color }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${sev.dot}`} />
                      <p className="truncate text-xs font-semibold text-white">{event.title}</p>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-[11px] text-gray-500">
                      <span className={`font-medium ${def.textColor}`}>{def.label}</span>
                      {event.location_name && (
                        <>
                          <span>·</span>
                          <span className="truncate">{event.location_name}</span>
                        </>
                      )}
                    </div>
                    <div className="mt-0.5 text-[10px] text-gray-600">
                      {formatRelativeTime(event.occurred_at)} · {event.source}
                    </div>
                  </div>
                  {event.category === 'live' && (
                    <span className="mt-0.5 flex shrink-0 items-center gap-1 text-[9px] font-bold uppercase text-emerald-400">
                      <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                      Live
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
