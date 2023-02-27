import { gql } from 'apollo-server';
import { DateTimeResolver } from 'graphql-scalars';
import GraphQLJSON from 'graphql-type-json';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Context } from '../context';

export const typeDefs = gql`
scalar JSON
scalar JSONObject

    type User {
        id: ID!
        name: String!
        email: String!
        created_at: DateTime!
    }

    type Service {
        serviceName: String!
    }

    type Reaction {
        reactionId: Int!
        descrition: String!
        service: Service!
        outgoingWebhook: String!
    }

    type Webhook {
        webhookId: String!
        user: User!
        reaction: Reaction!
        incomingService: Service!
    }

    type Action {
        actionName: String!
        description: String!
        serviceName: String!
    }

    type ActionReaction {
        action: Reaction!
        reaction: Reaction!
    }

    type oAuthProvider {
        oAuthProviderName: String!
    }

    type oAuthUserData {
        user: User!
        data: JSONObject
        oAuthProvider: oAuthProvider!
        accessToken: String
        refreshToken: String
    }

    type Query {
        user(id: ID!): User
        allUsers: [User!]!
        allServices: [Service!]!
        allWebhooks: [Webhook!]!
        allReactions: [Reaction!]!
        allActions: [Action!]!
        allActionReactions: [ActionReaction!]!
        allOAuthUserData: [oAuthUserData!]!
        allOAuthProviders: [oAuthProvider!]!
        userInfo(id: ID!): [Webhook!]!
    }

    type Mutation {
        removeWebhooks: Int!
        createAction(actionName: String!, description: String!, serviceName: String!): Int!
        createWebhook(userId: String!, actionId: String!, serviceId: String!, description: String!, outgoingWebhook: String!): Int!
        createUser(name: String!, email: String!, password: String!): Int!
        createService(name: String!): Int!
        createChainedReaction(actionId: Int!, description: String!, serviceName: String!, actionName: String!, outgoingWebhook: String!): Int!
        createOAuthUserData(userId: String!, refreshToken: String, accessToken: String, data: JSONObject, oAuthProviderName: String!, providerUserId: String!): Int!
    }

    scalar DateTime
`;

export const resolvers = {
    JSON: GraphQLJSON,
    JSONObject: GraphQLJSONObject,
    oAuthUserData: {
        user: async (parent: any, _: any, context: Context) => {
            return await context.prisma.oAuthUserData.findUnique({ where: { oAuthUserDataId: parent.oAuthUserDataId } }).user();
        },
        oAuthProvider: async (parent: any, _: any, context: Context) => {
            return await context.prisma.oAuthUserData.findUnique({ where: { oAuthUserDataId: parent.oAuthUserDataId } }).oAuthProvider();
        },
    },
    ActionReaction: {
        action: async (parent: any, _: any, context: Context) => {
            return await context.prisma.actionReaction.findUnique({ where: { id: parent.id } }).action();
        },
        reaction: async (parent: any, _: any, context: Context) => {
            return await context.prisma.actionReaction.findUnique({ where: { id: parent.id } }).reaction();
        }
    },
    Webhook: {
        user: async (parent: any, _: any, context: Context) => {
            return await context.prisma.webhook.findUnique({ where: { webhookId: parent.webhookId } }).user();
        },
        reaction: async (parent: any, _: any, context: Context) => {
            return await context.prisma.webhook.findUnique({ where: { webhookId: parent.webhookId } }).reaction();
        },
        incomingService: async (parent: any, _: any, context: Context) => {
            return await context.prisma.webhook.findUnique({ where: { webhookId: parent.webhookId } }).incomingService();
        }
    },
    Reaction: {
        service: async (parent: any, _: any, context: Context) => {
            return await context.prisma.reaction.findUnique({ where: { reactionId: parent.reactionId } }).service();
        }
    },
    Query: {
        userInfo: async (_: any, args: any, context: Context) => {
            return await context.prisma.webhook.findMany({
                where: {
                    userId: args.id
                }
            });
        },
        allOAuthProviders: async (_: any, args: any, context: Context) => {
            return await context.prisma.oAuthProvider.findMany();
        },
        allOAuthUserData: async (_: any, args: any, context: Context) => {
            return await context.prisma.oAuthUserData.findMany();
        },
        allActions: async (_: any, args: any, context: Context) => {
            return await context.prisma.action.findMany();
        },
        allWebhooks: async (_: any, args: any, context: Context) => {
            return await context.prisma.webhook.findMany();
        },
        allReactions: async (_: any, args: any, context: Context) => {
            return await context.prisma.reaction.findMany();
        },
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
        },
        allActionReactions: async (_: any, args: any, context: Context) => {
            return await context.prisma.actionReaction.findMany();
        }
    },
    Mutation: {
        createOAuthUserData: async (_: any, args: any, context: Context) => {
            if (args.userId === undefined || args.userId === '') {
                return 400
            }
            if (args.oAuthProviderName === undefined || args.oAuthProviderName === '') {
                return 400
            }
            if (args.providerUserId === undefined || args.providerUserId === '') {
                return 400
            }
            const accToken = args.accessToken === undefined ? '' : args.accessToken
            const refToken = args.refreshToken === undefined ? '' : args.refreshToken
            const myData = args.data === undefined ? {} : args.data
            await context.prisma.oAuthUserData.create({
                data: {
                    userId: args.userId,
                    refreshToken: refToken,
                    providerUserId: args.providerUserId,
                    accessToken: accToken,
                    data: myData,
                    oAuthProviderName: args.oAuthProviderName
                }
            });
            return 200
        },
        createChainedReaction: async (_: any, args: any, context: Context) => {
            if (args.actionId === undefined || args.actionId === '') {
                return 400
            }
            if (args.actionName === undefined || args.actionName === '') {
                return 400
            }
            if (args.outgoingWebhook === undefined || args.outgoingWebhook === '') {
                return 400
            }
            if (args.serviceName === undefined || args.serviceName === '') {
                return 400
            }
            if (args.description === undefined || args.description === '') {
                return 400
            }
            const myHonest = await context.prisma.reaction.create({
                data: {
                    actionName: args.actionName,
                    serviceName: args.serviceName,
                    description: args.description,
                    outgoingWebhook: args.outgoingWebhook,
                }
            });
            await context.prisma.actionReaction.create({
                data: {
                    actionId: args.actionId,
                    reactionId: myHonest.reactionId,
                }
            });
            return 200
        },
        removeWebhooks: async (_: any, args: any, context: Context) => {
            await context.prisma.webhook.deleteMany();
            return 200;
        },
        createAction: async (_: any, args: any, context: Context) => {
            if (args.actionName === undefined || args.actionName === '') {
                return 400
            }
            if (args.serviceName === undefined || args.serviceName === '') {
                return 400
            }
            if (args.description === undefined || args.description === '') {
                return 400
            }
            await context.prisma.action.create({
                data: {
                    actionName: args.actionName,
                    description: args.description,
                    serviceName: args.serviceName,
                }
            });
            return 200
        },
        createWebhook: async (_: any, args: any, context: Context) => {
            if (args.userId === undefined || args.userId === '') {
                return 400
            }
            if (args.actionId === undefined || args.actionId === '') {
                return 400
            }
            if (args.serviceId === undefined || args.serviceId === '') {
                return 400
            }
            if (args.outgoingWebhook === undefined || args.outgoingWebhook === '') {
                return 400
            }
            if (args.description === undefined || args.description === '') {
                return 400
            }
            const myHonest = await context.prisma.reaction.create({
                data: {
                    serviceName: args.serviceId,
                    actionName: args.actionId,
                    description: args.description,
                    outgoingWebhook: args.outgoingWebhook,
                }
            });
            await context.prisma.webhook.create({
                data: {
                    userId: args.userId,
                    reactionId: myHonest.reactionId,
                    incomingServiceName: args.serviceId,
                },
            });
            return 200
        },
        createService: async (_: any, args: any, context: Context) => {
            if (args.name === undefined || args.name === '') {
                return 400
            }
            await context.prisma.service.create({
                data: {
                    serviceName: args.name
                }
            });
            return 200
        },
        createUser: async (_: any, args: any, context: Context) => {
            if (args.name === undefined || args.name === '') {
                return 400
            }
            if (args.email === undefined || args.email === '') {
                return 400
            }
            if (args.password === undefined || args.password === '') {
                return 400
            }
            await context.prisma.user.create({
                data: {
                    name: args.name,
                    email: args.email,
                    password: args.password
                }
            })
            return 200
        }
    }
};