import { gql } from 'apollo-server';
import { DateTimeResolver } from 'graphql-scalars';
import { Context } from '../context';

export const typeDefs = gql`
    type User {
        id: ID!
        name: String!
        email: [String!]!
        created_at: DateTime!
    }

    type Query {
        user(id: ID!): User
        allUsers: [User!]!
    }

    scalar DateTime
`;

export const resolvers = {
    Query: {
        user: async (_: any, args: any, context: Context) => {
            return await context.prisma.user.findUnique({
                where: {
                    id: args.id
                }
            });
        },
        allUsers: async (_: any, args: any, context: Context) => {
            return await context.prisma.user.findMany();
        }
    }
};