import { Request, Response } from 'express';
import { prisma } from '../../../config/db';
import Joi from 'joi';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../../../config/env';

export const discord_oauth = {
    POST: [
async (req: Request, res: Response) => {
    const oauthUserDataSchema = Joi.object().keys({
        accessToken : Joi.string().required(),
        refreshToken : Joi.string(),
        email : Joi.string().email().required().not(null),
        password : Joi.string().required().min(8),
        userData : Joi.object().keys({
            id : Joi.string().required()
        }).required().unknown(true)
    });
    req.body = oauthUserDataSchema.validate(req.body).value;
    if (_.isEmpty(req.body)) {
        res.status(400).json({ error: 'Bad request' });
        return;
    }
    // Check if the user already exists and update the discord data if so
    let user_data = await prisma.oAuthUserData.upsert({
        where: {
            providerUserId_oAuthProviderName: {
                providerUserId: req.body.userData.id,
                oAuthProviderName: 'discord'
            }
        },
        create: {
            accessToken: req.body.accessToken,
            refreshToken: req.body.refreshToken,
            providerUserId: req.body.userData.id,
            oAuthProvider: {
                connect: {
                    oAuthProviderName: 'discord'
                }
            },
            user: {
                connect: {
                    email: req.body.email
                }
            },
            data: req.body.userData
        },
        update: {
            accessToken: req.body.accessToken,
            refreshToken: req.body.refreshToken,
            data: req.body.userData
        }
    });
    // Upsert users API token
    let db_token = await prisma.token.upsert({
        where: {
            userId_type: {
                userId: user_data.userId,
                type: 'API'
            }
        },
        create: {
            type: 'API',
            user: {
                connect: {
                    id: user_data.userId
                }
            }
        },
        update: {
            type: 'API',
            user: {
                connect: {
                    id: user_data.userId
                }
            }
        }
    });
    let jwtUserToken = jwt.sign({ token: db_token.id }, jwtSecret);
    res.status(200).json({ message: 'User already exists, linked discord account', token: jwtUserToken });
    return;
}
]}