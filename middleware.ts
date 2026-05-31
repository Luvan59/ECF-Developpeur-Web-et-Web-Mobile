import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = {
  USER: ["/account"],
  EMPLOYEE: ["/employee"],
  ADMIN: ["/admin"],
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const pathname = request.nextUrl.pathname;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const role = payload.role as string;

    if (pathname.startsWith("/account") && role !== "USER") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (
      pathname.startsWith("/employee") &&
      role !== "EMPLOYEE" &&
      role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/account/:path*", "/employee/:path*", "/admin/:path*"],
};
