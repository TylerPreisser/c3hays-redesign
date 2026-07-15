"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/**
 * /news has been repurposed into the Newsletter surface. This route redirects to
 * /newsletter. We do a CLIENT redirect (router.replace) + a visible fallback link
 * so it compiles in BOTH the static-export (GitHub Pages) and the CMS_LIVE server
 * build — a server-side redirect() is not allowed under `output: "export"`.
 */
export default function NewsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/newsletter/");
  }, [router]);

  return (
    <section className="section" style={{ backgroundColor: "#f6f6f6", minHeight: "60vh", display: "flex", alignItems: "center" }}>
      <div className="container-c3 text-center">
        <p className="body-lg" style={{ color: "rgba(27,28,28,0.6)" }}>
          Taking you to the newsletter&hellip;{" "}
          <Link href="/newsletter/" style={{ color: "var(--color-teal-deep, #179c8c)", fontWeight: 600 }}>
            Go to the C3 Weekly
          </Link>
        </p>
      </div>
    </section>
  );
}
