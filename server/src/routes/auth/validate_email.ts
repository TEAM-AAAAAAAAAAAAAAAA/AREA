import { Request, Response } from "express";
import { prisma } from "../../config/db";
import Joi from "joi";
import jwt from "jsonwebtoken";
import { TokenPayload } from "../../utils/token_type";
import { mailSecret, jwtSecret } from "../../config/env";

/**
 * @api {post} /auth/validate_email/:input_token Validate email
 */
export const validate_email = {
    GET: async (req: Request, res: Response) => {
        let token_scheme = Joi.object({
            input_token: Joi.string().required()
        });

        let parse = token_scheme.validate(req.params);
        let parsed_token;

        if (parse.error !== undefined){
            return res.status(400).json(parse.error);
        }
        try {
            parsed_token = jwt.verify(parse.value.input_token, mailSecret);
        } catch (err) {
            return res.status(401).json(err);
        }
        const user_id = await prisma.token.findFirst({
            where: {
                userId : (parsed_token as TokenPayload).userId,
                type: 'EMAIL_VERIFICATION',
            }
        });
        if (user_id) {
            try {
                await prisma.user.update({
                    where: {
                        id: user_id.userId
                    },
                    data: {
                        emailVerified: true
                    }
                })
                prisma.token.create({
                    data: {
                        userId: user_id.userId,
                        type: 'API',
                    }
                });
                prisma.token.delete({
                    where: {
                        id: user_id.id,
                    }
                });
                const new_api_token = jwt.sign({ tokenId: user_id.userId }, jwtSecret);
                return res.status(200).json({status: 'verified', api_token: new_api_token});
            } catch (err) {
                return res.status(500).json(err);
            }
        }
    }
}