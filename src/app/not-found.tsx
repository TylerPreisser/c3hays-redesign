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
          style={{
            background: "rgba(10,31,46,0.88)",
          }}
        />
      </div>

      <div className="relative z-10 container-c3 text-center py-20">
        <p className="overline text-[#d4a056] mb-4">404</p>
        <h1 className="display-1 text-white mb-4">Page not found</h1>
        <p className="body-lg text-white/65 mb-10 max-w-md mx-auto">
          That page doesn&apos;t exist — but you&apos;re still welcome here.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/" className="btn btn-gold btn-lg">
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
