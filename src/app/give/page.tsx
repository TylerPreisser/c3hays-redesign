import type { Metadata } from "next";
import Image from "next/image";
import { ShieldCheck, Banknote, Smartphone, Mail, Globe } from "lucide-react";
import { site } from "@/data/site";
import { assetPath } from "@/lib/asset-path";
import { getCMSPage } from "@/lib/cms";
import { imgCss } from "@/lib/home-content";
import { Tx, EditableLink } from "@/components/cms/Editable";
import Section from "@/components/ui/Section";
import Stack from "@/components/ui/Stack";

export const metadata: Metadata = {
  title: "Give",
  description:
    "Give generously to Celebration Community Church — online, by app, or in person at Hays or Colby.",
};

export default async function GivePage() {
  const ov = (await getCMSPage("/give")) || {};
  const t = ov.text || {};
  const media = ov.media || {};

  /* Warm-neutral tokens (teal stays the accent). */
  const ink = "var(--color-ink-warm)";
  const mute = "var(--color-stone)";
  const line = "var(--color-clay-line)";
  const cardBg = "var(--color-bone)";

  /* LEFT-column dollar-impact tiles — illustrative, tasteful (NEW keys). */
  const impactTiles = [
    ["give-tile-0-amount", "$25", "give-tile-0-body", "Groceries for a week for a family we serve"],
    ["give-tile-1-amount", "$50", "give-tile-1-body", "A month of warm meals for a neighbor in need"],
    ["give-tile-2-amount", "$100", "give-tile-2-body", "Helps send a student to camp to meet Jesus"],
  ] as const;

  /* RIGHT-column giving card — the three EXTERNAL Pushpay destinations. */
  const givingCampuses = [
    { k: "give-campus-hays", label: "Give — Hays Campus", href: site.giving.hays },
    { k: "give-campus-colby", label: "Give — Colby Campus", href: site.giving.colby },
    { k: "give-campus-online", label: "Give — General / Online", href: site.giving.online },
  ];

  /* "Where it goes" transparency strip (existing keys preserved). */
  const whereItGoes: [string, string, string, string][] = [
    ["give-impact-0-title", "Right here at home", "give-impact-0-body", "Weekend gatherings, kids & students, and care for our Hays and Colby communities."],
    ["give-impact-1-title", "The next generation", "give-impact-1-body", "Investing in young families and raising up the church Jesus is building."],
    ["give-impact-2-title", "Beyond our walls", "give-impact-2-body", "Local outreach and global missions — the love of Christ to the ends of the earth."],
  ];

  /* Real mailing address — only REAL info from @/data/site. */
  const mailBody = `${site.name}<br/>${site.address.street}<br/>${site.address.city}, ${site.address.state} ${site.address.zip}`;

  /* "Other ways to give" (existing give-opt-* keys preserved; by-mail is NEW). */
  const otherWays = [
    { icon: Banknote, titleK: "give-opt-cash-title", title: "In person", bodyK: "give-opt-cash-body", body: 'Give at the offering box in the lobby during any weekend service. Make checks payable to "Celebration Community Church."', cta: null as null | { k: string; href: string; label: string } },
    { icon: Globe, titleK: "give-opt-online-title", title: "Online", bodyK: "give-opt-online-body", body: "Give securely through Pushpay — one-time or recurring — to the general fund.", cta: { k: "give-opt-online-cta", href: site.giving.online, label: "Give Online" } },
    { icon: Smartphone, titleK: "give-opt-app-title", title: "C3 App", bodyK: "give-opt-app-body", body: "Download the C3 app and give in seconds — anywhere, anytime.", cta: { k: "give-opt-app-cta", href: site.appStore, label: "Download App" } },
    { icon: Mail, titleK: "give-mail-title", title: "By mail", bodyK: "give-mail-body", body: mailBody, cta: null },
  ];

  return (
    <>
      {/* ── Quiet warm photo band (above the fold) ── */}
      <section
        className="relative flex items-end overflow-hidden"
        style={{ minHeight: "58vh" }}
      >
        <div
          className="absolute inset-0"
          data-cms-img="give-hero-bg"
          style={{ borderRadius: 0 }}
        >
          <Image
            src={assetPath(media["give-hero-bg"] || "/images/congregation.webp")}
            alt="Our church family together"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={imgCss(ov.img?.["give-hero-bg"])}
          />
          {/* Warm grade — quiet, not a loud dark scrim; blends into the paper below. */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(26,24,21,0.82) 0%, rgba(26,24,21,0.42) 48%, rgba(26,24,21,0.20) 100%)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0"
            style={{ height: "34%", background: "linear-gradient(to top, var(--color-paper) 2%, transparent 100%)" }}
          />
        </div>

        <div className="relative z-10 container-c3 pb-16 pt-40">
          <Stack gap="heading" style={{ maxWidth: "34rem" }}>
            <Stack gap="eyebrow">
              <Tx
                text={t}
                k="give-hero-eyebrow"
                fallback="Generosity"
                className="overline"
                style={{ color: "var(--color-teal)" }}
              />
              <Tx
                as="h1"
                text={t}
                k="give-hero-heading"
                fallback='Your giving is <em class="not-italic" style="color:var(--color-teal)">changing</em> lives.'
                className="display-1 text-balance"
                style={{ color: "#fff" }}
              />
            </Stack>
            <Tx
              as="p"
              text={t}
              k="give-hero-body"
              fallback="At C3 we believe God owns everything. We simply steward it well — giving generously toward what He values, and watching Him move through it."
              className="body-lg"
              style={{ color: "rgba(255,255,255,0.72)", maxWidth: "32rem" }}
            />
            <EditableLink
              text={t}
              k="give-hero-cta"
              href={site.giving.online}
              label="Give Now"
              external
              className="btn btn-primary btn-lg"
              style={{ marginTop: "var(--s-2)", alignSelf: "flex-start" }}
            />
          </Stack>
        </div>
      </section>

      {/* ── Two-column give module (calm paper background) ── */}
      <Section container size="default" style={{ backgroundColor: "var(--color-paper)" }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* LEFT — narrative / why we give */}
          <Stack gap="heading">
            <Stack gap="eyebrow">
              <Tx
                text={t}
                k="give-ways-eyebrow"
                fallback="Why we give"
                className="overline"
                style={{ color: "var(--color-teal-deep)" }}
              />
              <Tx
                as="h2"
                text={t}
                k="give-ways-heading"
                fallback="Generosity is worship."
                className="display-2 text-balance"
                style={{ color: ink }}
              />
            </Stack>

            <Tx
              as="p"
              text={t}
              k="give-story-body"
              fallback="We give because God first gave to us. Every gift — large or small — becomes real hope for a neighbor, a family, and the next generation right here in Hays and Colby."
              className="body-lg"
              style={{ color: mute, maxWidth: "34rem" }}
            />

            {/* Impact tiles — fade/rise on scroll-in (subtle) */}
            <div className="flex flex-col gap-3" style={{ marginTop: "var(--s-2)", width: "100%" }}>
              {impactTiles.map(([amtK, amt, bodyK, body], i) => (
                <div
                  key={amtK}
                  data-anim="fadeInUp"
                  className="flex items-center gap-5"
                  style={{
                    background: cardBg,
                    border: `1px solid ${line}`,
                    borderRadius: "var(--radius-md)",
                    padding: "var(--s-6)",
                    boxShadow: "var(--shadow-rest)",
                    animationDelay: `${i * 90}ms`,
                  }}
                >
                  <Tx
                    text={t}
                    k={amtK}
                    fallback={amt}
                    className="shrink-0 tabular-nums"
                    style={{ color: "var(--color-teal-deep)", fontWeight: 800, fontSize: "clamp(1.5rem,3.5vw,2rem)", lineHeight: 1, minWidth: "3.75rem" }}
                  />
                  <Tx
                    as="p"
                    text={t}
                    k={bodyK}
                    fallback={body}
                    className="text-sm leading-relaxed"
                    style={{ color: mute }}
                  />
                </div>
              ))}
            </div>

            {/* Trust row */}
            <div className="flex items-center gap-2" style={{ color: mute }}>
              <ShieldCheck size={16} strokeWidth={2} style={{ color: "var(--color-teal-deep)" }} />
              <Tx
                text={t}
                k="give-trust"
                fallback="Secure giving &bull; Tax-deductible"
                className="text-xs font-semibold uppercase tracking-widest"
              />
            </div>
          </Stack>

          {/* RIGHT — giving card with the three Pushpay destinations */}
          <div
            style={{
              background: cardBg,
              border: `1px solid ${line}`,
              borderRadius: "var(--radius-md)",
              padding: "clamp(1.75rem, 4vw, 2.5rem)",
              boxShadow: "var(--shadow-hover)",
            }}
          >
            <Stack gap="heading">
              <Stack gap="eyebrow">
                <Tx
                  as="h2"
                  text={t}
                  k="give-campus-heading"
                  fallback="Give by campus"
                  className="heading-3"
                  style={{ color: ink }}
                />
                <Tx
                  as="p"
                  text={t}
                  k="give-campus-subhead"
                  fallback="Choose your home campus so your gift reaches the right community."
                  className="text-sm"
                  style={{ color: mute }}
                />
              </Stack>

              <div className="flex flex-col gap-3" style={{ width: "100%" }}>
                {givingCampuses.map((c, i) => (
                  <EditableLink
                    key={c.k}
                    text={t}
                    k={c.k}
                    href={c.href}
                    label={c.label}
                    external
                    className="btn btn-lg"
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      // First (home campus) reads as primary; the rest as calm outlines.
                      background: i === 0 ? "var(--color-teal)" : "var(--color-paper-soft)",
                      color: i === 0 ? "#fff" : ink,
                      border: i === 0 ? "none" : `1px solid ${line}`,
                      fontWeight: 700,
                    }}
                  />
                ))}
              </div>

              <p className="text-xs" style={{ color: mute }}>
                Giving opens securely in a new tab via Pushpay — one-time or recurring.
              </p>
            </Stack>
          </div>
        </div>
      </Section>

      {/* ── "Where it goes" — transparency strip ── */}
      <Section container size="sm" tone="white">
        <Stack gap="heading">
          <Stack gap="eyebrow">
            <Tx
              text={t}
              k="give-impact-subhead"
              fallback="Every gift, across every campus, fuels one mission."
              className="overline"
              style={{ color: "var(--color-teal-deep)" }}
            />
            <Tx
              as="h2"
              text={t}
              k="give-impact-heading"
              fallback="Where your giving goes"
              className="display-2"
              style={{ color: "var(--color-ink)" }}
            />
          </Stack>

          <div className="grid grid-cols-1 md:grid-cols-3" style={{ width: "100%", borderTop: `1px solid ${line}` }}>
            {whereItGoes.map(([titleK, title, bodyK, body], i) => (
              <div
                key={titleK}
                className="flex flex-col gap-2"
                style={{
                  padding: "var(--s-8) var(--s-6)",
                  borderRight: i < whereItGoes.length - 1 ? `1px solid ${line}` : "none",
                }}
              >
                <span className="text-xs font-bold tabular-nums" style={{ color: "var(--color-teal)" }}>
                  0{i + 1}
                </span>
                <Tx
                  as="h3"
                  text={t}
                  k={titleK}
                  fallback={title}
                  className="font-semibold"
                  style={{ color: "var(--color-ink)", fontSize: "1.0625rem" }}
                />
                <Tx
                  as="p"
                  text={t}
                  k={bodyK}
                  fallback={body}
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-mute)" }}
                />
              </div>
            ))}
          </div>
        </Stack>
      </Section>

      {/* ── Other ways to give ── */}
      <Section container size="sm" style={{ backgroundColor: "var(--color-paper-soft)" }}>
        <Stack gap="heading">
          <Tx
            as="h2"
            text={t}
            k="give-other-heading"
            fallback="Other ways to give"
            className="display-2"
            style={{ color: ink }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" style={{ width: "100%" }}>
            {otherWays.map((w) => {
              const Icon = w.icon;
              return (
                <div
                  key={w.titleK}
                  className="flex flex-col"
                  style={{
                    background: cardBg,
                    border: `1px solid ${line}`,
                    borderRadius: "var(--radius-md)",
                    padding: "var(--s-8)",
                  }}
                >
                  <div
                    className="grid place-items-center"
                    style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(28,195,175,0.12)", marginBottom: "var(--s-6)" }}
                  >
                    <Icon size={22} strokeWidth={1.75} style={{ color: "var(--color-teal-deep)" }} />
                  </div>
                  <Tx
                    as="h3"
                    text={t}
                    k={w.titleK}
                    fallback={w.title}
                    className="heading-3"
                    style={{ color: ink, marginBottom: "var(--s-3)", fontSize: "1.125rem" }}
                  />
                  <Tx
                    as="p"
                    text={t}
                    k={w.bodyK}
                    fallback={w.body}
                    className="flex-1 text-sm leading-relaxed"
                    style={{ color: mute, marginBottom: w.cta ? "var(--s-6)" : 0 }}
                  />
                  {w.cta && (
                    <EditableLink
                      text={t}
                      k={w.cta.k}
                      href={w.cta.href}
                      label={w.cta.label}
                      external
                      className="btn btn-outline btn-sm self-start"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </Stack>
      </Section>

      {/* ── Closing scripture ── */}
      <Section container centered size="default" tone="dark" maxWidth="42rem">
        <Stack gap="heading" align="center">
          <Tx
            text={t}
            k="give-quote-ref"
            fallback="2 Corinthians 9:7"
            className="overline"
            style={{ color: "var(--color-teal)" }}
          />
          <Tx
            as="blockquote"
            text={t}
            k="give-quote-text"
            fallback="&ldquo;Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.&rdquo;"
            className="text-balance"
            style={{ color: "#fff", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", fontWeight: 600, lineHeight: 1.25, letterSpacing: "-0.01em" }}
          />
          <EditableLink
            text={t}
            k="give-connect-cta"
            href="/connect/"
            label="Questions? Connect With Us"
            className="btn btn-outline btn-lg"
            style={{ marginTop: "var(--s-4)" }}
          />
        </Stack>
      </Section>
    </>
  );
}
