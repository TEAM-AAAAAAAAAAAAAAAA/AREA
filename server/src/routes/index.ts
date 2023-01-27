import { Request, Response } from 'express';

export const index = {

    GET: (req: Request, res: Response) => {
        res.status(200).send('ok');
    }

};
