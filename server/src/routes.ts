import { Router } from 'express';
import { index } from './routes/index';
import { aboutJson } from './routes/aboutJson';
import { hook } from './routes/hook';
import { auth } from './routes/auth';
import _ from 'lodash';
import { rateLimit } from 'express-rate-limit';

export const routes = Router();
var proxy = require('express-http-proxy');
var app = require('express')();

const apolloRateLimit = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 200, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});

if (process.env.APOLLO_PORT != undefined)
    app.use('/apollo', apolloRateLimit, proxy('apollo_server:' + process.env.APOLLO_PORT));
else
    app.use('/apollo', apolloRateLimit, proxy('apollo_server:4000'));
routes.get('/', index.GET);
routes.get('/about.json', aboutJson.GET);
routes.get('/hook/', hook.GET);
routes.post('/hook/:hook(*)', ...hook.POST);
routes.post('/auth/login', auth.login.POST);
routes.get('/auth/logout', auth.logout.GET);
routes.get('/auth/validate/:input_token', auth.validate_email.GET);
routes.post('/auth/discord_oauth', auth.discord_oauth.POST);
routes.post('/auth/hackthebox_config', auth.htb_config.POST);
routes.post('/auth/google/get_oauth_tokens', auth.get_oauth_tokens.POST);
routes.get('/auth/google/get_oauth_url', auth.get_oauth_url.GET);
routes.post('/auth/google/google_oauth', auth.google_oauth.POST);