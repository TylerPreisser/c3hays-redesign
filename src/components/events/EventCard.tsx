import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { assetPath } from "@/lib/asset-path";

/**
 * <EventCard> — Phase 4, Wave 2F primitive (§3.5, EV1).
 *
 * Premium, image-topped event card. Replaces EventsStrip's image-less
 * colored-number tiles: a real photo per event with a floating date chip, then
 * title / detail / campus tag on a contained ink surface.
 *
 *   <EventCard
 *     image="/images/worship.webp" imageAlt="Baptism Sunday"
 *     month="JUL" day="20"
 *     title="Baptism Sunday" detail="Both services · Take your next step"
 *     campus="Both campuses" href="/connect/" />
 *
 * Contained + EQUAL-HEIGHT: the card is a flex column, the body flexes to fill,
 * so a grid row (`align-items: stretch`) makes every card the same height. Hover
 * bloom via `.bento-tile` (`--shadow-rest` → `--shadow-hover`).
 *
 * Graceful image fallback: when `image` is absent OR nothing is passed, the media
 * area paints a tasteful teal→ink gradient (NEVER an empty grey box). The date
 * chip floats over whichever surface renders.
 *
 * `title` / `detail` / `campus` accept ReactNode so a page can pass a node
 * carrying its own `data-cms` editor hook + `dangerouslySetInnerHTML`.
 *
 * Server component (CSS-only hover). The whole card is a link when `href` is set.
 */
export interface EventCardProps {
  title: ReactNode;
  /** Month label for the date chip, e.g. "JUL". */
  month: ReactNode;
  /** Day number for the date chip, e.g. "20". */
  day: ReactNode;
  /** Secondary line — time / audience / location, e.g. "Fri 7:00pm · Grades 6–12". */
  detail?: ReactNode;
  /** Campus tag pill, e.g. "Both campuses" / "Hays campus". Omitted → no pill. */
  campus?: ReactNode;
  /** Local `/images/*.webp` (or absolute URL). Falsy → tasteful gradient. */
  image?: string;
  imageAlt?: string;
  /** Whole card becomes a link. */
  href?: string;
  /** `data-cms-img` hook for the image region (editor recolor/replace). */
  imgCmsKey?: string;
  className?: string;
  style?: CSSProperties;
}

/** 4:5 media area — image with cover fit, or a teal→ink gradient fallback. */
function Media({
  image,
  imageAlt,
  imgCmsKey,
  chip,
}: {
  image?: string;
  imageAlt?: string;
  imgCmsKey?: string;
  chip: ReactNode;
}) {
  const wrap: CSSProperties = {
    position: "relative",
    aspectRatio: "4 / 5",
    overflow: "hidden",
    // Gradient sits UNDER the image so an unloaded/absent photo never shows grey.
    background:
      "linear-gradient(150deg, rgba(28,195,175,0.42) 0%, rgba(23,156,140,0.30) 42%, #1b1c1c 100%)",
  };
  return (
    <div style={wrap} data-cms-img={imgCmsKey}>
      {image ? (
        <Image
          src={assetPath(image)}
          alt={imageAlt || ""}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      ) : null}
      {/* Legibility scrim so the white date chip always reads over any photo. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(10,10,10,0.28) 0%, rgba(10,10,10,0) 34%, rgba(10,10,10,0) 62%, rgba(10,10,10,0.55) 100%)",
        }}
      />
      {chip}
    </div>
  );
}

export default function EventCard({
  title,
  month,
  day,
  detail,
  campus,
  image,
  imageAlt,
  href,
  imgCmsKey,
  className,
  style,
}: EventCardProps) {
  const surface: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "hidden",
    borderRadius: "var(--radius-md)",
    background: "var(--color-ink-soft)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "var(--shadow-rest)",
    color: "#fff",
    textDecoration: "none",
    ...style,
  };

  const chip = (
    <div
      style={{
        position: "absolute",
        top: "1rem",
        left: "1rem",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        background: "var(--color-teal)",
        color: "#042e29",
        borderRadius: "var(--radius-sm)",
        padding: "0.5rem 0.85rem",
        lineHeight: 1,
        boxShadow: "0 6px 18px rgba(4,46,41,0.28)",
      }}
    >
      <span style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.08em" }}>
        {month}
      </span>
      <span style={{ fontSize: "1.6rem", fontWeight: 800, marginTop: "0.15rem" }}>
        {day}
      </span>
    </div>
  );

  const body = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        padding: "clamp(1.25rem, 2.4vw, 1.6rem)",
        gap: "0.4rem",
      }}
    >
      <h3
        className="heading-3"
        style={{ color: "#fff", fontSize: "1.3rem", margin: 0 }}
      >
        {title}
      </h3>
      {detail != null && (
        <p className="body-base" style={{ color: "rgba(255,255,255,0.7)", margin: 0 }}>
          {detail}
        </p>
      )}
      {/* Flex spacer pushes the campus pill to the bottom → equal-height rows align. */}
      <div style={{ flex: 1 }} />
      {campus != null && (
        <span
          style={{
            alignSelf: "flex-start",
            marginTop: "0.85rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "var(--color-teal)",
            background: "rgba(28,195,175,0.12)",
            border: "1px solid rgba(28,195,175,0.24)",
            borderRadius: "999px",
            padding: "0.3rem 0.7rem",
          }}
        >
          {campus}
        </span>
      )}
    </div>
  );

  const inner = (
    <>
      <Media image={image} imageAlt={imageAlt} imgCmsKey={imgCmsKey} chip={chip} />
      {body}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={["bento-tile", className].filter(Boolean).join(" ")}
        style={surface}
      >
        {inner}
      </a>
    );
  }

  return (
    <article
      className={["bento-tile", className].filter(Boolean).join(" ")}
      style={surface}
    >
      {inner}
    </article>
  );
}
