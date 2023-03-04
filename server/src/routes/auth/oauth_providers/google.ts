import { Request, Response } from 'express';
import { prisma } from '../../../config/db';
import Joi from 'joi';
import _ from 'lodash';
import passport from 'passport';
import { google } from 'googleapis';
import { getUserOAuthDataFromToken, getUserFromToken } from './utils';

export const get_oauth_tokens = {
    POST: [
passport.authenticate('jwt', { session: false }),
async (req: Request, res: Response) => {
    const codeSchema = Joi.object().keys({
        code: Joi.string().required()
    });
    req.body = codeSchema.validate(req.body).value;

    if (_.isEmpty(req.body)) {
        res.status(400).json({ error: 'Bad request' });
        return;
    }
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );
    try {
        const { tokens } = await oauth2Client.getToken(req.body.code);

        res.status(200).json({ tokens });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: 'Bad request' });
    }
}
    ]
}

export const google_oauth = {
    POST: [
passport.authenticate('jwt', { session: false }),
async (req: Request, res: Response) => {
    const oauthUserDataSchema = Joi.object().keys({
        accessToken : Joi.string().required(),
        refreshToken : Joi.string(),
        userData : Joi.object().keys({
            id : Joi.string().required()
        }).required().unknown(true)
    });
    req.body = oauthUserDataSchema.validate(req.body).value;
    if (_.isEmpty(req.body)) {
        console.log("Body empty");
        res.status(400).json({ error: oauthUserDataSchema.validate(req.body).error });
        return;
    }


    // Check if the user already exists and update the discord data if so
    try {
        let googleUserData = await getUserOAuthDataFromToken((req.user as any)?.token, 'google');
        let user = await getUserFromToken((req.user as any)?.token);
        if (!_.isEmpty(googleUserData)) {
            console.log("Data already exists, refreshing tokens and info...");
            await prisma.oAuthUserData.update({
                where: {
                    userId_oAuthProviderName: {
                        userId: user.id,
                        oAuthProviderName: 'google'
                    }
                },
                data: {
                    accessToken: req.body.accessToken,
                    refreshToken: req.body.refreshToken,
                    data: req.body.userData
                }
            });
        } else {
            console.log("Data doesn't exist, creating...");
            await prisma.oAuthUserData.create({
                data: {
                    data: req.body.userData,
                    accessToken: req.body.accessToken,
                    refreshToken: req.body.refreshToken,
                    providerUserId: req.body?.userData?.id,
                    oAuthProvider: {
                        connect: {
                            oAuthProviderName: 'google'
                        }
                    },
                    user: {
                        connect: {
                            id: user.id || ''
                        }
                    }
                }
            });
        }
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Bad request' });
        return;
    }
    res.status(200).json({ status: "ok" });
}
    ]
};

export const get_oauth_url = {
    GET: [
passport.authenticate('jwt', { session: false }),
async (req: Request, res: Response) => {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );
    const scopes = [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/tasks',
    ];
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });
    res.status(200).json({ url });
}
    ]
};