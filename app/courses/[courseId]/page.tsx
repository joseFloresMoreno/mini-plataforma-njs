"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { CourseViewer } from "@/components/course-viewer";
import { SiteHeader } from "@/components/site-header";
import type { Course } from "@/lib/lms-data";

type CoursePageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

type CoursePageData = {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  course: Course;
  summary: {
    completedSectionIds: string[];
    progressPercent: number;
  };
};

export default function CoursePage({ params }: CoursePageProps) {
  const router = useRouter();
  const { courseId } = use(params);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CoursePageData | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("lms_user");
      if (!storedUser) {
        router.replace("/login");
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      fetch(`/api/course-data?userId=${parsedUser.id}&courseId=${courseId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load");
          return res.json();
        })
        .then((payload) => {
          setData(payload);
          setLoading(false);
        })
        .catch(() => {
          router.replace("/dashboard");
        });
    } catch {
      router.replace("/login");
    }
  }, [router, courseId]);

  if (loading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="text-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto" />
          <p className="text-sm text-slate-500 font-semibold">Cargando curso...</p>
        </div>
      </div>
    );
  }

  const { user, course, summary } = data;

  return (
    <div>
      <SiteHeader
        brand="Mini-Plataforma"
        subtitle={`Curso: ${course.title}`}
        actions={[
          { href: "/dashboard", label: "← Volver a cursos" },
          { href: "/api/auth/logout", label: "Cerrar sesión" },
        ]}
      />
      <main className="px-6 py-8 sm:px-10 lg:px-12">
        <section className="mx-auto w-full max-w-7xl">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-700">
              Visor de Curso
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-4xl">
              {course.title}
            </h1>
          </div>

          <CourseViewer
            course={course}
            userId={user.id}
            initialCompletedSectionIds={summary.completedSectionIds}
            initialActiveSectionId={course.modules[0]?.sections[0]?.id || ""}
          />
        </section>
      </main>
    </div>
  );
}
