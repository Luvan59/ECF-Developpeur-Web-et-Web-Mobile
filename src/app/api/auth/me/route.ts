import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Non connecté" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const { payload } = await jwtVerify(token, secret);

    return NextResponse.json({
      id: payload.id,
      email: payload.email,
      prenom: payload.prenom,
      nom: payload.nom,
      role: payload.role,
    });
  } catch {
    return NextResponse.json({ message: "Session invalide" }, { status: 401 });
  }
}
