import { Request, Response } from 'express';

export const logout = {

    GET: (req: Request, res: Response) => {
        res.status(200).send('ok');
    }
};