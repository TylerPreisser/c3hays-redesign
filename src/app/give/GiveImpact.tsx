import { Tx } from "@/components/cms/Editable";

export interface GiveImpactProps {
  /** Page text override bag. */
  t: Record<string, string>;
}

/**
 * give-impact — the mockup's `.why` "Why we give". No cards: a two-column editorial
 * split. LEFT is a serif-italic blockquote of 2 Corinthians 9:7 held by a teal vertical
 * spine + a small-caps <cite>. RIGHT is an eyebrow, two prose paragraphs (2nd muted),
 * and three FACET ROWS (round ◇ mark + h3 + p) describing where generosity goes —
 * community, world, local church.
 *
 * Server component. Every eyebrow / verse / cite / paragraph / facet title+body is an
 * editable <Tx>; the whole section surface is recolorable via data-cms-bg. Layout lives
 * in a scoped <style> (class prefix `gi-`) so nothing here can collide with give-ways /
 * give-close or the global sheet.
 */
export default function GiveImpact({ t }: GiveImpactProps) {
  return (
    <section data-cms-bg="give-impact-bg" className="gi-why">
      <style
        dangerouslySetInnerHTML={{
          __html: `
.gi-why{background:#ffffff;padding:clamp(72px,10vw,128px) 0 clamp(56px,8vw,104px)}
.gi-why__wrap{max-width:1160px;margin-inline:auto;padding-inline:clamp(20px,5vw,64px)}
.gi-why__grid{display:grid;grid-template-columns:1.05fr .95fr;gap:clamp(40px,6vw,88px);align-items:start}
.gi-verse{position:relative;padding-left:28px}
.gi-verse::before{content:"";position:absolute;left:0;top:6px;bottom:6px;width:3px;background:linear-gradient(var(--color-teal),var(--color-teal-deep));border-radius:2px}
.gi-verse blockquote{margin:0;font-family:"Iowan Old Style",Palatino,Georgia,serif;font-style:italic;font-size:clamp(1.7rem,3.2vw,2.55rem);line-height:1.22;color:var(--color-ink)}
.gi-verse cite{display:block;margin-top:22px;font-style:normal;font-size:.8rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--color-teal-deep)}
.gi-body__ey{margin:0 0 20px}
.gi-body p.gi-prose{margin:0 0 20px;color:var(--color-ink)}
.gi-body p.gi-prose.gi-mut{color:var(--color-mute)}
.gi-facets{margin-top:38px;border-top:1px solid rgba(27,28,28,0.08)}
.gi-facet{display:grid;grid-template-columns:auto 1fr;gap:18px;padding:22px 0;border-bottom:1px solid rgba(27,28,28,0.08)}
.gi-facet__mark{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:var(--color-mist);border:1px solid rgba(27,28,28,0.08);color:var(--color-teal-deep);font-size:1rem;line-height:1}
.gi-facet__t{margin:0 0 5px;font-size:1.2rem;font-weight:600;letter-spacing:-.01em;line-height:1.2;color:var(--color-ink)}
.gi-facet__b{margin:0;color:var(--color-mute);font-size:.9375rem;line-height:1.55}
@media (max-width:900px){.gi-why__grid{grid-template-columns:1fr}}
`,
        }}
      />
      <div className="gi-why__wrap">
        <div className="gi-why__grid">
          {/* LEFT — the verse */}
          <div className="gi-verse">
            <Tx
              as="blockquote"
              text={t}
              k="give-impact-verse"
              fallback="&ldquo;Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.&rdquo;"
            />
            <Tx as="cite" text={t} k="give-impact-cite" fallback="2 Corinthians 9:7" />
          </div>

          {/* RIGHT — the why */}
          <div className="gi-body">
            <Tx
              text={t}
              k="give-impact-eyebrow"
              fallback="Why we give"
              className="overline gi-body__ey"
              as="p"
            />
            <Tx
              as="p"
              text={t}
              k="give-impact-body"
              fallback="At Celebration Community Church we understand that God owns everything, and we are simply stewards of what He has entrusted to us."
              className="body-lg gi-prose"
            />
            <Tx
              as="p"
              text={t}
              k="give-impact-body-2"
              fallback="So we invest our time, our talents, and our money in things that matter to God. Generosity isn&rsquo;t a transaction &mdash; it&rsquo;s worship, and it&rsquo;s how we join what God is already doing."
              className="body-lg gi-prose gi-mut"
            />

            <div className="gi-facets">
              {/* In your community */}
              <div className="gi-facet">
                <span className="gi-facet__mark" aria-hidden>
                  &#9671;
                </span>
                <div>
                  <Tx as="h3" text={t} k="give-impact-facet1-title" fallback="In your community" className="gi-facet__t" />
                  <Tx
                    as="p"
                    text={t}
                    k="give-impact-facet1-body"
                    fallback="Weekend gatherings in Hays and Colby, next-generation ministries, and care for people right where they are."
                    className="gi-facet__b"
                  />
                </div>
              </div>

              {/* Around the world */}
              <div className="gi-facet">
                <span className="gi-facet__mark" aria-hidden>
                  &#9671;
                </span>
                <div>
                  <Tx as="h3" text={t} k="give-impact-facet2-title" fallback="Around the world" className="gi-facet__t" />
                  <Tx
                    as="p"
                    text={t}
                    k="give-impact-facet2-body"
                    fallback="Mission partners carrying the hope of Jesus far beyond our walls &mdash; into places we may never visit ourselves."
                    className="gi-facet__b"
                  />
                </div>
              </div>

              {/* Through the local church */}
              <div className="gi-facet">
                <span className="gi-facet__mark" aria-hidden>
                  &#9671;
                </span>
                <div>
                  <Tx as="h3" text={t} k="give-impact-facet3-title" fallback="Through the local church" className="gi-facet__t" />
                  <Tx
                    as="p"
                    text={t}
                    k="give-impact-facet3-body"
                    fallback="Keeping the doors open and the lights on, so anyone who walks in can meet Jesus, grow, and serve."
                    className="gi-facet__b"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
