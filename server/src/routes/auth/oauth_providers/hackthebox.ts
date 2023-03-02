import { Request, Response } from 'express';
import { prisma } from '../../../config/db';
import Joi, { date } from 'joi';
import _ from 'lodash';
import passport from 'passport';
import { getUserOAuthDataFromToken } from './utils';

export const htb_config = {
    POST: [
/**
 * @api {post} /auth/htb/config Configure HackTheBox App token
 * @apiName Configure HackTheBox App token
 * @apiGroup Auth
 * @apiVersion 1.0.0
 * @apiDescription Configure the HackTheBox App token when logged to the AREA
 * @apiPermission user
 * @apiParam {String} htbAppToken HackTheBox App token
 * @apiSuccess {String} status Status of the operation
 *
 * Configure the HackTheBox App token when logged to the AREA
 *
 * This is NOT a login route, it's a route to configure the HackTheBox App token
 * when the user is already logged to the AREA
 * It will register the htbAppToken as the accessToken in the oAuthUserData table
 */
passport.authenticate('jwt', { session: false }),
async (req: Request, res: Response) => {
    const oauthUserDataSchema = Joi.object().keys({
        htbAppToken: Joi.string().required(),
    }).unknown(true);
    req.body = oauthUserDataSchema.validate(req.body).value;

    if (_.isEmpty(req.user))
        return res.status(403).json('Forbidden');

    if (_.isEmpty(req.body))
        return res.status(400).json('Missing parameters');
    console.dir(req?.user);
    const user = await prisma.user.findUnique({
        where: {
            id: (req?.user as any).profile
        }
    });
    if (!user)
        return res.status(404).json('User not found');
    await prisma.oAuthUserData.upsert({
        where: {
            userId_oAuthProviderName: {
                userId: user.id,
                oAuthProviderName: 'hackthebox'
            }
        },
        update: {
            accessToken: req.body.htbAppToken
        },
        create: {
            accessToken: req.body.htbAppToken,
            refreshToken: '',
            oAuthProviderName: 'hackthebox',
            providerUserId: user.id,
            userId: user.id,
            data: {}
        }
    });
    res.status(200).json({status: 'ok'});
}
]}