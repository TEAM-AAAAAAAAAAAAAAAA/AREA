import { Request, Response } from 'express';


export const login = {

    GET: (req: Request, res: Response) => {
        res.status(200).send('ok');
    }
};