import { PrismaClient, Prisma } from '@prisma/client';
import { env } from 'process';
const prisma = new PrismaClient();

const dummyUserData: Prisma.UserCreateInput[] = [
    {
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        password: 'password',
    },
    {
        name: 'Jane Doe',
        email: 'jane.doe@gmail.com',
        password: 'password',
    }
]

async function main() {
    console.log(`Start seeding ...`);
    for (const u of dummyUserData) {
        const user = await prisma.user.create({
            data: u
        });
        console.log(`Created user with id: ${user.id}`);
    }
    console.log(`Seeding finished.`);
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
