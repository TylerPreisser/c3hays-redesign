import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <section
      className="relative flex items-center justify-center overflow-hidden"
      style={{ minHeight: "100dvh" }}
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-2.webp"
          alt="C3 worship"
          fill
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "rgba(10,10,10,0.78)" }}
        />
      </div>

      <div className="relative z-10 container-c3 text-center py-20">
        <p className="overline mb-4" style={{ color: "#1cc3af" }}>404</p>
        <h1 className="display-1 text-white mb-5">Page not found</h1>
        <p className="body-lg mb-12 max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.65)" }}>
          That page doesn&apos;t exist — but you&apos;re still welcome here.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/" className="btn btn-primary btn-lg">
            Go Home
          </Link>
          <Link href="/visit/" className="btn btn-outline btn-lg">
            Plan a Visit
          </Link>
        </div>
      </div>
    </section>
  );
}
