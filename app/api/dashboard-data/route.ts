import { NextResponse } from "next/server";
import { getDashboardCourses, getDemoUserById } from "@/lib/lms-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const user = getDemoUserById(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const courses = await getDashboardCourses(userId);
  const totalProgress =
    courses.length === 0
      ? 0
      : Math.round(
          courses.reduce((sum, course) => sum + course.progressPercent, 0) /
            courses.length,
        );
  const totalCompletedSections = courses.reduce(
    (sum, course) => sum + course.completedSections,
    0,
  );
  const currentCourse = courses[0];
  const nextLesson = currentCourse?.nextSectionTitle ?? "Sin curso asignado";

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    courses,
    totalProgress,
    totalCompletedSections,
    nextLesson,
  });
}
