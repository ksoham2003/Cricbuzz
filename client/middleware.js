//Route protection

import { NextResponse } from "next/server";

export function middleware(request) {
  const role = request.cookies.get("role")?.value;

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}