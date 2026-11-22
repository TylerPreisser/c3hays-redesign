import { pickProps } from "@/lib/pick-attr";
import type { StudioEvent } from "@/lib/studio-events";

const fmt = (e: StudioEvent) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/.exec(e.start);
  if (!m) return "";
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), Number(m[4] ?? 0), Number(m[5] ?? 0));
  const day = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(d);
  if (e.allDay || m[4] === undefined) return day;
  return `${day}, ${new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(d)}`;
};

/** Studio's upcoming events as a plain list. Only rendered behind EVENTS_FROM_STUDIO. */
export default function StudioEventsList({ events, edit = false }: { events: StudioEvent[]; edit?: boolean }) {
  if (events.length === 0) return <p {...pickProps(edit, "fact:events")} className="body-base" style={{ color: "rgba(255,255,255,0.78)", textAlign: "center" }}>Nothing is scheduled right now. Check back soon.</p>;
  return (
    <ul {...pickProps(edit, "fact:events")} style={{ listStyle: "none", padding: 0, margin: "0 auto", maxWidth: "48rem", display: "grid", gap: "1rem" }}>
      {events.map((e) => (
        <li key={e.id} style={{ background: "#252727", borderRadius: "var(--radius-md)", padding: "1.25rem 1.5rem", border: "1px solid rgba(255,255,255,0.10)" }}>
          <p className="body-sm" style={{ color: "#1cc3af", fontWeight: 700, margin: 0 }}>{fmt(e)}</p>
          <h3 className="heading-3" style={{ color: "#fff", margin: "0.25rem 0 0" }}>{e.title}</h3>
          {e.location && <p className="body-sm" style={{ color: "rgba(255,255,255,0.72)", margin: "0.25rem 0 0" }}>{e.location}</p>}
        </li>
      ))}
    </ul>
  );
}
