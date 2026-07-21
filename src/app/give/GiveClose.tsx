import { site } from "@/data/site";
import { Tx, EditableLink } from "@/components/cms/Editable";

export interface GiveCloseProps {
  /** Page text override bag. */
  t: Record<string, string>;
}

/**
 * give-close — the mockup's `.close` band. A dark, centered closing call: eyebrow,
 * a large heading, one line of prose, and two buttons (primary "Give Now" → real
 * Pushpay; ghost "See the ways to give" → the #give-ways anchor above).
 *
 * Server component. All copy is editable <Tx>; both buttons are <EditableLink>. The
 * whole surface is recolorable via data-cms-bg. Layout in a scoped <style> (prefix `gc-`).
 */
export default function GiveClose({ t }: GiveCloseProps) {
  return (
    <section data-cms-bg="give-close-bg" className="gc-close">
      <style
        dangerouslySetInnerHTML={{
          __html: `
.gc-close{background:var(--color-ink-warm);color:#fff;text-align:center;padding:clamp(80px,11vw,132px) 0}
.gc-close__wrap{max-width:1160px;margin-inline:auto;padding-inline:clamp(20px,5vw,64px)}
.gc-close__ey{color:var(--color-teal-soft)}
.gc-close__h{color:#fff;max-width:20ch;margin:16px auto 0}
.gc-close__p{color:rgba(255,255,255,.68);font-size:1.15rem;margin:20px auto 0;max-width:40ch}
.gc-close__cta{display:flex;justify-content:center;flex-wrap:wrap;gap:14px;margin-top:36px}
`,
        }}
      />
      <div className="gc-close__wrap">
        <Tx text={t} k="give-close-eyebrow" fallback="Ready when you are" className="overline gc-close__ey" as="p" />
        <Tx
          as="h2"
          text={t}
          k="give-close-heading"
          fallback="Give today, and change a life &mdash; maybe your own."
          className="display-2 gc-close__h"
        />
        <Tx
          as="p"
          text={t}
          k="give-close-body"
          fallback="Every gift, of any size, goes further than you know. Thank you for your generosity."
          className="gc-close__p"
        />
        <div className="gc-close__cta">
          <EditableLink
            text={t}
            k="give-close-give"
            href={site.giving.hays}
            label="Give Now"
            external
            className="btn btn-primary"
          />
          <EditableLink
            text={t}
            k="give-close-ways"
            href="#give-ways"
            label="See the ways to give"
            className="btn btn-hero-ghost"
          />
        </div>
      </div>
    </section>
  );
}
