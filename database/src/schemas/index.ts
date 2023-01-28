import { gql } from 'apollo-server';
import { DateTimeResolver } from 'graphql-scalars';
import { Context } from '../context';

export const typeDefs = gql`
    type User {
        id: ID!
        name: String!
        email: String!
        created_at: DateTime!
    }

    type Service {
        id: ID!
        name: String!
    }

    type CreateUserResponse {
        code: Int!
        success: Boolean!
        message: String!
        user: User
    }

    type Query {
        user(id: ID!): User
        allUsers: [User!]!
        allServices: [Service!]!
    }

    type Mutation {
        createUser(name: String!, email: String!, password: String!): CreateUserResponse!
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
        },
        allServices: async (_: any, args: any, context: Context) => {
            return await context.prisma.service.findMany();
        }
    },
    Mutation: {
        createUser: async (_: any, args: any, context: Context) => {
            if (args.name === undefined || args.name === '') {
                return await context.prisma.createUserResponse.create({
                    data: {
                        code: 400,
                        success: false,
                        message: "Name is required"
                    },
                });
            }
            if (args.email === undefined || args.email === '') {
                return await context.prisma.createUserResponse.create({
                    data: {
                        code: 400,
                        success: false,
                        message: "Email is required"
                    },
                });
            }
            if (args.password === undefined || args.password === '') {
                return await context.prisma.createUserResponse.create({
                    data: {
                        code: 400,
                        success: false,
                        message: "Password is required"
                    },
                });
            }
            if (await context.prisma.user.findUnique({
                where: {
                    email: args.email
                }
            })) {
                return await context.prisma.createUserResponse.create({
                    data: {
                        code: 400,
                        success: false,
                        message: "Email already in use"
                    },
                });
            }
            const u = await context.prisma.user.create({
                data: {
                    name: args.name,
                    email: args.email,
                    password: args.password
                }
            })
            return await context.prisma.createUserResponse.create({
                data: {
                    code: 200,
                    success: true,
                    message: "User created successfully",
                    user: {
                        connect: {
                            id: u.id
                        }
                }
                },
            });
        }
    }
};