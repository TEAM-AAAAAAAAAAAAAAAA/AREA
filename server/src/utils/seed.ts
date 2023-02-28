import { Prisma } from "@prisma/client";
import { prisma } from "../config/db";

const dummyOAuthProviderData : Prisma.oAuthProviderCreateInput[] = [
    {
        oAuthProviderName: 'discord',
    },
    {
        oAuthProviderName: 'teams',
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

export async function seed() : Promise<void>
{
    console.log(`Start seeding ...`);
    console.log(`Seeding OAuth Providers ...`);
    for (const o of dummyOAuthProviderData) {
        prisma.oAuthProvider.upsert({
            create: o,
            update: o,
            where: {
                oAuthProviderName: o.oAuthProviderName
            }
        })
        .then((res) => console.log(`Seeded OAuth Provider: ${res.oAuthProviderName}`))
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
