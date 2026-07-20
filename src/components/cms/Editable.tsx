import type { CSSProperties, ElementType } from "react";
import { tx } from "@/lib/home-content";

/**
 * <Editable> / <Tx> — the ONE way to render authored display text so it is
 * editable-by-construction in C3 Studio.
 *
 * The editor's contract is a pure DOM scan: EditBridge (active when ?cmsEdit=1)
 * finds every element carrying `data-cms` and makes it click-to-edit; c3-backend
 * persists by the key's scope prefix ("t:" = page/home text, "g:" = global). So a
 * component is editable IFF it emits `data-cms="<scope>:<key>"`. Historically each
 * component hand-rolled that span+tx()+dangerouslySetInnerHTML trio (see
 * home/EventsStrip.tsx) and any component that forgot it was silently NON-editable
 * (the Events/EventCard regression). Routing text through this primitive makes
 * "new authored text = editable" hold by contract, not by memory.
 *
 * Server component (no client state) — safe on every route, incl. /section-preview.
 *
 *   <Tx text={text} k="events-heading" fallback="Upcoming Events" as="h2" className="display-2" />
 *   <Tx text={globals.text} scope="g" k="footer-brand" fallback="…" />
 *   <EditableLink text={text} k="events.cta" href="/connect/" label="See All Events" className="btn" />
 *
 * Keys MUST be stable (they are the CMS identity — never rename). `text` is the
 * override bag from the CMS; tx() returns the override or the fallback.
 */
export type CmsScope = "t" | "g";

export interface EditableProps {
  /** CMS override bag (page text / globals text). */
  text?: Record<string, string>;
  /** Stable content key (no scope prefix). */
  k: string;
  /** Default text shown when no override exists. May contain safe inline HTML. */
  fallback: string;
  /** Scope prefix: "t" = page/home text (default), "g" = global (footer/header). */
  scope?: CmsScope;
  /** Element to render. Default: span. */
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  /** Optional passthrough (e.g. aria-hidden) — spread last. */
  [key: `data-${string}`]: unknown;
}

export function Editable({ text, k, fallback, scope = "t", as: Tag = "span", className, style, ...rest }: EditableProps) {
  return (
    <Tag
      data-cms={`${scope}:${k}`}
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: tx(text, k, fallback) }}
      {...rest}
    />
  );
}

/** Alias — the coordinator/recon refer to this primitive as <Tx>. Same component. */
export const Tx = Editable;

export interface EditableLinkProps {
  /** CMS override bag; if present, reads `${k}-href` / `${k}-label` overrides. */
  text?: Record<string, string>;
  /** Stable link key = the data-cms-link value (e.g. "events.cta", "g:nav-cta"). */
  k: string;
  /** Default destination when no `${k}-href` override exists. */
  href: string;
  /** Default label when no `${k}-label` override exists. */
  label: string;
  className?: string;
  style?: CSSProperties;
  /** External links open safely; internal keep prefetch off (503-storm guard). */
  external?: boolean;
}

/**
 * An editable link: destination + label are both editable in C3 Studio via
 * data-cms-link (+ the required data-cms-link-label span). Internal links render
 * as <a> here (not next/link) to stay a server component AND to inherit the
 * prefetch-off posture that fixed the editor-preview 503 storm.
 */
export function EditableLink({ text, k, href, label, className, style, external }: EditableLinkProps) {
  const dest = text?.[`${k}-href`] || href;
  const text_ = text?.[`${k}-label`] || label;
  return (
    <a
      href={dest}
      data-cms-link={k}
      className={className}
      style={style}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span data-cms-link-label>{text_}</span>
    </a>
  );
}
