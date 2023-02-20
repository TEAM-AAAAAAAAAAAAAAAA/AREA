import { prisma } from "../../../config/db";
import { jwtSecret } from "../../../config/env";
import jwt from 'jsonwebtoken';
import { TokenPayload } from "../../../utils/token_type";

export async function getUserOAuthDataFromToken(token: string, provider: string) : Promise<any> {
    return prisma.token.findUnique({
        where: {
            id: token
        }
    })?.user()?.OAuthUserData({
        where: {
            OAuthProviderName: provider
        }
    });
}
