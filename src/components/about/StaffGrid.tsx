import Image from "next/image";
import { tx, imgCss, type ImgStyle } from "@/lib/home-content";
import { assetPath } from "@/lib/asset-path";
import { staffGroups } from "@/data/staff";

/**
 * About → "Meet Our Staff" — the REAL celebratejesus.org leadership roster
 * (14 people, captured 2026-07-15), grouped exactly as the live site:
 * Elder Staff → Hays Campus Staff → Colby Campus Staff. Names + titles only —
 * the real site carries no bios, so none are invented.
 *
 * Each portrait is a CMS-taggable `data-cms-img` region that defaults to an elegant
 * monogram (the person's initials) so a card is never broken and Tyler can drop in a
 * real headshot later via the editor without any placeholder faces.
 */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function StaffGrid({
  text,
  img,
}: {
  text?: Record<string, string>;
  img?: Record<string, ImgStyle>;
}) {
  return (
    <section className="section" style={{ backgroundColor: "#ffffff" }}>
      <div className="container-c3">
        {/* Header */}
        <div
          className="max-w-2xl"
          style={{ marginBottom: "clamp(3rem, 6vw, 5rem)" }}
        >
          <p
            className="overline mb-5"
            style={{ color: "#1cc3af" }}
            data-cms="t:about-staff-eyebrow"
            dangerouslySetInnerHTML={{
              __html: tx(text, "about-staff-eyebrow", "Here to serve you"),
            }}
          />
          <h2
            className="display-2 mb-6"
            style={{ color: "#1b1c1c" }}
            data-cms="t:about-staff-title"
            dangerouslySetInnerHTML={{
              __html: tx(text, "about-staff-title", "Meet Our Leadership"),
            }}
          />
          <p
            className="body-lg"
            style={{ color: "rgba(27,28,28,0.65)", lineHeight: 1.7 }}
            data-cms="t:about-staff-blurb"
            dangerouslySetInnerHTML={{
              __html: tx(
                text,
                "about-staff-blurb",
                "Say hi to the staff of Celebration Community Church."
              ),
            }}
          />
        </div>

        {/* Groups */}
        <div className="flex flex-col" style={{ gap: "clamp(3rem, 6vw, 5rem)" }}>
          {staffGroups.map((group) => (
            <div key={group.id}>
              {/* Group label */}
              <div className="flex items-center gap-4 mb-8 md:mb-10">
                <h3
                  className="font-bold uppercase tracking-widest"
                  style={{ color: "#1b1c1c", fontSize: "0.82rem", letterSpacing: "0.18em" }}
                  data-cms={`t:about-staff-group-${group.id}`}
                  dangerouslySetInnerHTML={{
                    __html: tx(text, `about-staff-group-${group.id}`, group.label),
                  }}
                />
                <span
                  aria-hidden="true"
                  style={{ flex: 1, height: 1, background: "rgba(27,28,28,0.12)" }}
                />
              </div>

              {/* Member cards */}
              <div
                className="grid gap-x-6"
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  rowGap: "clamp(2rem, 4vw, 3rem)",
                }}
              >
                {group.members.map((m) => {
                  const key = `about-staff.${m.id}`;
                  return (
                    <div key={m.id} className="group flex flex-col items-center text-center">
                      {/* Portrait / monogram */}
                      <div
                        data-cms-img={`${key}-photo`}
                        className="relative overflow-hidden mb-5"
                        style={{
                          width: "clamp(120px, 14vw, 168px)",
                          aspectRatio: "1 / 1",
                          borderRadius: 999,
                          background:
                            "linear-gradient(155deg, #23514b 0%, #1b1c1c 100%)",
                          border: "1px solid rgba(28,195,175,0.28)",
                        }}
                      >
                        {text?.[`${key}-photo-src`] ? (
                          <Image
                            src={assetPath(text[`${key}-photo-src`])}
                            alt={m.name}
                            fill
                            sizes="168px"
                            className="object-cover"
                            style={imgCss(img?.[`${key}-photo`])}
                          />
                        ) : (
                          <span
                            aria-hidden="true"
                            className="absolute inset-0 grid place-items-center"
                            style={{
                              color: "#1cc3af",
                              fontWeight: 700,
                              fontSize: "clamp(1.9rem, 4vw, 2.6rem)",
                              letterSpacing: "0.04em",
                            }}
                          >
                            {initials(m.name)}
                          </span>
                        )}
                      </div>

                      {/* Name + role */}
                      <span
                        className="block heading-3"
                        style={{ color: "#1b1c1c", fontSize: "1.1rem" }}
                        data-cms={`t:${key}-name`}
                        dangerouslySetInnerHTML={{
                          __html: tx(text, `${key}-name`, m.name),
                        }}
                      />
                      <span
                        className="block mt-1"
                        style={{ color: "#179c8c", fontSize: "0.88rem", fontWeight: 500 }}
                        data-cms={`t:${key}-role`}
                        dangerouslySetInnerHTML={{
                          __html: tx(text, `${key}-role`, m.role),
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
