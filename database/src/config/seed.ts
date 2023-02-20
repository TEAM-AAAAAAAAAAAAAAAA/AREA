import { PrismaClient, Prisma } from '@prisma/client';
import { env } from 'process';
const prisma = new PrismaClient();

const dummyOAuthProviderData : Prisma.oAuthProviderCreateInput[] = [
    {
        name: 'discord',
    },
    {
        name: 'teams',
    }
]

const dummyUserData : Prisma.UserCreateInput[] = [
    {
        name: 'John Doe',
        email: 'john.doe@azer.com',
        password: 'password',
        tokens: {
            create: {
                type: 'API'
            }
        }
    },
    {
        name: 'Jane Doe',
        email: 'jane.doe@azer.com',
        password: 'password',
    }
]
async function main() {
    console.log(`Start seeding ...`);
    console.log(`Seeding OAuth Providers ...`);
    for (const o of dummyOAuthProviderData) {
        prisma.oAuthProvider.upsert({
            create: o,
            update: o,
            where: {
                name: o.name
            }
        })
        .then((res) => console.log(`Seeded OAuth Provider: ${res.name}`))
        .catch((e) => console.info(e));
    }
    console.log(`Seeding Users ...`);
    for (const u of dummyUserData) {
        prisma.user.upsert({
            create: u,
            update: u,
            where: {
                email: u.email,
            }
        })
        .then((res) => console.log(`Seeded User: ${res.name}`))
        .catch((err) => console.info(err));
    }
    console.log(`Seeding finished.`);
}

main()
    .then(async () => await prisma.$disconnect())
    .catch(async e => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
