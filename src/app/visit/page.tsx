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
    body: "Come as you are — seriously. You'll see jeans, boots, and dress clothes all in the same row. There&apos;s no dress code at C3.",
  },
  {
    icon: Baby,
    title: "What about my kids?",
    body: "We have programming for every age, birth through 5th grade, during all services. Student ministry meets on Friday evenings.",
  },
  {
    icon: Smile,
    title: "What if I&apos;m not a Christian?",
    body: "Perfect — come anyway. We&apos;re a church full of imperfect people on a journey. You won&apos;t be called out, embarrassed, or pressured.",
  },
  {
    icon: Users,
    title: "Can I bring a friend?",
    body: "Please do. There&apos;s always room for one more. C3 is at its best when it&apos;s full of people experiencing Jesus for the first time.",
  },
  {
    icon: MapPin,
    title: "Where do I park?",
    body: "Ample free parking at both campuses. Look for first-time guest parking spots near the main entrance — they&apos;re saved for you.",
  },
];

export default function VisitPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-72 md:min-h-96 flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-1.webp"
            alt="Welcoming church lobby"
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,31,46,0.95) 0%, rgba(10,31,46,0.6) 55%, rgba(10,31,46,0.2) 100%)",
            }}
          />
        </div>
        <div className="relative z-10 container-c3 pb-14 pt-28">
          <p className="overline text-[#d4a056] mb-3">First Visit</p>
          <h1 className="display-1 text-white">Plan Your Visit</h1>
          <p className="body-lg text-white/65 mt-4 max-w-lg">
            We want your first visit to feel easy. Here&apos;s everything you need to
            know before you walk through the door.
          </p>
        </div>
      </section>

      {/* What to expect */}
      <section className="section bg-[#fdfcfb]">
        <div className="container-c3">
          <div className="max-w-xl mb-14">
            <p className="overline text-[#10405d]/60 mb-3">What to Expect</p>
            <h2 className="display-2 text-[#0e1b26]">
              No surprises.
              <br />
              Just welcome.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whatToExpect.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="card p-7">
                  <div className="w-11 h-11 rounded-xl bg-[#10405d]/8 flex items-center justify-center mb-5">
                    <Icon size={19} className="text-[#10405d]" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-medium text-[#0e1b26] mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#3d5566] leading-relaxed">
                    {item.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service times by campus */}
      <section className="section bg-[#f7f4ef]">
        <div className="container-c3">
          <div className="max-w-xl mb-12">
            <p className="overline text-[#10405d]/60 mb-3">Times &amp; Locations</p>
            <h2 className="heading-1 text-[#0e1b26]">When do services meet?</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {locations.map((loc) => (
              <div key={loc.id} className="card p-7">
                <h3 className="heading-3 text-[#0e1b26] mb-4">
                  {loc.name} Campus
                </h3>
                <div className="flex items-start gap-2.5 mb-4">
                  <MapPin size={15} className="text-[#10405d] mt-0.5 shrink-0" />
                  <address className="not-italic text-sm text-[#3d5566]">
                    {loc.street}, {loc.city}, {loc.state} {loc.zip}
                  </address>
                </div>
                <div className="flex flex-col gap-2 mb-6">
                  {loc.services.map((s) => (
                    <div key={s.day} className="flex items-center gap-2.5">
                      <Clock size={13} className="text-[#10405d]" />
                      <span className="text-sm text-[#3d5566]">
                        <strong className="text-[#0e1b26]">{s.day}:</strong>{" "}
                        {s.times.join(" · ")}
                      </span>
                    </div>
                  ))}
                </div>
                <a
                  href={loc.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-navy btn-sm inline-flex items-center gap-1.5"
                >
                  <MapPin size={13} />
                  Get Directions
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Connect CTA */}
      <section className="section bg-[#0a1f2e]">
        <div className="container-c3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="overline text-[#d4a056] mb-4">Let Us Know You&apos;re Coming</p>
              <h2 className="display-2 text-white mb-5">
                We&apos;re saving you a seat.
              </h2>
              <p className="body-lg text-white/65 mb-8">
                Fill out a quick connect card and we&apos;ll send you everything
                you need to know before Sunday. No spam, ever.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/connect/" className="btn btn-gold btn-lg">
                  Fill Out a Connect Card
                </Link>
                <Link href="/messages/" className="btn btn-outline btn-lg">
                  Watch Online First
                </Link>
              </div>
            </div>
            <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden">
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
