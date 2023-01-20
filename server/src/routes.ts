import { Router } from "express";
import { index } from "./routes/index";
import { hook } from "./routes/hook/index";

export const routes = Router();

routes.get('/', index.GET);
routes.post('/hook/:hook(*)', hook.POST);
