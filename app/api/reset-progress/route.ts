import { NextResponse } from "next/server";
import { getDemoUserById, resetUserProgress } from "@/lib/lms-data";

type ResetBody = {
  userId?: string;
  courseId?: string;
  adminId?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ResetBody | null;

  if (!body?.userId || !body?.courseId || !body?.adminId) {
    return NextResponse.json(
      { error: "userId, courseId, and adminId are required" },
      { status: 400 },
    );
  }

  const admin = await getDemoUserById(body.adminId);
  if (!admin || admin.role !== "admin") {
    return NextResponse.json(
      { error: "Acceso denegado. Se requieren permisos de administrador." },
      { status: 403 },
    );
  }

  try {
    await resetUserProgress(body.userId, body.courseId);
  } catch (e) {
    return NextResponse.json({ error: "Error al borrar en la base de datos." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
