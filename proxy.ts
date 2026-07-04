import { NextRequest, NextResponse } from "next/server";

function unauthorized() {
  return new NextResponse("Autenticación requerida", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="FinTrack"' },
  });
}

export default function proxy(request: NextRequest) {
  const user = process.env.DASHBOARD_USER;
  const password = process.env.DASHBOARD_PASSWORD;

  // Fail closed: if credentials aren't configured, block access rather than
  // silently exposing real financial data.
  if (!user || !password) return unauthorized();

  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) return unauthorized();

  const [suppliedUser, suppliedPassword] = atob(auth.slice(6)).split(":");
  if (suppliedUser !== user || suppliedPassword !== password) {
    return unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
