import {
  ArrowRight, BadgeCheck, Bell, CalendarDays, Check, ChevronRight, ClipboardCheck, Clock, Eye, FileCheck2, Flame,
  HandHeart, HeartHandshake, Landmark, LifeBuoy, Mail, MapPin, Megaphone, Phone, Scale, ShieldCheck, UserPlus, Users,
} from 'lucide-react';

// Thin outline icons (Lucide). Names are referenced from lib/site.js so content stays plain data.
const ICONS = {
  ArrowRight, BadgeCheck, Bell, CalendarDays, Check, ChevronRight, ClipboardCheck, Clock, Eye, FileCheck2, Flame,
  HandHeart, HeartHandshake, Landmark, LifeBuoy, Mail, MapPin, Megaphone, Phone, Scale, ShieldCheck, UserPlus, Users,
};

export default function Icon({ name, size = 22, className = 'icon', ...rest }) {
  const C = ICONS[name];
  return C ? <C size={size} strokeWidth={1.6} className={className} aria-hidden="true" {...rest} /> : null;
}
