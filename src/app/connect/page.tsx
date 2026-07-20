import type { Metadata } from "next";
import { getPageContent } from "@/lib/cms";
import { parseSections, type SectionMeta } from "@/lib/home-content";
import PageComposer from "@/components/cms/PageComposer";
import { ConnectHero, ConnectSteps } from "./ConnectClient";

export const metadata: Metadata = {
  title: "Connect | C3 Hays",
  description:
    "Take your next step at C3 — new here, looking for community, want to serve, or just want to say hi. We'd love to hear from you.",
};

/**
 * /connect is now an EDITOR-NATIVE, section-composed page (contract 2026-07-20):
 * two ordered/recolorable sections driven through the shared PageComposer, exactly
 * like home. Section ids MUST match c3-backend `defaultSectionsForSlug("/connect")`.
 */
const PAGE_DEFAULT_SECTIONS: SectionMeta[] = [
  { id: "connect-hero", visible: true },
  { id: "connect-steps", visible: true },
];

export default async function ConnectPage({
  searchParams,
}: {
  // Preview mode (U6): the editor iframe carries `?cmsEdit=1&preview=<token>`.
  // A tokenless/public request never receives a token here, so it never gets draft.
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Preview only exists in the CMS_LIVE server runtime. In the static-export build
  // CMS_LIVE is unset, so we must NOT read searchParams (that forces dynamic
  // rendering and breaks `output: export`). Export ⇒ published, byte-identical.
  const cmsLive = process.env.CMS_LIVE === "1";
  const sp = cmsLive && searchParams ? await searchParams : {};
  const preview = typeof sp.preview === "string" ? sp.preview : undefined;

  const ov = (await getPageContent("/connect", preview)) || {};
  const text = ov.text || {};
  const media = ov.media || {};
  const img = ov.img || {};
  const sections = parseSections(ov.sections, PAGE_DEFAULT_SECTIONS);

  // Each section id → its component. PageComposer wraps each in a
  // `<div data-section={id}>` (rail-driven section bg) and injects buildBgCss.
  const render = (id: string): React.ReactNode => {
    switch (id) {
      case "connect-hero":
        return <ConnectHero text={text} media={media} img={img} />;
      case "connect-steps":
        return <ConnectSteps text={text} />;
      default:
        return null;
    }
  };

  return <PageComposer sections={sections} bgFill={ov.bgFill} anim={ov.anim} render={render} />;
}
