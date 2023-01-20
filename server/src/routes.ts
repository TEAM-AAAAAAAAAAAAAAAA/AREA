import { Router } from "express";
import { index } from "./routes/index";
import { hook } from "./routes/hook";
import { auth } from "./routes/auth";

export const routes = Router();

routes.get('/', index.GET);
routes.get('/hook/', hook.GET);
routes.post('/hook/:hook(*)', hook.POST);
routes.get('/auth/login', auth.login.GET);
routes.get('/auth/logout', auth.logout.GET);