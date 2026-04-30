import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Smile, Users, Baby, Shirt } from "lucide-react";
import { locations } from "@/data/locations";

export const metadata: Metadata = {
  title: "Plan Your Visit",
  description:
    "Everything you need to know before your first visit to Celebration Community Church in Hays or Colby, Kansas.",
};

const whatToExpect = [
  {
    icon: Clock,
    title: "How long is a service?",
    body: "Services are typically 60–70 minutes — worship, a practical message from Scripture, and communion on the first Sunday of the month.",
  },
  {
    icon: Shirt,
    title: "What should I wear?",
    body: "Come as you are — seriously. You'll see jeans, boots, and dress clothes all in the same row. There is no dress code at C3.",
  },
  {
    icon: Baby,
    title: "What about my kids?",
    body: "We have programming for every age, birth through 5th grade, during all services. Student ministry meets on Friday evenings.",
  },
  {
    icon: Smile,
    title: "What if I'm not a Christian?",
    body: "Perfect — come anyway. We're a church full of imperfect people on a journey. You won't be called out, embarrassed, or pressured.",
  },
  {
    icon: Users,
    title: "Can I bring a friend?",
    body: "Please do. There's always room for one more. C3 is at its best when it's full of people experiencing Jesus for the first time.",
  },
  {
    icon: MapPin,
    title: "Where do I park?",
    body: "Ample free parking at both campuses. Look for first-time guest parking spots near the main entrance — they're saved for you.",
  },
];

export default function VisitPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative flex items-end overflow-hidden" style={{ minHeight: "60vh" }}>
        <div className="absolute inset-0">
          <Image
            src="/images/hero-2.webp"
            alt="Family arriving at C3"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0" style={{ background: "rgba(10,10,10,0.55)" }} />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.2) 60%, transparent 100%)",
            }}
          />
        </div>
        <div className="relative z-10 container-c3 pb-20 pt-40">
          <p className="overline mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>First Visit</p>
          <h1 className="display-1 text-white text-balance">Plan your first visit.</h1>
          <p className="body-lg mt-5 max-w-lg" style={{ color: "rgba(255,255,255,0.65)" }}>
            What to expect when you walk through our doors.
          </p>
        </div>
      </section>

      {/* What to expect */}
      <section className="section" style={{ backgroundColor: "#ffffff" }}>
        <div className="container-c3">
          <div className="max-w-xl mb-16">
            <p className="overline mb-4" style={{ color: "rgba(27,28,28,0.4)" }}>What to Expect</p>
            <h2 className="display-2 text-balance" style={{ color: "#1b1c1c" }}>
              No surprises. Just welcome.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-8">
            {whatToExpect.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title}>
                  <div className="mb-5">
                    <Icon size={28} style={{ color: "#1cc3af" }} strokeWidth={1.5} />
                  </div>
                  <h3 className="heading-3 mb-3" style={{ color: "#1b1c1c" }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(27,28,28,0.65)" }}>
                    {item.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service times */}
      <section className="section" style={{ backgroundColor: "#1b1c1c" }}>
        <div className="container-c3">
          <div className="max-w-xl mb-12">
            <p className="overline mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>Times &amp; Locations</p>
            <h2 className="heading-1 text-white">When do services meet?</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 max-w-3xl"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
            {locations.map((loc, i) => (
              <div
                key={loc.id}
                className="p-8"
                style={{ borderRight: i === 0 ? "1px solid rgba(255,255,255,0.1)" : "none" }}
              >
                <h3 className="font-bold text-sm uppercase tracking-widest mb-5" style={{ color: "#1cc3af" }}>
                  {loc.name} Campus
                </h3>
                <div className="flex items-start gap-3 mb-4">
                  <MapPin size={14} style={{ color: "rgba(255,255,255,0.4)", marginTop: 2 }} className="shrink-0" />
                  <address className="not-italic text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                    {loc.street}, {loc.city}, {loc.state} {loc.zip}
                  </address>
                </div>
                <div className="flex flex-col gap-2 mb-6">
                  {loc.services.map((s) => (
                    <div key={s.day} className="flex items-center gap-2.5">
                      <Clock size={13} style={{ color: "rgba(255,255,255,0.35)" }} />
                      <span className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                        <strong className="text-white font-semibold">{s.day}:</strong>{" "}
                        {s.times.join(" · ")}
                      </span>
                    </div>
                  ))}
                </div>
                <a
                  href={loc.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm inline-flex items-center gap-1.5"
                >
                  <MapPin size={13} />
                  Directions
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Connect CTA */}
      <section className="section" style={{ backgroundColor: "#ffffff" }}>
        <div className="container-c3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="overline mb-4" style={{ color: "rgba(27,28,28,0.4)" }}>Let Us Know You&apos;re Coming</p>
              <h2 className="display-2 mb-5 text-balance" style={{ color: "#1b1c1c" }}>
                We&apos;re saving you a seat.
              </h2>
              <p className="body-lg mb-10" style={{ color: "rgba(27,28,28,0.65)" }}>
                Fill out a quick connect card and we&apos;ll send you everything
                you need to know before Sunday. No spam, ever.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/connect/" className="btn btn-primary btn-lg">
                  Fill Out a Connect Card
                </Link>
                <Link href="/messages/" className="btn btn-outline-navy btn-lg">
                  Watch Online First
                </Link>
              </div>
            </div>
            <div className="relative overflow-hidden" style={{ height: 400 }}>
              <Image
                src="/images/congregation.webp"
                alt="Warm welcome at C3"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
