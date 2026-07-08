type PrismaClientLike = {
  $connect: () => Promise<void>;
  $disconnect: () => Promise<void>;
  [key: string]: unknown;
};

declare global {
  var __miniPlataformaPrisma: PrismaClientLike | undefined;
}

let prismaClient = globalThis.__miniPlataformaPrisma;

export async function getDb() {
  if (prismaClient) {
    return prismaClient;
  }

  const prismaModule = await import("@prisma/client");
  const PrismaClientConstructor =
    (prismaModule as unknown as { PrismaClient?: new () => PrismaClientLike }).PrismaClient ??
    (prismaModule as unknown as { default?: { PrismaClient?: new () => PrismaClientLike } })
      .default?.PrismaClient;

  if (!PrismaClientConstructor) {
    throw new Error(
      "PrismaClient is unavailable. Run `npx prisma generate` before using the database.",
    );
  }

  prismaClient = new PrismaClientConstructor();

  if (process.env.NODE_ENV !== "production") {
    globalThis.__miniPlataformaPrisma = prismaClient;
  }

  return prismaClient;
}

export default getDb;
