import { Clock, Play, Pause, Rewind, FastForward } from 'lucide-react';

interface TimeMachineProps {
  timeFilter: number;
  onChange: (minutes: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

const TIME_RANGES = [
  { label: '15m', value: 15 },
  { label: '1h', value: 60 },
  { label: '6h', value: 360 },
  { label: '24h', value: 1440 },
  { label: 'All', value: 0 },
];

export function TimeMachine({ timeFilter, onChange, isPlaying, onTogglePlay }: TimeMachineProps) {
  const currentIndex = TIME_RANGES.findIndex((r) => r.value === timeFilter);
  const activeIndex = currentIndex === -1 ? 4 : currentIndex;

  return (
    <div className="pointer-events-auto w-full max-w-md rounded-xl border border-white/10 bg-[#0d1320]/90 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-semibold text-white">Time Machine</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onChange(TIME_RANGES[Math.max(0, activeIndex - 1)].value)}
            className="rounded p-1 text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <Rewind className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onTogglePlay}
            className="rounded bg-cyan-500/20 p-1.5 text-cyan-400 transition hover:bg-cyan-500/30"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={() => onChange(TIME_RANGES[Math.min(TIME_RANGES.length - 1, activeIndex + 1)].value)}
            className="rounded p-1 text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <FastForward className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex flex-1 items-center gap-1">
          {TIME_RANGES.map((range) => {
            const isActive = range.value === timeFilter;
            return (
              <button
                key={range.value}
                onClick={() => onChange(range.value)}
                className={`flex-1 rounded-md py-1 text-[10px] font-bold uppercase transition ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/40'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
