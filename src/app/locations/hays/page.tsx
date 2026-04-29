import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Navigation, Phone, Mail } from "lucide-react";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Hays Campus",
  description:
    "Celebration Community Church — Hays, Kansas. Saturday 5 PM and Sunday 8, 9:30, and 11 AM at 5790 230th Ave.",
};

export default function HaysCampusPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-72 md:min-h-96 flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/exterior.webp"
            alt="C3 Hays campus"
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,31,46,0.92) 0%, rgba(10,31,46,0.5) 60%, rgba(10,31,46,0.2) 100%)",
            }}
          />
        </div>
        <div className="relative z-10 container-c3 pb-14 pt-28">
          <Link
            href="/locations/"
            className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white mb-5 transition-colors"
          >
            ← Campuses
          </Link>
          <p className="overline text-[#d4a056] mb-3">Campus</p>
          <h1 className="display-1 text-white">Hays</h1>
        </div>
      </section>

      {/* Details */}
      <section className="section bg-[#fdfcfb]">
        <div className="container-c3">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main info */}
            <div className="lg:col-span-2">
              <h2 className="heading-1 text-[#0e1b26] mb-4">
                Our main campus
              </h2>
              <p className="body-lg text-[#3d5566] mb-5">
                Our Hays campus is home base — where C3 began and where
                we continue to grow. Four weekend services give you
                options that fit your schedule. Whether you&apos;re a first-time
                guest or a decades-long family, you belong here.
              </p>
              <p className="body-base text-[#3d5566] mb-8">
                Kids programming runs during all services for infants through
                5th grade. Student ministry meets on Friday evenings. Come
                check us out — we&apos;re glad you&apos;re here.
              </p>
              <Link href="/visit/" className="btn btn-primary btn-lg">
                Plan Your Visit
              </Link>
            </div>

            {/* Info sidebar */}
            <div className="flex flex-col gap-5">
              <div className="card p-6">
                <h3 className="font-medium text-[#0e1b26] mb-4">
                  Service Times
                </h3>
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-start gap-2.5">
                    <Clock size={14} className="text-[#10405d] mt-0.5 shrink-0" />
                    <div className="text-sm text-[#3d5566]">
                      <p className="font-medium text-[#0e1b26]">Saturday</p>
                      <p>5:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Clock size={14} className="text-[#10405d] mt-0.5 shrink-0" />
                    <div className="text-sm text-[#3d5566]">
                      <p className="font-medium text-[#0e1b26]">Sunday</p>
                      <p>8:00 AM · 9:30 AM · 11:00 AM</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="font-medium text-[#0e1b26] mb-4">
                  Location
                </h3>
                <div className="flex items-start gap-2.5 mb-4">
                  <MapPin size={14} className="text-[#10405d] mt-0.5 shrink-0" />
                  <address className="not-italic text-sm text-[#3d5566]">
                    {site.address.street}
                    <br />
                    {site.address.city}, {site.address.state}{" "}
                    {site.address.zip}
                  </address>
                </div>
                <a
                  href="https://maps.google.com/?q=5790+230th+Ave,+Hays,+KS+67601"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-navy btn-sm inline-flex items-center gap-1.5 w-full justify-center"
                >
                  <Navigation size={13} />
                  Get Directions
                </a>
              </div>

              <div className="card p-6">
                <h3 className="font-medium text-[#0e1b26] mb-4">
                  Contact
                </h3>
                <div className="flex flex-col gap-3">
                  <a
                    href={`tel:${site.phone.replace(/\D/g, "")}`}
                    className="flex items-center gap-2.5 text-sm text-[#3d5566] hover:text-[#10405d] transition-colors"
                  >
                    <Phone size={14} className="text-[#10405d]" />
                    {site.phone}
                  </a>
                  <a
                    href={`mailto:${site.email}`}
                    className="flex items-center gap-2.5 text-sm text-[#3d5566] hover:text-[#10405d] transition-colors"
                  >
                    <Mail size={14} className="text-[#10405d]" />
                    {site.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map embed placeholder */}
      <section className="bg-[#f7f4ef] py-0">
        <div className="container-c3 py-6">
          <div
            className="rounded-2xl overflow-hidden h-72 bg-[#bdd9ea]/30 flex items-center justify-center"
            aria-label="Campus map"
          >
            <a
              href="https://maps.google.com/?q=5790+230th+Ave,+Hays,+KS+67601"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg inline-flex items-center gap-2"
            >
              <Navigation size={16} />
              Open in Google Maps
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
