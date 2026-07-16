import Image from "next/image";
import { tx, imgCss, type ImgStyle } from "@/lib/home-content";
import { assetPath } from "@/lib/asset-path";
import type { StaffMember } from "@/data/staff";

/**
 * <StaffCard> — Phase 4, Wave 2A (§3.2). A premium, reusable headshot portrait card.
 *
 * Replaces the old teal monogram circles that read as unfinished. A rounded-rect
 * 4:5 portrait (`object-fit: cover`) with a soft border + hover bloom, then the
 * name (`heading-3`) and a teal role line beneath. On hover the photo eases in and
 * the frame lifts — restrained, not tacky.
 *
 * Photos stay swappable: the portrait is a `data-cms-img` region whose src defaults
 * to the person's real headshot (`member.image`) but can be overridden per-card via
 * the `about-staff.<id>-photo-src` text field, with focal framing via `img`. If no
 * image resolves, an elegant monogram keeps the card from ever looking broken.
 *
 * Server component (CSS-only hover).
 */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function StaffCard({
  member,
  text,
  img,
  priority = false,
}: {
  member: StaffMember;
  text?: Record<string, string>;
  img?: Record<string, ImgStyle>;
  /** Eager-load the first row so the fold has no pop-in. */
  priority?: boolean;
}) {
  const key = `about-staff.${member.id}`;
  const src = tx(text, `${key}-photo-src`, member.image ?? "");

  return (
    <figure className="group flex flex-col">
      {/* Portrait */}
      <div
        data-cms-img={`${key}-photo`}
        className="relative w-full overflow-hidden transition-shadow duration-500 group-hover:shadow-[var(--shadow-hover)]"
        style={{
          aspectRatio: "4 / 5",
          borderRadius: "1.25rem",
          background: "linear-gradient(155deg, #23514b 0%, #1b1c1c 100%)",
          border: "1px solid rgba(27,28,28,0.08)",
          boxShadow: "var(--shadow-rest)",
        }}
      >
        {src ? (
          <Image
            src={assetPath(src)}
            alt={member.name}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 300px"
            className="object-cover object-top transition-transform duration-[600ms] ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            style={imgCss(img?.[`${key}-photo`])}
            priority={priority}
          />
        ) : (
          <span
            aria-hidden="true"
            className="absolute inset-0 grid place-items-center"
            style={{
              color: "#1cc3af",
              fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              letterSpacing: "0.04em",
            }}
          >
            {initials(member.name)}
          </span>
        )}
      </div>

      {/* Name + role */}
      <figcaption style={{ marginTop: "var(--space-body)" }}>
        <span
          className="block heading-3"
          style={{ color: "var(--color-ink)", fontSize: "1.125rem" }}
          data-cms={`t:${key}-name`}
          dangerouslySetInnerHTML={{ __html: tx(text, `${key}-name`, member.name) }}
        />
        <span
          className="block"
          style={{
            marginTop: "0.4rem",
            color: "var(--color-teal-deep)",
            fontSize: "0.875rem",
            fontWeight: 600,
            letterSpacing: "0.005em",
          }}
          data-cms={`t:${key}-role`}
          dangerouslySetInnerHTML={{ __html: tx(text, `${key}-role`, member.role) }}
        />
      </figcaption>
    </figure>
  );
}
