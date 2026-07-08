type PrismaClientLike = {
  sectionProgress: {
    deleteMany: () => Promise<unknown>;
    createMany: (args: unknown) => Promise<unknown>;
  };
  enrollment: {
    deleteMany: () => Promise<unknown>;
  };
  section: {
    deleteMany: () => Promise<unknown>;
  };
  module: {
    deleteMany: () => Promise<unknown>;
  };
  course: {
    deleteMany: () => Promise<unknown>;
    create: (args: unknown) => Promise<SeedCourse>;
  };
  user: {
    deleteMany: () => Promise<unknown>;
    findUnique: (args: unknown) => Promise<SeedUser | null>;
    create: (args: unknown) => Promise<SeedUser>;
  };
  $disconnect: () => Promise<void>;
};

type SeedUser = {
  id: string;
  name: string;
  email: string;
};

type SeedSection = {
  id: string;
};

type SeedModule = {
  sections: SeedSection[];
};

type SeedCourse = {
  slug: string;
  modules: SeedModule[];
};

async function main() {
  const prismaModule = await import("@prisma/client");
  const PrismaClientConstructor =
    (prismaModule as unknown as { PrismaClient?: new () => PrismaClientLike }).PrismaClient ??
    (prismaModule as unknown as { default?: { PrismaClient?: new () => PrismaClientLike } })
      .default?.PrismaClient;

  if (!PrismaClientConstructor) {
    throw new Error("PrismaClient is unavailable. Run `npx prisma generate` first.");
  }

  const prisma = new PrismaClientConstructor();

  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@demo.com" },
    select: { id: true },
  });

  if (existingAdmin) {
    console.log("Seed omitido: los datos demo ya existen en la base de datos.");
    await prisma.$disconnect();
    return;
  }

  const [admin, ana, carlos] = await Promise.all([
    prisma.user.create({
      data: {
        name: "Admin LMS",
        email: "admin@demo.com",
        passwordHash: "demo-admin-hash",
        role: "ADMIN",
      },
    }),
    prisma.user.create({
      data: {
        name: "Ana Torres",
        email: "ana@demo.com",
        passwordHash: "demo-user-hash",
        role: "STUDENT",
      },
    }),
    prisma.user.create({
      data: {
        name: "Carlos Mendoza",
        email: "carlos@demo.com",
        passwordHash: "demo-user-hash",
        role: "STUDENT",
      },
    }),
  ]);

  const nextCourse = await prisma.course.create({
    data: {
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
      modules: {
        create: [
          {
            order: 1,
            title: "Fundamentos de la experiencia",
            description: "Estructura inicial y navegación base.",
            sections: {
              create: [
                {
                  order: 1,
                  title: "Arquitectura del LMS",
                  summary: "Qué piezas debe tener una plataforma educativa moderna.",
                  contentHtml:
                    "<p>La plataforma se organiza en rutas públicas y privadas, con un layout consistente, componentes reutilizables y datos normalizados.</p>",
                  videoUrl: "https://www.youtube-nocookie.com/embed/ysz5S6PUM-U",
                  durationMinutes: 8,
                },
                {
                  order: 2,
                  title: "Rutas y layouts",
                  summary: "Cómo organizar el App Router para el flujo del usuario.",
                  contentHtml:
                    "<p>El flujo recomendado separa la bienvenida, autenticación, panel y visor de curso, manteniendo cada responsabilidad en una ruta clara.</p>",
                  videoUrl: "https://www.youtube-nocookie.com/embed/ysz5S6PUM-U",
                  durationMinutes: 10,
                },
              ],
            },
          },
          {
            order: 2,
            title: "Interacción y progreso",
            description: "Bloqueo lateral, avance y seguimiento.",
            sections: {
              create: [
                {
                  order: 1,
                  title: "Menú lateral bloqueado",
                  summary: "Solo se habilita cuando la sección previa termina.",
                  contentHtml:
                    "<p>El sidebar del curso debe impedir saltos arbitrarios y mostrar con claridad qué contenido ya fue desbloqueado.</p>",
                  videoUrl: "https://www.youtube-nocookie.com/embed/ysz5S6PUM-U",
                  durationMinutes: 12,
                },
                {
                  order: 2,
                  title: "Botones siguiente y atrás",
                  summary: "Navegación guiada por el progreso actual.",
                  contentHtml:
                    "<p>Los botones deben adaptarse al estado actual del alumno y actualizar el contenido central sin perder contexto.</p>",
                  videoUrl: "https://www.youtube-nocookie.com/embed/ysz5S6PUM-U",
                  durationMinutes: 12,
                },
              ],
            },
          },
        ],
      },
      enrollments: {
        create: [
          { userId: ana.id, progress: 50 },
          { userId: carlos.id, progress: 25 },
        ],
      },
    },
    include: {
      modules: {
        include: {
          sections: true,
        },
      },
    },
  });

  const reactCourse = await prisma.course.create({
    data: {
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
      modules: {
        create: [
          {
            order: 1,
            title: "Componentes y composición",
            description: "Cómo descomponer la interfaz en piezas reutilizables.",
            sections: {
              create: [
                {
                  order: 1,
                  title: "Cards de curso",
                  summary: "Presentación de cursos matriculados con progreso.",
                  contentHtml:
                    "<p>Las cards ayudan a mostrar rápidamente el estado del usuario y a dirigirlo al siguiente paso del recorrido de aprendizaje.</p>",
                  videoUrl: "https://www.youtube-nocookie.com/embed/ysz5S6PUM-U",
                  durationMinutes: 7,
                },
                {
                  order: 2,
                  title: "Estado y acciones",
                  summary: "Navegación, selección y persistencia del progreso.",
                  contentHtml:
                    "<p>La interacción del alumno se traduce en estado local o persistencia en base de datos según el punto del producto.</p>",
                  videoUrl: "https://www.youtube-nocookie.com/embed/ysz5S6PUM-U",
                  durationMinutes: 9,
                },
              ],
            },
          },
        ],
      },
      enrollments: {
        create: [{ userId: ana.id, progress: 25 }],
      },
    },
    include: {
      modules: {
        include: {
          sections: true,
        },
      },
    },
  });

  const nextSections = nextCourse.modules.flatMap(
    (module: SeedModule) => module.sections,
  );
  const reactSections = reactCourse.modules.flatMap(
    (module: SeedModule) => module.sections,
  );

  await prisma.sectionProgress.createMany({
    data: [
      { userId: ana.id, sectionId: nextSections[0].id, completedAt: new Date() },
      { userId: ana.id, sectionId: nextSections[1].id, completedAt: new Date() },
      { userId: ana.id, sectionId: reactSections[0].id, completedAt: new Date() },
      { userId: carlos.id, sectionId: nextSections[0].id, completedAt: new Date() },
    ],
  });

  console.log(`Seed completado para ${admin.email}, ${ana.email} y ${carlos.email}.`);
  console.log(`Cursos creados: ${nextCourse.slug}, ${reactCourse.slug}`);

  await prisma.$disconnect();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
