"use client";

import { useState } from "react";
import { site } from "@/data/site";
import { Tx, EditableLink } from "@/components/cms/Editable";

/** Drop the `?r=monthly` recurring flag → the one-time (single gift) form of a Pushpay URL. */
const oneTime = (url: string) => url.replace(/\?r=monthly$/, "");

export interface GiveOnlineProps {
  /** Page text override bag. */
  t: Record<string, string>;
}

/**
 * give-online — the LEFT dark feature card of give-ways, split out as a client island
 * so the Recurring / One-time toggle actually WORKS. State drives every designation
 * link's destination: recurring keeps the campus URL's `?r=monthly` flag; one-time
 * strips it. Each campus's three designations (General / Building / Missions) all open
 * that campus's single REAL Pushpay page — Pushpay has no per-fund short links for us,
 * so the donor picks the fund at checkout. Labels + fallback hrefs stay editable via
 * <Tx>/<EditableLink>; the toggle only rewrites the recurring flag on top of the base.
 */
export default function GiveOnline({ t }: GiveOnlineProps) {
  const [recurring, setRecurring] = useState(true);
  const haysHref = recurring ? site.giving.hays : oneTime(site.giving.hays);
  const colbyHref = recurring ? site.giving.colby : oneTime(site.giving.colby);

  return (
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
      <div className="gw-toggle" role="group" aria-label="Giving frequency">
        <button
          type="button"
          className={recurring ? "on" : ""}
          aria-pressed={recurring}
          onClick={() => setRecurring(true)}
        >
          <Tx text={t} k="give-ways-toggle-recurring" fallback="Recurring" />
        </button>
        <button
          type="button"
          className={recurring ? "" : "on"}
          aria-pressed={!recurring}
          onClick={() => setRecurring(false)}
        >
          <Tx text={t} k="give-ways-toggle-onetime" fallback="One-time" />
        </button>
      </div>
      <div className="gw-campuses">
        {/* Hays campus — every designation opens the real Hays Pushpay page; the
            recurring/one-time flag follows the toggle. Donor picks the fund at checkout. */}
        <div className="gw-campus-group">
          <Tx as="h4" text={t} k="give-ways-hays-title" fallback="Hays Campus" className="gw-campus-h" />
          <div className="gw-desig">
            <EditableLink text={t} k="give-ways-hays-general" href={haysHref} label="General" external />
            <EditableLink text={t} k="give-ways-hays-building" href={haysHref} label="Building" external />
            <EditableLink text={t} k="give-ways-hays-missions" href={haysHref} label="Missions" external />
          </div>
        </div>
        {/* Colby campus — same pattern against the real Colby Pushpay page. */}
        <div className="gw-campus-group">
          <Tx as="h4" text={t} k="give-ways-colby-title" fallback="Colby Campus" className="gw-campus-h" />
          <div className="gw-desig">
            <EditableLink text={t} k="give-ways-colby-general" href={colbyHref} label="General" external />
            <EditableLink text={t} k="give-ways-colby-building" href={colbyHref} label="Building" external />
            <EditableLink text={t} k="give-ways-colby-missions" href={colbyHref} label="Missions" external />
          </div>
        </div>
      </div>
    </div>
  );
}
