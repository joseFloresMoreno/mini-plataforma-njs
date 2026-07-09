"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Course } from "@/lib/lms-data";

type CertificatePageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

type CertificateData = {
  user: {
    id: string;
    name: string;
    email: string;
  };
  course: Course;
  summary: {
    completedSectionIds: string[];
    progressPercent: number;
  };
};

export default function CertificatePage({ params }: CertificatePageProps) {
  const router = useRouter();
  const { courseId } = use(params);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CertificateData | null>(null);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // Set formatted date
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(date.toLocaleDateString('es-ES', options));

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
          // Verify that the course is indeed 100% completed
          if (payload.summary.progressPercent < 100) {
            alert("Debes completar el 100% del curso para acceder al certificado.");
            router.replace(`/courses/${courseId}`);
            return;
          }
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center space-y-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto" />
          <p className="text-sm text-slate-500">Generando certificado digital...</p>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 dark:bg-slate-950 flex flex-col items-center justify-center">
      {/* Navigation & Controls */}
      <div className="no-print mb-8 flex w-full max-w-4xl justify-between gap-4 items-center">
        <Link
          href={`/courses/${courseId}`}
          className="inline-flex h-10 items-center justify-center rounded-full border border-slate-300 bg-white dark:bg-slate-900 px-5 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          ← Volver al curso
        </Link>
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex h-10 items-center justify-center rounded-full bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-500 shadow-md"
        >
          🖨️ Imprimir / Guardar PDF
        </button>
      </div>

      {/* Certificate Container */}
      <div className="print-container relative w-full max-w-4xl rounded-3xl border-8 border-double border-amber-600 bg-amber-50/10 p-8 sm:p-16 text-center shadow-xl dark:bg-slate-900 dark:border-amber-700/50 overflow-hidden">
        {/* Background watermark decorations */}
        <div className="absolute inset-0 border-[16px] border-amber-600/10 pointer-events-none" />
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full border border-amber-600/20 pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full border border-amber-600/20 pointer-events-none" />

        {/* Certificate Content */}
        <div className="space-y-6 sm:space-y-8">
          <div>
            <span className="text-3xl sm:text-4xl block">🎓</span>
            <h1 className="mt-4 font-serif text-3xl sm:text-5xl font-extrabold uppercase tracking-wide text-amber-800 dark:text-amber-500">
              Certificado de Finalización
            </h1>
            <div className="h-1 w-24 bg-amber-600 mx-auto mt-4" />
          </div>

          <p className="text-sm sm:text-base font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
            Este certificado se otorga con honor a
          </p>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold italic text-slate-800 dark:text-white border-b-2 border-slate-300 dark:border-slate-700 pb-2 max-w-xl mx-auto">
            {data.user.name}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
            Por haber completado con éxito y aprobado todos los requisitos prácticos y teóricos del curso académico:
          </p>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-blue-900 dark:text-blue-400">
            {data.course.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Impartido por el instructor <strong>{data.course.instructor}</strong>, con una duración certificada de <strong>{data.course.duration}</strong>.
          </p>

          {/* Bottom signatures and seals */}
          <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-8 items-end max-w-3xl mx-auto">
            {/* Signature 1 */}
            <div className="space-y-2 border-t border-slate-300 dark:border-slate-700 pt-3">
              <p className="font-serif italic text-slate-700 dark:text-slate-300 text-sm">
                {data.course.instructor}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Instructor del Curso
              </p>
            </div>

            {/* Seal */}
            <div className="flex justify-center py-2 sm:py-0">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-md border-4 border-white dark:border-slate-800">
                <span className="text-[10px] font-bold text-amber-950 uppercase tracking-widest text-center">
                  SELLO DE<br />MAESTRÍA
                </span>
                {/* Ribbon decoration */}
                <div className="absolute -bottom-4 left-6 w-3 h-8 bg-amber-700 transform -rotate-12 rounded-b" />
                <div className="absolute -bottom-4 right-6 w-3 h-8 bg-amber-700 transform rotate-12 rounded-b" />
              </div>
            </div>

            {/* Signature 2 */}
            <div className="space-y-2 border-t border-slate-300 dark:border-slate-700 pt-3">
              <p className="font-serif italic text-slate-700 dark:text-slate-300 text-sm">
                Plataforma LMS
              </p>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Director de Estudios
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-400 pt-4">
            Otorgado en la plataforma digital el día {currentDate}. ID de Verificación: CERT-{courseId.toUpperCase()}-{data.user.id.toUpperCase()}
          </p>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
          .print-container {
            border: 6px double #b45309 !important;
            box-shadow: none !important;
            padding: 2rem !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            background: #fffbeb !important;
            color-scheme: light !important;
          }
        }
      `}</style>
    </div>
  );
}
