import { prisma } from "./prisma-instance";

export async function clearDb() {
  await prisma.dog.deleteMany({});
}
