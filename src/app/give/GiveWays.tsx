import { Smartphone, Landmark, Mail } from "lucide-react";
import { site } from "@/data/site";
import { Tx, EditableLink } from "@/components/cms/Editable";

export interface GiveWaysProps {
  /** Page text override bag. */
  t: Record<string, string>;
}

/**
 * give-ways — the mockup's `.ways`, and the SINGLE "Ways to give" on the page. A head
 * (eyebrow + heading + lead) over a two-column split:
 *
 *   LEFT  — a DARK feature card (teal radial glow) for the recommended path: "Give
 *           online", a Recurring / One-time toggle (static visual), and the TWO real
 *           campuses (Hays, Colby). Under each campus, editable designation links
 *           (General / Building / Missions) that all open that campus's REAL Pushpay
 *           page — the donor picks the fund at checkout. There is NO online campus.
 *   RIGHT — a `.methods` list of white tiles: the C3 app, in person, and by mail.
 *
 * Server component. Every string is an editable <Tx>; every destination is an
 * <EditableLink> pointed at the REAL Pushpay / App Store URLs from `site` (only the
 * two campus URLs; no invented fund URLs). `id="give-ways"` is the hero CTA scroll
 * target. Layout lives in a scoped <style> (prefix `gw-`).
 */
export default function GiveWays({ t }: GiveWaysProps) {
  return (
    <section id="give-ways" data-cms-bg="give-ways-bg" className="gw-ways">
      <style
        dangerouslySetInnerHTML={{
          __html: `
.gw-ways{background:#ffffff;padding:clamp(72px,10vw,124px) 0;scroll-margin-top:5rem}
.gw-ways__wrap{max-width:1160px;margin-inline:auto;padding-inline:clamp(20px,5vw,64px)}
.gw-ways__head{max-width:46rem;margin-bottom:clamp(40px,6vw,64px)}
.gw-ways__head .gw-h{color:var(--color-ink);margin:16px 0 0}
.gw-ways__head p.gw-lead{color:var(--color-mute);font-size:1.15rem;margin:20px 0 0}
.gw-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:clamp(20px,3vw,32px);align-items:start}
.gw-feature{background:var(--color-ink);color:#fff;border-radius:20px;padding:clamp(28px,3.4vw,44px);position:relative;overflow:hidden}
.gw-feature::before{content:"";position:absolute;right:-90px;top:-90px;width:280px;height:280px;border-radius:50%;background:radial-gradient(circle,rgba(28,195,175,.26),transparent 68%)}
.gw-feature > *{position:relative}
.gw-feature__ey{color:var(--color-teal-soft);font-weight:700;font-size:.7rem;letter-spacing:.18em;text-transform:uppercase;margin:0}
.gw-feature__t{font-size:clamp(1.7rem,2.6vw,2.15rem);margin:12px 0 0;color:#fff;font-weight:600;letter-spacing:-.02em;line-height:1.05}
.gw-feature__p{color:rgba(255,255,255,.72);margin:14px 0 0}
.gw-toggle{display:inline-flex;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:4px;margin:26px 0 4px;gap:4px}
.gw-toggle span{padding:.5rem 1.15rem;border-radius:999px;font-size:.85rem;font-weight:700;color:rgba(255,255,255,.66)}
.gw-toggle span.on{background:var(--color-teal);color:#08302b}
.gw-campuses{margin-top:26px;display:flex;flex-direction:column;gap:22px}
.gw-campus-group{display:flex;flex-direction:column;gap:12px}
.gw-campus-h{margin:0;font-size:1.05rem;font-weight:700;letter-spacing:-.01em;color:#fff}
.gw-desig{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
.gw-desig a{display:flex;align-items:center;justify-content:center;text-align:center;padding:12px 14px;border-radius:12px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);color:#fff;font-size:.9rem;font-weight:700}
.gw-desig a:hover{background:rgba(255,255,255,.1)}
.gw-methods{display:flex;flex-direction:column;gap:14px}
.gw-method{background:#fff;border:1px solid rgba(27,28,28,0.08);border-radius:16px;padding:22px 24px;display:grid;grid-template-columns:auto 1fr;gap:16px;align-items:start;box-shadow:var(--shadow-rest)}
.gw-method__ic{width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:var(--color-mist);border:1px solid rgba(27,28,28,0.08);color:var(--color-teal-deep)}
.gw-method__t{margin:0 0 5px;font-size:1.2rem;font-weight:600;letter-spacing:-.01em;line-height:1.2;color:var(--color-ink)}
.gw-method__b{margin:0;color:var(--color-mute);font-size:.9rem;line-height:1.5}
.gw-kw{color:var(--color-ink);font-weight:700}
.gw-method__link{color:var(--color-teal-deep);font-weight:700;font-size:.875rem;display:inline-block;margin-top:8px}
@media (max-width:900px){.gw-grid{grid-template-columns:1fr}}
`,
        }}
      />
      <div className="gw-ways__wrap">
        <div className="gw-ways__head">
          <Tx text={t} k="give-ways-eyebrow" fallback="One page, every way" className="overline" as="p" />
          <Tx as="h2" text={t} k="give-ways-heading" fallback="Ways to give" className="display-2 gw-h" />
          <Tx
            as="p"
            text={t}
            k="give-ways-lead"
            fallback="Give a one-time gift or set up recurring giving &mdash; whichever fits you best. Start online, or choose one of the ways below."
            className="gw-lead"
          />
        </div>

        <div className="gw-grid">
          {/* LEFT — dark feature: give online */}
          <div className="gw-feature">
            <Tx text={t} k="give-ways-feature-eyebrow" fallback="Recommended" className="gw-feature__ey" as="p" />
            <Tx as="h3" text={t} k="give-ways-feature-title" fallback="Give online" className="gw-feature__t" />
            <Tx
              as="p"
              text={t}
              k="give-ways-feature-body"
              fallback="Complete a one-time gift or set up recurring giving through our secure Pushpay platform. Pick your campus, then choose the fund you're giving to at checkout."
              className="gw-feature__p"
            />
            <div className="gw-toggle" aria-hidden>
              <Tx text={t} k="give-ways-toggle-recurring" fallback="Recurring" className="on" />
              <Tx text={t} k="give-ways-toggle-onetime" fallback="One-time" />
            </div>
            <div className="gw-campuses">
              {/* Hays campus — each designation opens the real Hays Pushpay page;
                  the donor selects the fund at checkout. Labels/URLs editable. */}
              <div className="gw-campus-group">
                <Tx as="h4" text={t} k="give-ways-hays-title" fallback="Hays Campus" className="gw-campus-h" />
                <div className="gw-desig">
                  <EditableLink text={t} k="give-ways-hays-general" href={site.giving.hays} label="General" external />
                  <EditableLink text={t} k="give-ways-hays-building" href={site.giving.hays} label="Building" external />
                  <EditableLink text={t} k="give-ways-hays-missions" href={site.giving.hays} label="Missions" external />
                </div>
              </div>
              {/* Colby campus — same pattern against the real Colby Pushpay page. */}
              <div className="gw-campus-group">
                <Tx as="h4" text={t} k="give-ways-colby-title" fallback="Colby Campus" className="gw-campus-h" />
                <div className="gw-desig">
                  <EditableLink text={t} k="give-ways-colby-general" href={site.giving.colby} label="General" external />
                  <EditableLink text={t} k="give-ways-colby-building" href={site.giving.colby} label="Building" external />
                  <EditableLink text={t} k="give-ways-colby-missions" href={site.giving.colby} label="Missions" external />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — the other four ways */}
          <div className="gw-methods">
            {/* The C3 app */}
            <div className="gw-method">
              <div className="gw-method__ic" aria-hidden>
                <Smartphone size={22} strokeWidth={1.75} />
              </div>
              <div>
                <Tx as="h3" text={t} k="give-ways-app-title" fallback="The C3 app" className="gw-method__t" />
                <Tx
                  as="p"
                  text={t}
                  k="give-ways-app-body"
                  fallback="Give on the go, watch messages, and stay connected &mdash; right from the Celebration Community Church app."
                  className="gw-method__b"
                />
                <EditableLink
                  text={t}
                  k="give-ways-app-link"
                  href={site.appStore}
                  label="Download for iPhone &rarr;"
                  external
                  className="gw-method__link"
                />
              </div>
            </div>

            {/* In person */}
            <div className="gw-method">
              <div className="gw-method__ic" aria-hidden>
                <Landmark size={22} strokeWidth={1.75} />
              </div>
              <div>
                <Tx as="h3" text={t} k="give-ways-person-title" fallback="In person" className="gw-method__t" />
                <Tx
                  as="p"
                  text={t}
                  k="give-ways-person-body"
                  fallback="Give during weekend services at the boxes located at each entrance to our Worship Center."
                  className="gw-method__b"
                />
              </div>
            </div>

            {/* By mail */}
            <div className="gw-method">
              <div className="gw-method__ic" aria-hidden>
                <Mail size={22} strokeWidth={1.75} />
              </div>
              <div>
                <Tx as="h3" text={t} k="give-ways-mail-title" fallback="By mail" className="gw-method__t" />
                <Tx
                  as="p"
                  text={t}
                  k="give-ways-mail-body"
                  fallback='Mail a check to <span class="gw-kw">C3 &middot; 5790 230th Ave, Hays, KS 67601</span>. Questions? Call <span class="gw-kw">(785) 625-5483</span>.'
                  className="gw-method__b"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
