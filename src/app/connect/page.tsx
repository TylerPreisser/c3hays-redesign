import type { Metadata } from "next";
import { getCMSPage } from "@/lib/cms";
import ConnectClient from "./ConnectClient";

export const metadata: Metadata = {
  title: "Connect | C3 Hays",
  description:
    "Take your next step at C3 — new here, looking for community, want to serve, or just want to say hi. We'd love to hear from you.",
};

export default async function ConnectPage() {
  const ov = (await getCMSPage("/connect")) || {};
  const t = ov.text || {};
  const media = ov.media || {};
  const img = ov.img || {};

  // The full-bleed photo + glass contact card is the whole hero now, so the
  // background image (data-cms-img="connect-hero-bg") is rendered inside the
  // client composition — CMS media/img overrides are passed straight through.
  return <ConnectClient text={t} media={media} img={img} />;
}
