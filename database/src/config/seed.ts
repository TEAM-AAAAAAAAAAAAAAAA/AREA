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
        prisma.oAuthProvider.create({
            data: o
        })
        .then((res) => console.log(`Seeded OAuth Provider: ${res.name}`))
        .catch();
    }
    console.log(`Seeding Users ...`);
    for (const u of dummyUserData) {
        try {
            prisma.user.create({
                data: u
            })
            .then((res) => console.log(`Seeded User: ${res.name}`))
            .catch();
        } catch (e) {
        }
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
