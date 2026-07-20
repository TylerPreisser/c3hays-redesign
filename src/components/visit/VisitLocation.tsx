import { MapPin, Navigation } from "lucide-react";
import { locations } from "@/data/locations";
import { Tx } from "@/components/cms/Editable";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";

/**
 * <VisitLocation> — the /visit "Find us" section (data-section="visit-location").
 *
 * A lean locations block: for each campus, name + address + a single editable
 * "Get Directions" link (Phase-4: JUST Directions — no campus-info / details filler).
 * Each card carries its OWN data-cms-bg and every string routes through <Tx>; the
 * Directions link is a data-cms-link with the required label span. Server component.
 */
export default function VisitLocation({ t }: { t: Record<string, string> }) {
  return (
    <Section
      container
      style={{ backgroundColor: "var(--color-paper)", color: "var(--color-ink-warm)" }}
      bgKey="visit-location-bg"
    >
      <SectionHeader
        eyebrow={<Tx text={t} k="visit-location-eyebrow" fallback="Find us" />}
        title={<Tx text={t} k="visit-location-heading" fallback="Get directions" />}
        lead={
          <Tx
            text={t}
            k="visit-location-lead"
            fallback="Two campuses across northwest Kansas. Pick the one closest to you and we&rsquo;ll see you this weekend."
          />
        }
        style={{ marginBottom: "var(--space-block)" }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 items-stretch">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="flex flex-col h-full"
            data-cms-bg={`visit-location-${loc.id}`}
            style={{
              background: "var(--color-paper-soft)",
              border: "1px solid var(--color-clay-line)",
              borderRadius: "var(--radius-md)",
              padding: "clamp(1.75rem, 3vw, 2.5rem)",
              boxShadow: "var(--shadow-rest)",
            }}
          >
            <Tx
              text={t}
              k={`visit-location-${loc.id}-name`}
              fallback={`${loc.name} Campus`}
              as="h3"
              className="heading-3"
              style={{ color: "var(--color-ink-warm)", marginBottom: "1rem" }}
            />
            <div className="flex items-start gap-3">
              <MapPin size={16} style={{ color: "var(--color-teal-deep)", marginTop: 3 }} className="shrink-0" />
              <Tx
                text={t}
                k={`visit-location-${loc.id}-address`}
                fallback={`${loc.street}, ${loc.city}, ${loc.state} ${loc.zip}`}
                as="address"
                className="not-italic body-base"
                style={{ color: "var(--color-stone)", lineHeight: 1.7 }}
              />
            </div>
            <div style={{ flex: 1, minHeight: "var(--space-cta)" }} />
            <a
              href={t[`visit-location-${loc.id}-dir-href`] || loc.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cms-link={`visit-location-${loc.id}-dir`}
              className="btn btn-primary btn-sm inline-flex items-center gap-1.5 self-start"
            >
              <Navigation size={14} />
              <span data-cms-link-label>{t[`visit-location-${loc.id}-dir-label`] || "Get Directions"}</span>
            </a>
          </div>
        ))}
      </div>
    </Section>
  );
}
