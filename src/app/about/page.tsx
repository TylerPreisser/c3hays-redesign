import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about the story, mission, and values of Celebration Community Church — ${site.mission}`,
};

const values = [
  {
    title: "Scripture First",
    body: "Everything we do is anchored in the Bible — God's Word is our authority for faith, practice, and community life.",
  },
  {
    title: "Jesus-Centered Worship",
    body: "We believe worship is more than music. It's a way of life that puts Jesus at the center of everything.",
  },
  {
    title: "Authentic Community",
    body: "We weren't meant to do life alone. Small groups, friendships, and belonging are part of the C3 DNA.",
  },
  {
    title: "Generosity",
    body: "God is generous — and His people are too. We steward our time, talent, and treasure for His kingdom.",
  },
  {
    title: "Serving Others",
    body: "We take the love of Christ outside our walls — into Hays, Colby, and to the ends of the earth.",
  },
  {
    title: "Every Generation",
    body: "From kids to seniors, we believe every age has a role to play in building the church Jesus is building.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex items-end overflow-hidden" style={{ minHeight: "56vh" }}>
        <div className="absolute inset-0">
          <Image
            src="/images/congregation.webp"
            alt="C3 congregation"
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{ background: "rgba(10,10,10,0.58)" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,10,0.80) 0%, rgba(10,10,10,0.2) 60%, transparent 100%)",
            }}
          />
        </div>
        <div className="relative z-10 container-c3 pb-16 pt-40">
          <p className="overline mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>Our Story</p>
          <h1 className="display-1 text-white text-balance">About C3</h1>
        </div>
      </section>

      {/* Mission */}
      <section className="section" style={{ backgroundColor: "#f2efed" }}>
        <div className="container-c3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="overline mb-4" style={{ color: "rgba(35,46,44,0.45)" }}>Our Mission</p>
              <h2 className="display-2 mb-6 text-balance" style={{ color: "#232e2c" }}>
                We exist to{" "}
                <em className="not-italic" style={{ color: "#10405D" }}>Meet.</em>{" "}
                <em className="not-italic" style={{ color: "#10405D" }}>Grow.</em>{" "}
                <em className="not-italic" style={{ color: "#10405D" }}>Serve.</em>
              </h2>
              <p className="body-lg mb-5" style={{ color: "rgba(35,46,44,0.7)" }}>
                {site.mission}
              </p>
              <p className="body-base mb-5" style={{ color: "rgba(35,46,44,0.65)" }}>
                Celebration Community Church began with a simple conviction: that
                the local church matters. That when people gather in the name of
                Jesus, lives change. Families are restored. Communities are
                transformed.
              </p>
              <p className="body-base mb-10" style={{ color: "rgba(35,46,44,0.65)" }}>
                From our roots in Hays, Kansas, we&apos;ve grown into a multi-campus
                church family that spans northwest Kansas — with one vision, one
                mission, and one King.
              </p>
              <Link href="/beliefs/" className="btn btn-primary btn-lg">
                What We Believe
              </Link>
            </div>
            <div className="relative overflow-hidden" style={{ height: 480, borderRadius: 0 }}>
              <Image
                src="/images/gather.webp"
                alt="Church gathering"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ backgroundColor: "#232e2c" }}>
        <div className="container-c3">
          <div className="max-w-xl mb-14">
            <p className="overline mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>What Drives Us</p>
            <h2 className="display-2 text-white">Our Values</h2>
          </div>
          {/* Values grid — outline container, inner cell borders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
            {values.map((v, i) => (
              <div
                key={i}
                className="p-8"
                style={{
                  borderBottom: i < values.length - 3 ? "1px solid rgba(255,255,255,0.08)" : undefined,
                  borderRight: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span
                  className="block text-xs font-bold uppercase tracking-widest mb-5"
                  style={{ color: "#10405D" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="heading-3 text-white mb-3">{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ backgroundColor: "#f2efed" }}>
        <div className="container-c3 text-center max-w-2xl">
          <p className="overline mb-4" style={{ color: "rgba(35,46,44,0.45)" }}>Come As You Are</p>
          <h2 className="display-2 mb-5" style={{ color: "#232e2c" }}>Ready to visit?</h2>
          <p className="body-lg mb-10" style={{ color: "rgba(35,46,44,0.65)" }}>
            We&apos;d love to meet you. No pressure, no dress code — just come.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/visit/" className="btn btn-primary btn-lg">
              Plan Your Visit
            </Link>
            <Link href="/connect/" className="btn btn-outline-navy btn-lg">
              Fill Out a Connect Card
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
