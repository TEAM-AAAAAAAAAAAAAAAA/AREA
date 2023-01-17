import { Request, Response } from "express";

export const hook = {
    
    GET: (req: Request, res: Response) => {
        res.status(200).send('got a hook');
    },
    
    POST: (req: Request, res: Response) => {
        res.status(200).send('posted a hook');
    }

};
