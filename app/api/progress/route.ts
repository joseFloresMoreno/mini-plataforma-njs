import { NextResponse } from "next/server";
import { saveSectionProgress } from "@/lib/lms-data";

type ProgressBody = {
  userId?: string;
  courseId?: string;
  sectionId?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as ProgressBody | null;

    if (!body?.userId || !body?.courseId || !body?.sectionId) {
      return NextResponse.json(
        { error: "Faltan parámetros requeridos: userId, courseId, sectionId." },
        { status: 400 },
      );
    }

    const updatedProgress = await saveSectionProgress(
      body.userId,
      body.courseId,
      body.sectionId,
    );

    return NextResponse.json({ success: true, progress: updatedProgress });
  } catch (error) {
    console.error("API error updating progress:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 },
    );
  }
}
