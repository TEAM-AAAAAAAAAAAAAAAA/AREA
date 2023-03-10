import { Request, Response } from 'express';
import { prisma } from '../../config/db';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { jwtSecret, mailSecret } from '../../config/env';
import * as argon2id from 'argon2';
import { sendMail } from '../../utils/mailer';
import _ from 'lodash';
import { rateLimit } from 'express-rate-limit';

export const login = {
    GET: (req: Request, res: Response) => {
        res.status(200).send('ok');
    },

    POST: [
rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
}),
async (req: Request, res: Response) => {
let userInputScheme = Joi.object(({
    email: Joi.string().email().required(),
    name: Joi.string().normalize().required(),
    password: Joi.string().required()
}));
let userInput = userInputScheme.validate(req.body);

if (userInput.error !== undefined)
    return res.status(400).json(userInput.error);

const user = await prisma.user.findFirst({
    where: {
        email: userInput.value.email
    }
});

if (user) {
    try {
        let is_verified = await prisma.user.findUnique({ where: { id: user.id }, select: { emailVerified: true } });
        if (is_verified?.emailVerified)
            return res.status(401).json('Email not verified');
        if (await argon2id.verify(user.password, userInput.value.password)) {
            const prismaToken = await prisma.token.findFirst({
                where: {
                    userId: user.id,
                    valid: true,
                    type: 'API'
                }
            });
            if (prismaToken)
                (user as any).token = jwt.sign({ token: prismaToken.id }, jwtSecret);
            res.status(200).json({"status": "ok", "user": _.omit(user, ['password'])});
        } else {
            res.status(401).json('Wrong password');
        }
    } catch (error) {
        res.status(500).json(error);
    }
} else {
    try {
        const password = await argon2id.hash(userInput.value.password);
        const user = await prisma.user.create({
            data: {
                name: userInput.value.name,
                email: userInput.value.email,
                password: password,
                emailVerified: true
            }
        });
        const prismaToken = await prisma.token.create({
            data: {
                type: 'API',
                user: {
                    connect: { id: user.id }
                }
            }
        });
        (user as any).verification_token = jwt.sign({ token: prismaToken.id }, mailSecret);
        sendMail(user.email, {token_id: (user as any).verification_token, type_of_action: 'an account verification'});
        res.status(200).json({"status": "ok", "user": _.omit(user, ['password', 'verification_token'])});
    } catch (error) {
        res.status(500).json(error);
    }
}
}
    ]
};