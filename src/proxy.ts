import { NextResponse, type NextRequest } from "next/server";

/**
 * Hands the root layout two things it cannot read itself (a layout receives no search params and no URL):
 * the editor's `?preview=` token and the path being rendered. They travel as REQUEST headers inside this server,
 * never on the response, so the token is not echoed back and never lands in a Referer or a cache key.
 *
 * Only the live (server) build uses this; the static export has no request to read.
 */
export function proxy(req: NextRequest) {
  const headers = new Headers(req.headers);
  headers.delete("x-c3-preview"); // never trust a caller-supplied copy
  headers.delete("x-c3-path");
  const token = req.nextUrl.searchParams.get("preview");
  if (token && token.length <= 2048 && /^[A-Za-z0-9._~+/=-]+$/.test(token)) headers.set("x-c3-preview", token);
  headers.set("x-c3-path", req.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  // Pages only: not assets, not Next internals, not the API routes.
  matcher: ["/((?!api/|_next/|images/|brand/|.*\\..*).*)"],
};
