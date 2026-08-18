import { EVENT_TYPES, CATEGORY_GROUPS } from '@/data/eventConfig';
import type { EventType } from '@/types';

interface LayerControlProps {
  activeTypes: Set<EventType>;
  onToggle: (type: EventType) => void;
  onAll: () => void;
  onNone: () => void;
}

export function LayerControl({ activeTypes, onToggle, onAll, onNone }: LayerControlProps) {
  return (
    <div className="pointer-events-auto w-64 rounded-xl border border-white/10 bg-[#0d1320]/90 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <h3 className="text-sm font-semibold text-white">Map Layers</h3>
        <div className="flex gap-1.5">
          <button
            onClick={onAll}
            className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-cyan-400 transition hover:bg-cyan-500/10"
          >
            All
          </button>
          <button
            onClick={onNone}
            className="rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500 transition hover:bg-white/5"
          >
            None
          </button>
        </div>
      </div>
      <div className="max-h-[400px] overflow-y-auto px-2 py-2">
        {CATEGORY_GROUPS.map((group) => (
          <div key={group.id} className="mb-2 last:mb-0">
            <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-gray-600">
              {group.label}
            </p>
            {group.types.map((type) => {
              const def = EVENT_TYPES[type];
              const Icon = def.icon;
              const active = activeTypes.has(type);
              return (
                <button
                  key={type}
                  onClick={() => onToggle(type)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 transition hover:bg-white/5"
                >
                  <div className={`flex h-4 w-4 items-center justify-center rounded ${active ? def.bgColor : 'bg-white/10'}`}>
                    {active && <span className="text-[10px] text-white">✓</span>}
                  </div>
                  <Icon className={`h-3.5 w-3.5 ${active ? def.textColor : 'text-gray-600'}`} />
                  <span className={`text-xs font-medium ${active ? 'text-gray-200' : 'text-gray-500'}`}>
                    {def.label}
                  </span>
                  <span
                    className="ml-auto h-2 w-2 rounded-full"
                    style={{ backgroundColor: active ? def.color : 'transparent', border: active ? 'none' : '1px solid #374151' }}
                  />
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
