import { Request, Response } from 'express';
import { prisma } from '../../../config/db';
import Joi from 'joi';
import _ from 'lodash';
import passport from 'passport';
import { getUserFromToken, getUserOAuthDataFromToken } from './utils';
import { Octokit } from 'octokit';

export const github_config = {
    POST: [
passport.authenticate('jwt', { session: false }),
async (req: Request, res: Response) => {
    const oauthUserDataSchema = Joi.object().keys({
        GithubAppToken: Joi.string().required(),
    }).unknown(true);
    req.body = oauthUserDataSchema.validate(req.body).value;

    if (_.isEmpty(req.user))
        return res.status(403).json('Forbidden');

    if (_.isEmpty(req.body))
        return res.status(400).json('Missing parameters');
    console.log((req.user as any)?.id);
    const user = await getUserFromToken((req.user as any)?.id);
    if (_.isEmpty(user))
        return res.status(404).json('User not found');
    const oktokit = new Octokit({ auth: req.body.GithubAppToken });

    const userGithubData = await oktokit.rest.users.getAuthenticated();
    if (userGithubData.status !== 200)
        return res.status(404).json('Github user not found');
    await prisma.oAuthUserData.upsert({
        where: {
            userId_oAuthProviderName: {
                userId: user.id,
                oAuthProviderName: 'github'
            }
        },
        update: {
            accessToken: req.body.GithubAppToken,
        },
        create: {
            accessToken: req.body.GithubAppToken,
            refreshToken: '',
            oAuthProviderName: 'github',
            providerUserId: userGithubData.data?.id.toString(),
            userId: user.id,
            data: {}
        }
    });
    res.status(200).json({status: 'ok'});
}
]
}