import { Discord } from "../../services/Discord";
import { Request, Response } from "express";

export const hook = {
    POST: (req: any, res: Response) => {
        let hook: string = req.params.hook;

        // console.log(req)
        // console.log(hook)
        console.log(req.body)

        // Will be replaced by a database call
        if (hook.startsWith("discord")) {
            let inputService: Discord = new Discord(req.body);
        }
    }
}
