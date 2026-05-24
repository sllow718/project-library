import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { configured: false, message: "ADMIN_PASSWORD is not set" },
      { status: 200 }
    );
  }

  const session = await getSession();
  if (session.isAuthenticated) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
