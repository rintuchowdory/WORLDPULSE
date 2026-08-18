import {
  Waves,
  Flame,
  Droplets,
  CloudLightning,
  Mountain,
  Plane,
  Ship,
  CloudRain,
  Siren,
  Server,
  type LucideIcon,
} from 'lucide-react';
import type { EventType, Severity, EventCategory } from '@/types';

interface EventTypeDef {
  label: string;
  icon: LucideIcon;
  color: string;
  glow: string;
  category: EventCategory;
  ringColor: string;
  bgColor: string;
  textColor: string;
}

export const EVENT_TYPES: Record<EventType, EventTypeDef> = {
  earthquake: {
    label: 'Earthquake',
    icon: Waves,
    color: '#f97316',
    glow: 'shadow-orange-500/50',
    category: 'disaster',
    ringColor: 'ring-orange-400',
    bgColor: 'bg-orange-500',
    textColor: 'text-orange-400',
  },
  wildfire: {
    label: 'Wildfire',
    icon: Flame,
    color: '#ef4444',
    glow: 'shadow-red-500/50',
    category: 'disaster',
    ringColor: 'ring-red-400',
    bgColor: 'bg-red-500',
    textColor: 'text-red-400',
  },
  flood: {
    label: 'Flood',
    icon: Droplets,
    color: '#3b82f6',
    glow: 'shadow-blue-500/50',
    category: 'disaster',
    ringColor: 'ring-blue-400',
    bgColor: 'bg-blue-500',
    textColor: 'text-blue-400',
  },
  storm: {
    label: 'Storm',
    icon: CloudLightning,
    color: '#a855f7',
    glow: 'shadow-purple-500/50',
    category: 'disaster',
    ringColor: 'ring-purple-400',
    bgColor: 'bg-purple-500',
    textColor: 'text-purple-400',
  },
  volcano: {
    label: 'Volcano',
    icon: Mountain,
    color: '#dc2626',
    glow: 'shadow-red-600/50',
    category: 'disaster',
    ringColor: 'ring-red-500',
    bgColor: 'bg-red-600',
    textColor: 'text-red-500',
  },
  flight: {
    label: 'Flight',
    icon: Plane,
    color: '#06b6d4',
    glow: 'shadow-cyan-500/50',
    category: 'live',
    ringColor: 'ring-cyan-400',
    bgColor: 'bg-cyan-500',
    textColor: 'text-cyan-400',
  },
  vessel: {
    label: 'Vessel',
    icon: Ship,
    color: '#14b8a6',
    glow: 'shadow-teal-500/50',
    category: 'live',
    ringColor: 'ring-teal-400',
    bgColor: 'bg-teal-500',
    textColor: 'text-teal-400',
  },
  weather: {
    label: 'Weather',
    icon: CloudRain,
    color: '#6366f1',
    glow: 'shadow-indigo-500/50',
    category: 'weather',
    ringColor: 'ring-indigo-400',
    bgColor: 'bg-indigo-500',
    textColor: 'text-indigo-400',
  },
  alert: {
    label: 'Alert',
    icon: Siren,
    color: '#f59e0b',
    glow: 'shadow-amber-500/50',
    category: 'alert',
    ringColor: 'ring-amber-400',
    bgColor: 'bg-amber-500',
    textColor: 'text-amber-400',
  },
  infrastructure: {
    label: 'Infrastructure',
    icon: Server,
    color: '#22c55e',
    glow: 'shadow-green-500/50',
    category: 'infrastructure',
    ringColor: 'ring-green-400',
    bgColor: 'bg-green-500',
    textColor: 'text-green-400',
  },
};

export const SEVERITY_CONFIG: Record<Severity, { label: string; color: string; dot: string }> = {
  critical: { label: 'Critical', color: 'text-red-400', dot: 'bg-red-500' },
  high: { label: 'High', color: 'text-orange-400', dot: 'bg-orange-500' },
  medium: { label: 'Medium', color: 'text-yellow-400', dot: 'bg-yellow-500' },
  low: { label: 'Low', color: 'text-blue-400', dot: 'bg-blue-500' },
  info: { label: 'Info', color: 'text-cyan-400', dot: 'bg-cyan-500' },
};

export const SEVERITY_ORDER: Severity[] = ['critical', 'high', 'medium', 'low', 'info'];

export const CATEGORY_GROUPS: { id: EventCategory; label: string; types: EventType[] }[] = [
  { id: 'disaster', label: 'Disasters', types: ['earthquake', 'wildfire', 'flood', 'storm', 'volcano'] },
  { id: 'live', label: 'Live Tracking', types: ['flight', 'vessel'] },
  { id: 'weather', label: 'Weather', types: ['weather'] },
  { id: 'alert', label: 'Alerts', types: ['alert'] },
  { id: 'infrastructure', label: 'Infrastructure', types: ['infrastructure'] },
];
