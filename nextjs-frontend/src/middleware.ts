import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: [
    "/",
    "/home",
    "/new-place",
    "/admin",
    "/admin/:path",
    "/admin/:path/:path",
    "/map/:path",
    "/(login|signup)",
    "/(en|mm)/:path",
  ],
};
