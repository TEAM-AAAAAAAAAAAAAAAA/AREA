import { Express } from 'express'
import express from 'express'
import { routes } from './routes';
import { env } from './config/env';
import bodyParser from 'body-parser'; import { sendMail } from './utils/mailer';
import csrf from 'csurf';
import passport from 'passport';
import { services } from './services/.services';
import { Request, Response } from 'express';
import { prisma } from './config/db';

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
});

app.use('/', routes);

app.get('/about.json', async (req: Request, res: Response) => {
    let services: any = await prisma.service.findMany().then((res: any) => {
        return res;
    });
    let actions: any = await prisma.action.findMany().then((res: any) => {
        return res;
    });
    let reactions: any = await prisma.reaction.findMany().then((res: any) => {
        return res;
    });
    let aboutServices: [any] = [{}];

    aboutServices.pop()
    for (let i = 0; i < services.length; i++) {
        let aboutActions: [any] = [{}];
        aboutActions.pop()
        let aboutReactions: [any] = [{}];
        aboutReactions.pop()
        for (let j = 0; j < actions.length; j++)
            if (actions[j].serviceName == services[i].serviceName)
                aboutActions.push({
                    name: actions[j].actionName,
                    description: actions[j].description
                })
        for (let j = 0; j < reactions.length; j++)
            if (reactions[j].serviceName == services[i].serviceName)
                aboutReactions.push({
                    description: reactions[j].description
                })
        aboutServices.push({
            name: services[i].serviceName,
            actions: aboutActions,
            reactions: aboutReactions
        })
    }
    res.status(200).send(aboutServices);
});

app.listen(appConfig.port, appConfig.host, () => {
    console.log('[' + appConfig.envName + '] Server is running at ' + appConfig.host + ':' + appConfig.port)
});
