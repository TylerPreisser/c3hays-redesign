import type { CSSProperties, ElementType, ReactNode } from "react";
import Image from "next/image";
import { assetPath } from "@/lib/asset-path";
import { Tx, EditableLink } from "@/components/cms/Editable";

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
 * EDITABLE-BY-CONSTRUCTION: pass a stable `cmsKey` and the card renders month / day
 * / title / detail / campus through <Tx> (data-cms="t:<cmsKey>-<field>"), so an
 * AUTHORED/static consumer gets in-place C3 Studio editing for free — modeled on
 * home/EventsStrip.tsx. LIVE consumers (e.g. <UpcomingEventsLive>, whose rows are
 * positional and refetched each request) MUST NOT pass `cmsKey`: doing so would let
 * a saved edit on row N bleed onto whatever event lands in slot N next time. With no
 * `cmsKey` the card renders its props verbatim, exactly as before (non-editable by
 * design). String/number field values become the editable fallback; non-string
 * ReactNode fields are rendered verbatim even when `cmsKey` is set.
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
  /**
   * Stable CMS key. When set, month/day/title/detail/campus become editable via
   * <Tx> (keys `${cmsKey}-month` etc). Omit for LIVE/positional data (see note).
   */
  cmsKey?: string;
  /** CMS text override bag (paired with `cmsKey`) — persisted edits render from here. */
  cmsText?: Record<string, string>;
  /**
   * STRUCTURED / authored-card mode: the card's data-cms path prefix, e.g.
   * `events.cards.<id>`. When set, month/day/title/detail/campus emit
   * `data-cms="<cardPath>.<field>"` (no scope prefix) carrying the value verbatim,
   * so the editor's card-path router persists edits into the structured page
   * collection (mirrors home/StayConnected). Mutually exclusive with `cmsKey`.
   */
  cardPath?: string;
  /**
   * `data-cms-bg` hook on the card CONTAINER, so the editor can recolor THIS card's
   * background independently (buildBgCss paints `bgFill[bgCmsKey]` with !important).
   * Optional → omitting it leaves the card bg untagged (backward compatible).
   */
  bgCmsKey?: string;
  /**
   * When set, the card renders an editable CTA link in its body via <EditableLink>
   * (emits `data-cms-link` + the required `data-cms-link-label` span, contract §2),
   * and the card is NEVER wrapped as a whole-card `<a>` (that would nest anchors).
   * `ctaHref`/`ctaLabel` are the live fallbacks; persisted edits render from `cmsText`.
   */
  ctaCmsKey?: string;
  ctaHref?: string;
  ctaLabel?: string;
  ctaExternal?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * Render one field. Three modes, in precedence order:
 *   1. `cmsPath` (STRUCTURED / authored cards) — emits a raw element carrying the
 *      exact `data-cms="<cmsPath>"` (e.g. "events.cards.<id>.title") with the value
 *      as innerHTML, mirroring home/StayConnected. The editor's card-path router
 *      persists edits into the structured page collection. No scope prefix.
 *   2. `cmsKey` (FLAT / positional-live cards) — an editable <Tx> emitting
 *      `data-cms="t:<cmsKey>-<suffix>"`, persisted in the page text bag.
 *   3. neither — the raw ReactNode (byte-for-byte the pre-CMS behavior).
 */
function Field({
  cmsPath,
  cmsKey,
  cmsText,
  suffix,
  value,
  as,
  className,
  style,
}: {
  cmsPath?: string;
  cmsKey?: string;
  cmsText?: Record<string, string>;
  suffix: string;
  value: ReactNode;
  as: ElementType;
  className?: string;
  style?: CSSProperties;
}) {
  if (cmsPath != null && (typeof value === "string" || typeof value === "number")) {
    const Tag = as;
    return (
      <Tag
        data-cms={cmsPath}
        className={className}
        style={style}
        dangerouslySetInnerHTML={{ __html: String(value) }}
      />
    );
  }
  if (cmsKey != null && (typeof value === "string" || typeof value === "number")) {
    return (
      <Tx
        as={as}
        text={cmsText}
        k={`${cmsKey}-${suffix}`}
        fallback={String(value)}
        className={className}
        style={style}
      />
    );
  }
  const Tag = as;
  return (
    <Tag className={className} style={style}>
      {value}
    </Tag>
  );
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
  cmsKey,
  cmsText,
  cardPath,
  bgCmsKey,
  ctaCmsKey,
  ctaHref,
  ctaLabel,
  ctaExternal,
  className,
  style,
}: EventCardProps) {
  // Structured (authored) card → per-field data-cms path; else undefined (flat/live).
  const fieldPath = (field: string): string | undefined =>
    cardPath != null ? `${cardPath}.${field}` : undefined;
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
      <Field
        cmsPath={fieldPath("month")}
        cmsKey={cmsKey}
        cmsText={cmsText}
        suffix="month"
        value={month}
        as="span"
        style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.08em" }}
      />
      <Field
        cmsPath={fieldPath("day")}
        cmsKey={cmsKey}
        cmsText={cmsText}
        suffix="day"
        value={day}
        as="span"
        style={{ fontSize: "1.6rem", fontWeight: 800, marginTop: "0.15rem" }}
      />
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
      <Field
        cmsPath={fieldPath("title")}
        cmsKey={cmsKey}
        cmsText={cmsText}
        suffix="title"
        value={title}
        as="h3"
        className="heading-3"
        style={{ color: "#fff", fontSize: "1.3rem", margin: 0 }}
      />
      {detail != null && (
        <Field
          cmsPath={fieldPath("detail")}
          cmsKey={cmsKey}
          cmsText={cmsText}
          suffix="detail"
          value={detail}
          as="p"
          className="body-base"
          style={{ color: "rgba(255,255,255,0.7)", margin: 0 }}
        />
      )}
      {/* Flex spacer pushes the campus pill to the bottom → equal-height rows align. */}
      <div style={{ flex: 1 }} />
      {campus != null && (
        <Field
          cmsPath={fieldPath("campus")}
          cmsKey={cmsKey}
          cmsText={cmsText}
          suffix="campus"
          value={campus}
          as="span"
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
        />
      )}
      {ctaCmsKey != null && (
        <EditableLink
          text={cmsText}
          k={ctaCmsKey}
          href={ctaHref || "#"}
          label={ctaLabel || "Learn more"}
          external={ctaExternal}
          style={{
            alignSelf: "flex-start",
            marginTop: "1rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "0.85rem",
            fontWeight: 700,
            letterSpacing: "0.01em",
            color: "var(--color-teal)",
            textDecoration: "none",
          }}
        />
      )}
    </div>
  );

  const inner = (
    <>
      <Media image={image} imageAlt={imageAlt} imgCmsKey={imgCmsKey} chip={chip} />
      {body}
    </>
  );

  // Whole-card link ONLY when a CTA link is NOT present — nesting an <a> (the CTA)
  // inside the card's own <a> is invalid HTML. An editor-native card (ctaCmsKey set)
  // is a plain <article> whose single link is the editable CTA (contract §2 "never
  // wrap heading+body+CTA in one link").
  if (href && ctaCmsKey == null) {
    return (
      <a
        href={href}
        data-cms-bg={bgCmsKey}
        className={["bento-tile", className].filter(Boolean).join(" ")}
        style={surface}
      >
        {inner}
      </a>
    );
  }

  return (
    <article
      data-cms-bg={bgCmsKey}
      className={["bento-tile", className].filter(Boolean).join(" ")}
      style={surface}
    >
      {inner}
    </article>
  );
}
