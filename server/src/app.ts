import { Express } from 'express'
import express from 'express'
import { routes } from './routes';
import { env } from './config/env';
import bodyParser from 'body-parser';
import { sendMail } from './utils/mailer';
import csrf from 'csurf';
import passport from 'passport';
import { services } from './services/.services';
import { Request, Response } from 'express';
import { prisma } from './config/db';
import cors from 'cors';

const app = express();

app.use(passport.initialize())
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const appConfig = {
    name: 'API',
    port: Number(env.API_PORT),
    host: '0.0.0.0',
    envName: env.ENV_NAME,
};

services.DB.sync().then((res: boolean) => {
    console.log("Is DB synced?", res);
    seedActions().then(() => console.log("Actions seeded"));
});

app.use(cors());

app.use('/', routes);

async function seedActions()
{
    await prisma.action.createMany({
        data: [
            {
                actionName: 'message',
                serviceName: 'Discord',
                description: '/message command',
            },
            {
                actionName: 'meeting',
                serviceName: 'Discord',
                description: '/meeting command',
            },
            {
                actionName: 'message',
                serviceName: 'Teams',
                description: '@AREA Send Message command',
            },
            {
                actionName: 'meeting',
                serviceName: 'Teams',
                description: '@AREA Create Meeting command',
            },
            {
                actionName: 'weather_now',
                serviceName: 'Discord',
                description: '/weather_now command',
            },
            {
                actionName: 'weather_forecast_hours',
                serviceName: 'Discord',
                description: '/weather_forecast_hours command',
            },
            {
                actionName: 'rank',
                serviceName: 'Discord',
                description: '/rank command',
            },
            {
                actionName: 'progress',
                serviceName: 'Discord',
                description: '/progress command',
            },
        ],
        skipDuplicates: true,
    });
}

app.listen(appConfig.port, appConfig.host, () => {
    console.log('[' + appConfig.envName + '] Server is running at ' + appConfig.host + ':' + appConfig.port)
});
