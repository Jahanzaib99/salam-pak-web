import {
  BarChart3,
  CalendarDays,
  FileText,
  Newspaper,
  BookOpen,
  Map,
  BadgeCheck,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/lib/publications";

export const iconMap: Record<IconName, LucideIcon> = {
  barometer: BarChart3,
  calendar: CalendarDays,
  leaflet: FileText,
  newsletter: Newspaper,
  book: BookOpen,
  map: Map,
  standard: BadgeCheck,
};
