import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  //   const password = await hash("rafid123", 12);
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash("rafid123", salt);
  await prisma.user.deleteMany({
    where: {
      role: "SUPERADMIN",
    },
  });
  const user = await prisma.user.upsert({
    where: { email: "admin@gizantech.com" },
    update: {},
    create: {
      email: "admin@rafid.com",
      username: "Admin",
      password: hashed,
      salt,
      role: "SUPERADMIN",
      isEmailVerified: true,
    },
  });

  console.log({ user });
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });