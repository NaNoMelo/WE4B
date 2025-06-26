import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ['query'],
});

async function main() {
    // Create a new user
    const newUser = await prisma.user.create({
        data: {
        name: "Alice",
        first_name: "Alice",
        email: "azertyu",
        password: "securepassword123"
        },
    });
    console.log("Created new user:", newUser);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
