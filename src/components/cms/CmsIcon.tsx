import {
  Mail, Phone, Video, Smartphone, Heart, HeartHandshake, Users, Calendar, MapPin,
  BookOpen, Music, Gift, Star, Sun, Church, Coffee, MessageCircle, Headphones,
  PlayCircle, Mic, Baby, Sparkles, Globe, Bell, type LucideIcon,
} from "lucide-react";

/** The icon library offered in C3 Studio's icon picker. Keep this list in sync
 *  with the editor's ICON_LIBRARY (c3-backend) so names always resolve. */
export const CMS_ICONS: Record<string, LucideIcon> = {
  Mail, Phone, Video, Smartphone, Heart, HeartHandshake, Users, Calendar, MapPin,
  BookOpen, Music, Gift, Star, Sun, Church, Coffee, MessageCircle, Headphones,
  PlayCircle, Mic, Baby, Sparkles, Globe, Bell,
};

/** Render an icon by CMS name, falling back to a provided default component. */
export default function CmsIcon({
  name, fallback: Fallback, size = 24, strokeWidth = 1.75, style,
}: {
  name?: string; fallback: LucideIcon; size?: number; strokeWidth?: number; style?: React.CSSProperties;
}) {
  const Cmp = (name && CMS_ICONS[name]) || Fallback;
  return <Cmp size={size} strokeWidth={strokeWidth} style={style} />;
}
