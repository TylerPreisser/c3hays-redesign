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
 * give-hero — the page thesis: "Your giving is changing the world," the real
 * why-we-give lead, and the primary Give CTA. A congregation photo behind a neutral
 * grade (editable via `data-cms-img="give-hero-bg"`) that dissolves into the WHITE
 * canvas below, so the hero and the give-ways section read as one continuous page
 * (both surfaces are #ffffff — no seam).
 *
 * One editable button: the teal primary → the real Pushpay giving page. Text is the
 * real celebratejesus.org /give copy.
 */
export default function GiveHero({ t, media, img }: GiveHeroProps) {
  return (
    <section className="relative flex items-end overflow-hidden" style={{ minHeight: "62vh" }}>
      {/* Editable photo treatment. */}
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
        {/* Neutral grade — quiet, not a loud dark scrim; blends into the white below. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(10,10,10,0.86) 0%, rgba(10,10,10,0.46) 52%, rgba(10,10,10,0.20) 100%)",
          }}
        />
        {/* Dissolve into the WHITE give-ways surface below so the seam disappears. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0"
          style={{ height: "34%", background: "linear-gradient(to top, #ffffff 2%, transparent 100%)" }}
        />
      </div>

      <div className="relative z-10 container-c3 pb-16 pt-40">
        <Stack gap="heading" style={{ maxWidth: "36rem" }}>
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
            style={{ color: "rgba(255,255,255,0.74)", maxWidth: "32rem" }}
          />
          <div
            className="flex flex-wrap items-center"
            style={{ gap: "var(--s-4)", marginTop: "var(--s-2)" }}
          >
            <EditableLink
              text={t}
              k="give-hero-cta"
              href={GIVE_PUSHPAY_URL}
              label="Give Now"
              external
              className="btn btn-primary btn-lg"
            />
          </div>
        </Stack>
      </div>
    </section>
  );
}
