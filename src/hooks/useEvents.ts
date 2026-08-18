import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { WorldEvent, EventType, Severity } from '@/types';

export function useEvents() {
  const [events, setEvents] = useState<WorldEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    const { data, error: err } = await supabase
      .from('events')
      .select('*')
      .order('occurred_at', { ascending: false });

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    setEvents((data ?? []) as WorldEvent[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEvents();

    const channel = supabase
      .channel('events-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
        fetchEvents();
      })
      .subscribe();

    // Poll every 30 seconds for freshness
    const interval = setInterval(fetchEvents, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [fetchEvents]);

  return { events, loading, error, refetch: fetchEvents };
}

export function useFilteredEvents(
  events: WorldEvent[],
  filters: {
    activeTypes: Set<EventType>;
    searchQuery: string;
    selectedSeverity: Severity | 'all';
    timeFilter: number;
  }
) {
  return events.filter((event) => {
    if (!filters.activeTypes.has(event.type)) return false;
    if (filters.selectedSeverity !== 'all' && event.severity !== filters.selectedSeverity) return false;
    if (filters.timeFilter > 0) {
      const cutoff = Date.now() - filters.timeFilter * 60 * 1000;
      if (new Date(event.occurred_at).getTime() < cutoff) return false;
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const matches =
        event.title.toLowerCase().includes(q) ||
        (event.location_name?.toLowerCase().includes(q) ?? false) ||
        event.type.toLowerCase().includes(q) ||
        (event.description?.toLowerCase().includes(q) ?? false);
      if (!matches) return false;
    }
    return true;
  });
}
