// Staging only: a build made with SITE_NOINDEX=1 answers a disallow-all robots.txt. Any other build has none (404), as before.
export const dynamic = "force-static";

export function GET() {
  if (process.env.SITE_NOINDEX !== "1") return new Response("Not found", { status: 404 });
  return new Response("User-agent: *\nDisallow: /\n", { headers: { "content-type": "text/plain; charset=utf-8" } });
}
