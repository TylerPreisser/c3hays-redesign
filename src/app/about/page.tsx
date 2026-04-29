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
      <section className="relative min-h-72 md:min-h-96 flex items-end overflow-hidden">
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
            style={{
              background:
                "linear-gradient(to top, rgba(10,31,46,0.92) 0%, rgba(10,31,46,0.55) 60%, rgba(10,31,46,0.25) 100%)",
            }}
          />
        </div>
        <div className="relative z-10 container-c3 pb-14 pt-32">
          <p className="overline text-[#d4a056] mb-3">Our Story</p>
          <h1 className="display-1 text-white text-balance">About C3</h1>
        </div>
      </section>

      {/* Mission */}
      <section className="section bg-[#fdfcfb]">
        <div className="container-c3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="overline text-[#10405d]/60 mb-4">Our Mission</p>
              <h2 className="display-2 text-[#0e1b26] mb-6 text-balance">
                We exist to{" "}
                <span className="text-[#10405d]">Meet.</span>{" "}
                <span className="text-[#10405d]">Grow.</span>{" "}
                <span className="text-[#10405d]">Serve.</span>
              </h2>
              <p className="body-lg text-[#3d5566] mb-5">
                {site.mission}
              </p>
              <p className="body-base text-[#3d5566] mb-5">
                Celebration Community Church began with a simple conviction: that
                the local church matters. That when people gather in the name of
                Jesus, lives change. Families are restored. Communities are
                transformed.
              </p>
              <p className="body-base text-[#3d5566] mb-8">
                From our roots in Hays, Kansas, we&apos;ve grown into a multi-campus
                church family that spans northwest Kansas — with one vision, one
                mission, and one King.
              </p>
              <Link href="/beliefs/" className="btn btn-primary btn-lg">
                What We Believe
              </Link>
            </div>
            <div className="relative h-80 lg:h-[480px] rounded-2xl overflow-hidden">
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
      <section className="section bg-[#f7f4ef]">
        <div className="container-c3">
          <div className="max-w-xl mb-14">
            <p className="overline text-[#10405d]/60 mb-3">What Drives Us</p>
            <h2 className="display-2 text-[#0e1b26]">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div key={i} className="card p-7">
                <div className="w-8 h-8 rounded-lg bg-[#10405d]/8 flex items-center justify-center mb-5">
                  <span className="text-sm font-medium text-[#10405d]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-medium text-[#0e1b26] mb-2">{v.title}</h3>
                <p className="text-sm text-[#3d5566] leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-[#0a1f2e]">
        <div className="container-c3 text-center max-w-2xl">
          <p className="overline text-[#d4a056] mb-4">Come As You Are</p>
          <h2 className="display-2 text-white mb-5">Ready to visit?</h2>
          <p className="body-lg text-white/65 mb-8">
            We&apos;d love to meet you. No pressure, no dress code — just come.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/visit/" className="btn btn-gold btn-lg">
              Plan Your Visit
            </Link>
            <Link href="/connect/" className="btn btn-outline btn-lg">
              Fill Out a Connect Card
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
