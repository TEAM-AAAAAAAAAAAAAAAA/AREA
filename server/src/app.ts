import { Express } from 'express'
import express from 'express'
import { routes } from './routes';
import { env } from './config/env';
import bodyParser from 'body-parser';
import csrf from 'csurf';
import passport from 'passport';

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

app.use('/', routes);

app.listen(appConfig.port, appConfig.host, () => {
    console.log('[' + appConfig.envName + '] Server is running at ' + appConfig.host + ':' + appConfig.port)
});
