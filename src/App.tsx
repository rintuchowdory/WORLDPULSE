import { useState, useMemo, useCallback, useEffect } from 'react';
import { Header } from '@/components/Header';
import { WorldMap } from '@/components/WorldMap';
import { StatsBar } from '@/components/StatsBar';
import { EventFeed } from '@/components/EventFeed';
import { EventDetail } from '@/components/EventDetail';
import { LayerControl } from '@/components/LayerControl';
import { TimeMachine } from '@/components/TimeMachine';
import { SearchBar } from '@/components/SearchBar';
import { GlobalPulse } from '@/components/GlobalPulse';
import { useEvents, useFilteredEvents } from '@/hooks/useEvents';
import { EVENT_TYPES } from '@/data/eventConfig';
import type { EventType, Severity, WorldEvent } from '@/types';
import { Menu, X, ChevronUp } from 'lucide-react';

const ALL_TYPES = Object.keys(EVENT_TYPES) as EventType[];

export default function App() {
  const { events, loading, error } = useEvents();

  const [activeTypes, setActiveTypes] = useState<Set<EventType>>(new Set(ALL_TYPES));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<Severity | 'all'>('all');
  const [timeFilter, setTimeFilter] = useState(0); // 0 = all
  const [selectedEvent, setSelectedEvent] = useState<WorldEvent | null>(null);
  const [showLayers, setShowLayers] = useState(true);
  const [showMobileFeed, setShowMobileFeed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const filteredEvents = useFilteredEvents(events, {
    activeTypes,
    searchQuery,
    selectedSeverity,
    timeFilter,
  });

  const liveCount = useMemo(
    () => events.filter((e) => e.category === 'live').length,
    [events]
  );

  const toggleType = useCallback((type: EventType) => {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }, []);

  const handleAllLayers = useCallback(() => setActiveTypes(new Set(ALL_TYPES)), []);
  const handleNoLayers = useCallback(() => setActiveTypes(new Set()), []);

  // Time machine auto-play
  const playSteps = [1440, 360, 60, 15, 0];
  useEffect(() => {
    if (!isPlaying) return;
    let idx = playSteps.indexOf(timeFilter);
    if (idx === -1) idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % playSteps.length;
      setTimeFilter(playSteps[idx]);
    }, 2500);
    return () => clearInterval(interval);
  }, [isPlaying, timeFilter]);

  // Hide header on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY && currentY > 100) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(currentY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleSelectEvent = useCallback((event: WorldEvent) => {
    setSelectedEvent(event);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      {/* Header */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
        <Header liveCount={liveCount} />
      </div>

      {/* Main content */}
      <div className="pt-16">
        {/* Hero / Global Pulse summary */}
        <section className="py-8">
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
                <p className="text-sm text-gray-500">Loading global events...</p>
              </div>
            </div>
          ) : error ? (
            <div className="mx-auto max-w-2xl px-4">
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
                <p className="text-sm text-red-400">Unable to load events: {error}</p>
              </div>
            </div>
          ) : (
            <GlobalPulse events={filteredEvents} />
          )}
        </section>

        {/* Stats bar */}
        {!loading && !error && (
          <div className="sticky top-16 z-30 border-y border-white/10 bg-[#0a0e1a]/90 backdrop-blur-xl">
            <StatsBar events={events} />
          </div>
        )}

        {/* Main map + feed area */}
        {!loading && !error && (
          <div className="relative">
            {/* Search bar */}
            <div className="absolute left-4 top-4 z-20 w-full max-w-md px-1">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>

            {/* Severity filter pills */}
            <div className="absolute right-4 top-4 z-20 hidden items-center gap-1.5 sm:flex">
              <div className="pointer-events-auto flex items-center gap-1 rounded-lg border border-white/10 bg-[#0d1320]/90 px-2 py-1.5 backdrop-blur-xl">
                {(['all', 'critical', 'high', 'medium', 'low'] as const).map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setSelectedSeverity(sev)}
                    className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide transition ${
                      selectedSeverity === sev
                        ? 'bg-white/10 text-white ring-1 ring-white/20'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Map container */}
            <div className="relative h-[calc(100vh-16rem)] min-h-[500px] w-full">
              <WorldMap
                events={events}
                activeTypes={activeTypes}
                selectedEventId={selectedEvent?.id ?? null}
                onSelectEvent={handleSelectEvent}
                timeFilter={timeFilter}
              />

              {/* Layer control - top left below search */}
              <div className="absolute left-4 top-16 z-20">
                {showLayers && (
                  <div className="wp-fade-in">
                    <LayerControl
                      activeTypes={activeTypes}
                      onToggle={toggleType}
                      onAll={handleAllLayers}
                      onNone={handleNoLayers}
                    />
                  </div>
                )}
              </div>

              {/* Event feed - right side panel */}
              <div className="absolute right-0 top-0 z-10 hidden h-full w-80 border-l border-white/10 bg-[#0d1320]/80 backdrop-blur-xl lg:block">
                <EventFeed
                  events={filteredEvents}
                  selectedEventId={selectedEvent?.id ?? null}
                  onSelect={handleSelectEvent}
                />
              </div>

              {/* Time machine - bottom center */}
              <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 px-4 lg:left-1/2">
                <div className={`lg:mr-80 ${showMobileFeed ? 'hidden' : ''}`}>
                  <TimeMachine
                    timeFilter={timeFilter}
                    onChange={setTimeFilter}
                    isPlaying={isPlaying}
                    onTogglePlay={() => setIsPlaying((p) => !p)}
                  />
                </div>
              </div>

              {/* Mobile feed toggle */}
              <button
                onClick={() => setShowMobileFeed(true)}
                className="absolute bottom-4 right-4 z-20 flex items-center gap-2 rounded-lg border border-white/10 bg-[#0d1320] px-4 py-2 text-sm font-semibold text-white shadow-lg lg:hidden"
              >
                <Menu className="h-4 w-4" />
                Feed ({filteredEvents.length})
              </button>

              {/* Mobile feed overlay */}
              {showMobileFeed && (
                <div className="absolute inset-0 z-30 lg:hidden">
                  <div className="absolute right-0 top-0 h-full w-full max-w-sm border-l border-white/10 bg-[#0d1320]">
                    <button
                      onClick={() => setShowMobileFeed(false)}
                      className="absolute left-4 top-4 z-10 rounded-lg border border-white/10 bg-white/5 p-1.5 text-gray-400"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <EventFeed
                      events={filteredEvents}
                      selectedEventId={selectedEvent?.id ?? null}
                      onSelect={(e) => {
                        handleSelectEvent(e);
                        setShowMobileFeed(false);
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Loading overlay */}
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0a0e1a]/50">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Scroll to top / hide header hint */}
        <div className="h-24" />
      </div>

      {/* Event detail drawer */}
      <EventDetail event={selectedEvent} onClose={() => setSelectedEvent(null)} />

      {/* Footer */}
      <footer className="border-t border-white/10 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 text-center">
          <p className="text-sm font-bold tracking-wider text-white">
            WORLD<span className="text-cyan-400">PULSE</span>
          </p>
          <p className="text-xs text-gray-500">
            Global Event Intelligence Platform · See what's happening around the world.
          </p>
          <p className="text-[10px] text-gray-600">
            Demo data for prototype · Sources: USGS, NASA FIRMS, NOAA, GDACS, ADS-B, AIS
          </p>
        </div>
      </footer>
    </div>
  );
}
