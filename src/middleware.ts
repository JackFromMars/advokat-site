import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MAIN_DOMAIN = "advokat-profi.com.ua";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  // Redirect any non-main domain to the main domain
  if (host !== MAIN_DOMAIN && host !== `www.${MAIN_DOMAIN}` && !host.includes("localhost")) {
    const url = new URL(request.url);
    url.hostname = MAIN_DOMAIN;
    url.port = "";
    return NextResponse.redirect(url.toString(), 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico|images|data).*)",
};
