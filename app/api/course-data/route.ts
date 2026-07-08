import { NextResponse } from "next/server";
import { getCourseById, getCourseProgressSummary, getDemoUserById } from "@/lib/lms-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const courseId = searchParams.get("courseId");

  if (!userId || !courseId) {
    return NextResponse.json({ error: "userId and courseId are required" }, { status: 400 });
  }

  const user = getDemoUserById(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!user.enrolledCourseIds.includes(courseId)) {
    return NextResponse.json({ error: "User not enrolled in this course" }, { status: 403 });
  }

  const course = getCourseById(courseId);
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  const summary = await getCourseProgressSummary(userId, courseId);

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    course,
    summary,
  });
}
