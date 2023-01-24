import { Request, Response } from 'express';
import { prisma } from '../../config/db';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../../config/env';
import * as argon2id from 'argon2';
import _ from 'lodash';

export const login = {

    GET: (req: Request, res: Response) => {
        res.status(200).send('ok');
    },

    POST: [
        (req: Request, res: Response) => {
        let userInputScheme = Joi.object(({
            email: Joi.string().email().required(),
            name: Joi.string().normalize().required(),
            password: Joi.string().required()
        }));
        let userInput = userInputScheme.validate(req.body);

        console.log(userInput);
        if (userInput.error !== undefined) {
            return res.status(400).json(userInputScheme.validate(req.body).error);
        }
        prisma.user.findUnique({
            where: {
                email: userInput.value.email
            }
        })
        .then(async (user: any) => {
            if (user) {
                try {
                    if (await argon2id.verify(user.password, userInput.value.password)) {
                        const prismaToken = await prisma.token.findFirst({
                            where: {
                                userId: user.id,
                                type: 'API'
                            }
                        });
                        if (prismaToken)
                            _.merge(user, jwt.sign({ token: prismaToken }, jwtSecret));
                        res.status(200).json(user);
                    } else {
                        res.status(401).json('Wrong password');
                    }
                } catch (err) {
                    console.log(err);
                    res.status(500).json('Internal server error');
                }
            } else {
                return prisma.user.create({
                    data: {
                        name: userInput.value.name,
                        email: userInput.value.email,
                        password: await argon2id.hash(userInput.value.password)
                    }
                });
            }
        })
        .then((user: any) => {
            res.status(200).json(user);
            // TODO: send email with token
        });
    }]
};