import { Request, Response } from "express";
import { services } from "../../services/.services";
import { transcoders } from "../../transcoders/.transcoders";

export const hook = {
    POST: (req: any, res: Response) => {
        let hook: string = req.params.hook;

        // Will be replaced by a database call
        if (hook.startsWith("discord")) {
            // let inputService: services.Discord = new services.Discord(req.body);
            let inputService: services.Discord = new services.Discord();
            inputService.read(req.body);
            let outputService: services.Teams = transcoders.discordToTeams(inputService);
        }
    }
}
