import { ApolloServer } from 'apollo-server';
import { resolvers, typeDefs } from './schemas/index';
import { context } from './context';
import { env } from './config/env';
import { seed } from './config/seed';

seed();

new ApolloServer({ resolvers, typeDefs, context }).listen({ port: env.APOLLO_PORT }, () => {
    console.log('🚀 [' + env.ENV_NAME + '] Server is running at ' + env.APOLLO_HOST + ':' + env.APOLLO_PORT);
});
