import {
    ApolloClient,
    InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
    uri: `http://${process.env.SERVER_IP}:4000/`,
    cache: new InMemoryCache(),
});