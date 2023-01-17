import { Router } from "express";
import { index } from "./routes/index";
import { hook } from "./routes/hook";

export const routes = Router();

routes.get('/', index.GET);
routes.get('/hook/', hook.GET);
routes.post('/hook/', hook.POST);
