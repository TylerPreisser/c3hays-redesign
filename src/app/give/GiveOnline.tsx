"use client";

import { site } from "@/data/site";
import { Tx, EditableLink } from "@/components/cms/Editable";

/** Strip the `?r=monthly` recurring flag → the campus's base Pushpay giving page. */
const base = (url: string) => url.replace(/\?r=monthly$/, "");

export interface GiveOnlineProps {
  /** Page text override bag. */
  t: Record<string, string>;
}

/**
 * give-online — the LEFT dark feature card of give-ways. Two real campus Give buttons,
 * nothing else: each opens that campus's single REAL Pushpay page (Pushpay handles the
 * fund choice and recurring/one-time on their end). No fund designations, no frequency
 * toggle. Labels + hrefs stay editable via <EditableLink>.
 *
 * Owns `data-cms-bg="give-way-feature-bg"` so this card recolors INDEPENDENTLY of the
 * give-ways band. Without it the only handle on the whole section was the band's
 * `give-ways-bg`, so recoloring this dark card repainted every method tile with it —
 * the per-tile-bg half of the give editor-native contract, and the reason a staffer
 * could not restyle one tile.
 */
export default function GiveOnline({ t }: GiveOnlineProps) {
  const haysHref = base(site.giving.hays);
  const colbyHref = base(site.giving.colby);

  return (
    <div className="gw-feature" data-cms-bg="give-way-feature-bg">
      <Tx text={t} k="give-ways-feature-eyebrow" fallback="Recommended" className="gw-feature__ey" as="p" />
      <Tx as="h3" text={t} k="give-ways-feature-title" fallback="Give online" className="gw-feature__t" />
      <Tx
        as="p"
        text={t}
        k="give-ways-feature-body"
        fallback="Give securely through our Pushpay platform. Pick your campus below."
        className="gw-feature__p"
      />
      <div className="gw-campuses">
        <EditableLink text={t} k="give-ways-hays-give" href={haysHref} label="Hays Campus" external className="gw-give-btn" />
        <EditableLink text={t} k="give-ways-colby-give" href={colbyHref} label="Colby Campus" external className="gw-give-btn" />
      </div>
    </div>
  );
}
