import { campaignGiveHref, type Campaign } from "@/lib/announcements";

const money = (n: number, cur: string) => new Intl.NumberFormat("en-US", { style: "currency", currency: cur, maximumFractionDigits: 0 }).format(n);

/** Running campaigns from Studio, each with a progress bar when Studio has a figure. Renders nothing with no campaign. */
export default function GiveCampaigns({ campaigns, links }: { campaigns: Campaign[]; links?: { hays?: string; colby?: string } }) {
  if (campaigns.length === 0) return null;
  return (
    <section aria-labelledby="campaigns-h" className="section" style={{ backgroundColor: "#f4f5f5" }}>
      <div className="container-c3" style={{ maxWidth: "56rem" }}>
        <h2 id="campaigns-h" className="heading-2" style={{ color: "#1b1c1c", marginBottom: "1.5rem" }}>Current campaigns</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "1.25rem" }}>
          {campaigns.map((c) => {
            const pct = c.raised !== null && c.goal > 0 ? Math.min(100, Math.round((c.raised / c.goal) * 100)) : null;
            return (
              <li key={c.id} style={{ background: "#fff", borderRadius: "var(--radius-md)", padding: "1.5rem", border: "1px solid rgba(27,28,28,0.10)" }}>
                <h3 className="heading-3" style={{ color: "#1b1c1c", margin: 0 }}>{c.title}</h3>
                {c.blurb && <p className="body-base" style={{ color: "#3a3b3b", margin: "0.5rem 0 0" }}>{c.blurb}</p>}
                {pct !== null && c.raised !== null && (
                  <div style={{ marginTop: "1rem" }}>
                    <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label={`${c.title}: ${pct} percent of goal`} style={{ height: 10, borderRadius: 999, background: "rgba(27,28,28,0.10)", overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: "#0f766e" }} />
                    </div>
                    <p className="body-sm" style={{ color: "#3a3b3b", margin: "0.5rem 0 0" }}>{money(c.raised, c.currency)} of {money(c.goal, c.currency)}</p>
                  </div>
                )}
                {c.giveUrl && (
                  <a href={campaignGiveHref(c, links)} className="arrow-link" style={{ display: "inline-block", marginTop: "1rem", color: "#0f766e", fontWeight: 700 }}>
                    Give to this campaign <span className="arrow" aria-hidden="true">→</span>
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
