import { prisma } from "../../../config/db";
import { jwtSecret } from "../../../config/env";
import jwt from 'jsonwebtoken';
import { TokenPayload } from "../../../utils/token_type";

export async function getUserOAuthDataFromToken(token: string, provider: string) : Promise<any> {
    return prisma.token.findFirst({
        where: {
            id: token,
            type: 'API'
        }
    })?.user()?.oAuthUserData({
        where: {
            oAuthProviderName: provider
        }
    });
}

export async function getUserFromToken(token: string) : Promise<any> {
    return prisma.token.findFirst({
        where: {
            id: token,
            type: 'API'
        }
    })?.user();
}
