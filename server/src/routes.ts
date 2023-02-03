import { Router } from "express";
import { index } from "./routes/index";
import { hook } from "./routes/hook";
import { auth } from "./routes/auth";
import _ from "lodash";

export const routes = Router();
var proxy = require('express-http-proxy');
var app = require('express')();

if (process.env.APOLLO_PORT != undefined)
    app.use('/apollo', proxy('apollo_server:' + process.env.APOLLO_PORT));
else
    app.use('/apollo', proxy('apollo_server:4000'));
routes.get('/', index.GET);
routes.get('/hook/', hook.GET);
routes.post('/hook/:hook(*)', ..._.slice(hook.POST, 0, hook.POST.length - 1), hook.POST[hook.POST.length - 1]);
routes.post('/auth/login', auth.login.POST);
routes.get('/auth/logout', auth.logout.GET);
routes.get('/auth/validate/:input_token', auth.validate_email.GET);