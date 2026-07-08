import { NextResponse } from "next/server";
import { getDemoUserById, saveDbUser } from "@/lib/lms-data";
import { pickSessionUser } from "@/lib/auth";

type EnrollBody = {
  userId?: string;
  courseId?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as EnrollBody | null;

  if (!body?.userId || !body?.courseId) {
    return NextResponse.json(
      { error: "userId and courseId are required" },
      { status: 400 },
    );
  }

  const user = await getDemoUserById(body.userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!user.enrolledCourseIds.includes(body.courseId)) {
    user.enrolledCourseIds.push(body.courseId);
    await saveDbUser(user);
  }

  return NextResponse.json({
    user: pickSessionUser(user),
  });
}
