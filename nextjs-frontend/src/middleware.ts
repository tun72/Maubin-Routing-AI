import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: [
    "/",
    "/(en|mm)/:path*",
    "/home",
    "/(en|mm)/:path*",
    "/new-place",
    "/(en|mm)/:path",
    "/admin",
    "/(en|mm)/:path",
    "/(login|signup)",
    "/(en|mm)/:path",
    "/admin/:path",
    "/map/:path",
    "/admin/:path/:path",
    "/admin/:path/:path/:path",
  ],
};
