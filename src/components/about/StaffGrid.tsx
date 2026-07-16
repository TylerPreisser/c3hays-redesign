import { tx, type ImgStyle } from "@/lib/home-content";
import Section from "@/components/ui/Section";
import SectionHeader from "@/components/ui/SectionHeader";
import StaffCard from "@/components/about/StaffCard";
import { staffGroups } from "@/data/staff";

/**
 * About → "Meet Our Leadership" — REDESIGNED (Phase 4, Wave 2A / A3).
 *
 * The real celebratejesus.org leadership roster (14 people, grouped exactly as the
 * live site: Elder Staff → Hays Campus Staff → Colby Campus Staff). The old grid
 * rendered teal monogram initials and ignored the real headshots; this shows the
 * actual portraits via the reusable <StaffCard> (`/public/images/staff/<id>.webp`,
 * wired through `data/staff.ts`), with premium spacing built on the Wave-0 primitives.
 *
 * Photos remain fully swappable through each card's `data-cms-img` hook, so C3 Studio
 * can drop in a new headshot without touching code. Names + titles only — the real
 * site carries no bios, so none are invented.
 */
export default function StaffGrid({
  text,
  img,
}: {
  text?: Record<string, string>;
  img?: Record<string, ImgStyle>;
}) {
  return (
    <Section tone="white" container>
      {/* Intro */}
      <SectionHeader
        className="max-w-2xl"
        style={{ marginBottom: "var(--space-block)" }}
        eyebrow={
          <span
            data-cms="t:about-staff-eyebrow"
            dangerouslySetInnerHTML={{
              __html: tx(text, "about-staff-eyebrow", "Here to serve you"),
            }}
          />
        }
        title={
          <span
            data-cms="t:about-staff-title"
            dangerouslySetInnerHTML={{
              __html: tx(text, "about-staff-title", "Meet Our Leadership"),
            }}
          />
        }
        lead={
          <span
            data-cms="t:about-staff-blurb"
            dangerouslySetInnerHTML={{
              __html: tx(
                text,
                "about-staff-blurb",
                "Say hi to the staff of Celebration Community Church — a team here to help you take your next step."
              ),
            }}
          />
        }
      />

      {/* Grouped roster */}
      <div className="flex flex-col" style={{ gap: "var(--space-block)" }}>
        {staffGroups.map((group, gi) => (
          <div key={group.id}>
            {/* Group label + hairline */}
            <div
              className="flex items-center gap-5"
              style={{ marginBottom: "clamp(1.75rem, 3vw, 2.75rem)" }}
            >
              <h3
                className="uppercase"
                style={{
                  color: "var(--color-ink)",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  whiteSpace: "nowrap",
                }}
                data-cms={`t:about-staff-group-${group.id}`}
                dangerouslySetInnerHTML={{
                  __html: tx(text, `about-staff-group-${group.id}`, group.label),
                }}
              />
              <span
                aria-hidden="true"
                style={{ flex: 1, height: 1, background: "rgba(27,28,28,0.12)" }}
              />
            </div>

            {/* Portrait grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 lg:gap-x-8 gap-y-10 lg:gap-y-14">
              {group.members.map((m, mi) => (
                <StaffCard
                  key={m.id}
                  member={m}
                  text={text}
                  img={img}
                  priority={gi === 0 && mi < 2}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
