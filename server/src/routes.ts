import { Router } from "express";
import { index } from "./routes/index";
import { hook } from "./routes/hook";
import { auth } from "./routes/auth";
import _ from "lodash";
import { newService } from "./routes/newService";

export const routes = Router();

routes.get('/', index.GET);
routes.get('/hook/', hook.GET);
routes.post('/hook/:hook(*)', ..._.slice(hook.POST, 0, hook.POST.length - 1), hook.POST[hook.POST.length - 1]);
routes.post('/auth/login', auth.login.POST);
routes.get('/auth/logout', auth.logout.GET);
routes.get('/auth/validate/:input_token', auth.validate_email.GET);
routes.get('/new-service/:service(*)', newService.GET)
