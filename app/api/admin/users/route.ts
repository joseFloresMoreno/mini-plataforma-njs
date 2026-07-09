import { NextResponse } from "next/server";
import { getDemoUserById, getAllUsers, getDashboardCourses } from "@/lib/lms-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const adminId = searchParams.get("adminId");

  if (!adminId) {
    return NextResponse.json({ error: "adminId is required" }, { status: 400 });
  }

  const admin = await getDemoUserById(adminId);
  if (!admin || admin.role !== "admin") {
    return NextResponse.json(
      { error: "Acceso denegado. Se requieren permisos de administrador." },
      { status: 403 },
    );
  }

  const allUsers = await getAllUsers();
  const usersWithProgress = await Promise.all(
    allUsers.map(async (user) => {
      // Calculate dashboard courses progress for this user
      const coursesProgress = await getDashboardCourses(user.id);
      
      const enrolledCourses = coursesProgress.map((cp) => ({
        courseId: cp.id,
        courseTitle: cp.title,
        progressPercent: cp.progressPercent,
        completedSections: cp.completedSections,
        totalSections: cp.totalSections,
      }));

      // Average progress across enrolled courses
      const averageProgress = enrolledCourses.length === 0
        ? 0
        : Math.round(enrolledCourses.reduce((sum, c) => sum + c.progressPercent, 0) / enrolledCourses.length);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        enrolledCourses,
        averageProgress,
      };
    })
  );

  return NextResponse.json({ users: usersWithProgress });
}
