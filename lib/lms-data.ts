export type DemoRole = "student" | "admin";

export type CourseSection = {
  id: string;
  title: string;
  summary: string;
  html: string;
  videoUrl: string;
  durationMinutes: number;
};

export type CourseModule = {
  id: string;
  title: string;
  description: string;
  sections: CourseSection[];
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  description: string;
  overview: string;
  level: string;
  duration: string;
  instructor: string;
  accent: string;
  modules: CourseModule[];
};

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: DemoRole;
  enrolledCourseIds: string[];
};

export type DashboardCourse = Course & {
  completedSections: number;
  totalSections: number;
  progressPercent: number;
  nextSectionTitle: string | null;
};

const videoPlaceholder = "https://www.youtube-nocookie.com/embed/ysz5S6PUM-U";

export const demoUsers: DemoUser[] = [
  {
    id: "user-ana",
    name: "Ana Torres",
    email: "ana@demo.com",
    password: "lms123",
    role: "student",
    enrolledCourseIds: ["next-edu", "react-base"],
  },
  {
    id: "user-carlos",
    name: "Carlos Mendoza",
    email: "carlos@demo.com",
    password: "lms123",
    role: "student",
    enrolledCourseIds: ["next-edu"],
  },
];

export const demoCourses: Course[] = [
  {
    id: "next-edu",
    slug: "nextjs-para-lms",
    title: "Next.js para plataformas educativas",
    description:
      "Construye una experiencia de aprendizaje con rutas protegidas, progreso y panel de usuario.",
    overview:
      "Este curso muestra la arquitectura base del LMS: welcome, login, dashboard, visor y navegación bloqueada por avance.",
    level: "Intermedio",
    duration: "4h 30m",
    instructor: "Equipo LMS",
    accent: "from-cyan-400 to-sky-600",
    modules: [
      {
        id: "next-m1",
        title: "Fundamentos de la experiencia",
        description: "Estructura inicial y navegación base.",
        sections: [
          {
            id: "next-m1-s1",
            title: "Arquitectura del LMS",
            summary: "Qué piezas debe tener una plataforma educativa moderna.",
            html: `
              <p>La plataforma se organiza en rutas públicas y privadas, con un layout consistente, componentes reutilizables y datos normalizados.</p>
              <ul>
                <li>Landing page con propuesta de valor</li>
                <li>Login con cookie HTTP-only</li>
                <li>Dashboard con cursos matriculados</li>
              </ul>
            `,
            videoUrl: videoPlaceholder,
            durationMinutes: 8,
          },
          {
            id: "next-m1-s2",
            title: "Rutas y layouts",
            summary: "Cómo organizar el App Router para el flujo del usuario.",
            html: `
              <p>El flujo recomendado separa la bienvenida, autenticación, panel y visor de curso, manteniendo cada responsabilidad en una ruta clara.</p>
            `,
            videoUrl: videoPlaceholder,
            durationMinutes: 10,
          },
        ],
      },
      {
        id: "next-m2",
        title: "Interacción y progreso",
        description: "Bloqueo lateral, avance y seguimiento.",
        sections: [
          {
            id: "next-m2-s1",
            title: "Menú lateral bloqueado",
            summary: "Solo se habilita cuando la sección previa termina.",
            html: `
              <p>El sidebar del curso debe impedir saltos arbitrarios y mostrar con claridad qué contenido ya fue desbloqueado.</p>
            `,
            videoUrl: videoPlaceholder,
            durationMinutes: 12,
          },
          {
            id: "next-m2-s2",
            title: "Botones siguiente y atrás",
            summary: "Navegación guiada por el progreso actual.",
            html: `
              <p>Los botones deben adaptarse al estado actual del alumno y actualizar el contenido central sin perder contexto.</p>
            `,
            videoUrl: videoPlaceholder,
            durationMinutes: 12,
          },
        ],
      },
    ],
  },
  {
    id: "react-base",
    slug: "fundamentos-react",
    title: "Fundamentos de React para LMS",
    description:
      "Componentización, estado y composición aplicada a cursos y dashboards.",
    overview:
      "Ideal para construir cards, formularios y un visor interactivo con componentes pequeños y reutilizables.",
    level: "Básico",
    duration: "3h 20m",
    instructor: "Team Frontend",
    accent: "from-emerald-400 to-teal-600",
    modules: [
      {
        id: "react-m1",
        title: "Componentes y composición",
        description: "Cómo descomponer la interfaz en piezas reutilizables.",
        sections: [
          {
            id: "react-m1-s1",
            title: "Cards de curso",
            summary: "Presentación de cursos matriculados con progreso.",
            html: `
              <p>Las cards ayudan a mostrar rápidamente el estado del usuario y a dirigirlo al siguiente paso del recorrido de aprendizaje.</p>
            `,
            videoUrl: videoPlaceholder,
            durationMinutes: 7,
          },
          {
            id: "react-m1-s2",
            title: "Estado y acciones",
            summary: "Navegación, selección y persistencia del progreso.",
            html: `
              <p>La interacción del alumno se traduce en estado local o persistencia en base de datos según el punto del producto.</p>
            `,
            videoUrl: videoPlaceholder,
            durationMinutes: 9,
          },
        ],
      },
    ],
  },
];

export const demoProgress: Record<string, Record<string, string[]>> = {
  "user-ana": {
    "next-edu": ["next-m1-s1", "next-m1-s2"],
    "react-base": ["react-m1-s1"],
  },
  "user-carlos": {
    "next-edu": ["next-m1-s1"],
  },
};

export function getDemoUserByEmail(email: string) {
  return demoUsers.find(
    (user) => user.email.toLowerCase() === email.toLowerCase(),
  );
}

export function getDemoUserById(userId: string) {
  return demoUsers.find((user) => user.id === userId);
}

export function getCourseById(courseId: string) {
  return demoCourses.find((course) => course.id === courseId);
}

export function flattenCourseSections(course: Course) {
  return course.modules.flatMap((module) => module.sections);
}

export function getUserCompletedSectionIds(userId: string, courseId: string) {
  return demoProgress[userId]?.[courseId] ?? [];
}

export function getDashboardCourses(userId: string): DashboardCourse[] {
  const user = getDemoUserById(userId);

  if (!user) {
    return [];
  }

  return user.enrolledCourseIds
    .map((courseId) => {
      const course = getCourseById(courseId);

      if (!course) {
        return null;
      }

      const sections = flattenCourseSections(course);
      const completedSections = getUserCompletedSectionIds(userId, course.id);
      const completedCount = completedSections.length;
      const totalSections = sections.length;
      const progressPercent =
        totalSections === 0
          ? 0
          : Math.round((completedCount / totalSections) * 100);
      const nextSectionTitle =
        sections.find((section) => !completedSections.includes(section.id))
          ?.title ?? null;

      return {
        ...course,
        completedSections: completedCount,
        totalSections,
        progressPercent,
        nextSectionTitle,
      };
    })
    .filter((course): course is DashboardCourse => course !== null);
}

export function getCourseProgressSummary(userId: string, courseId: string) {
  const course = getCourseById(courseId);

  if (!course) {
    return null;
  }

  const completedSectionIds = getUserCompletedSectionIds(userId, courseId);
  const sections = flattenCourseSections(course);
  const progressPercent =
    sections.length === 0
      ? 0
      : Math.round((completedSectionIds.length / sections.length) * 100);

  return {
    course,
    sections,
    completedSectionIds,
    progressPercent,
  };
}
