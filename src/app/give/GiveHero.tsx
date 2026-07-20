import Image from "next/image";
import { assetPath } from "@/lib/asset-path";
import { imgCss } from "@/lib/home-content";
import { Tx, EditableLink } from "@/components/cms/Editable";
import Stack from "@/components/ui/Stack";

/** The real church Pushpay giving destination (celebratejesus handle). */
export const GIVE_PUSHPAY_URL = "https://pushpay.com/g/celebratejesus";

export interface GiveHeroProps {
  /** Page text override bag. */
  t: Record<string, string>;
  /** Editable-image source overrides (path). */
  media: Record<string, string>;
  /** Editable-image framing overrides (focal point + zoom). */
  img: Record<string, { pos?: string; scale?: number }>;
}

/**
 * give-hero — headline + intro + the primary "Give Now" button.
 *
 * On-brand LEFT treatment: a real congregation photo behind a warm gradient
 * (editable via `data-cms-img="give-hero-bg"`). This intentionally REPLACES the
 * old invented dollar-amount ($25/$50/$100) motif Tyler didn't love — no dollar
 * tiles, just a clean editable photo band. Text = real celebratejesus.org /give
 * copy ("Your giving is changing the world." / "You can support the work C3 is
 * doing in your community and around the world.").
 */
export default function GiveHero({ t, media, img }: GiveHeroProps) {
  return (
    <section className="relative flex items-end overflow-hidden" style={{ minHeight: "58vh" }}>
      {/* Editable photo treatment (replaces the removed $-motif). */}
      <div className="absolute inset-0" data-cms-img="give-hero-bg" style={{ borderRadius: 0 }}>
        <Image
          src={assetPath(media["give-hero-bg"] || "/images/congregation.webp")}
          alt="Our church family together"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={imgCss(img?.["give-hero-bg"])}
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
              fallback='Your giving is <em class="not-italic" style="color:var(--color-teal)">changing</em> the world.'
              className="display-1 text-balance"
              style={{ color: "#fff" }}
            />
          </Stack>
          <Tx
            as="p"
            text={t}
            k="give-hero-body"
            fallback="You can support the work C3 is doing in your community and around the world."
            className="body-lg"
            style={{ color: "rgba(255,255,255,0.72)", maxWidth: "32rem" }}
          />
          <EditableLink
            text={t}
            k="give-hero-cta"
            href={GIVE_PUSHPAY_URL}
            label="Give Now"
            external
            className="btn btn-primary btn-lg"
            style={{ marginTop: "var(--s-2)", alignSelf: "flex-start" }}
          />
        </Stack>
      </div>
    </section>
  );
}
