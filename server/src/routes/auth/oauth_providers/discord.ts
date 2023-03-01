import { Request, Response } from 'express';
import { prisma } from '../../../config/db';
import Joi from 'joi';
import _ from 'lodash';
import passport from 'passport';
import { getUserOAuthDataFromToken } from './utils';

export const discord_oauth = {
    POST: [
passport.authenticate('jwt', { session: false }),
async (req: Request, res: Response) => {
    const oauthUserDataSchema = Joi.object().keys({
        accessToken : Joi.string().required(),
        refreshToken : Joi.string().required(),
    }).unknown(true);
    req.body = oauthUserDataSchema.validate(req.body).value;
    // TODO: Check if the user is already linked to a discord account
    // TODO: insert the access token and refresh token in the database as well as the user data
    // getUserOAuthDataFromToken(req.user.tokenId) => get the data from the provider you want

}]
}