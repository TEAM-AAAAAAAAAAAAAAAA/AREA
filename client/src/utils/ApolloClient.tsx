import {
    ApolloClient,
    InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
    uri: `http://${process.env.REACT_APP_SERVER_IP}:4000/`,
    cache: new InMemoryCache(),
});