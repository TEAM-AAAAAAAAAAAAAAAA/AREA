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
        serviceName: String!
    }

    type Reaction {
        reactionId: Int!
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
        serviceName: String!
    }

    type ActionReaction {
        action: Reaction!
        reaction: Reaction!
    }

    type Query {
        user(id: ID!): User
        allUsers: [User!]!
        allServices: [Service!]!
        allWebhooks: [Webhook!]!
        allReactions: [Reaction!]!
        allActions: [Action!]!
        allActionReactions: [ActionReaction!]!
    }

    type Mutation {
        removeWebhooks: Int!
        createAction(actionName: String!, serviceName: String!): Int!
        createWebhook(userId: String!, actionId: String!, serviceId: String!, outgoingWebhook: String!): Int!
        createUser(name: String!, email: String!, password: String!): Int!
        createService(name: String!): Int!
        createChainedReaction(actionId: Int!, serviceName: String!, actionName: String!, outgoingWebhook: String!): Int!
    }

    scalar DateTime
`;

export const resolvers = {
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
            const myHonest = await context.prisma.reaction.create({
                data: {
                    actionName: args.actionName,
                    serviceName: args.serviceName,
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
            await context.prisma.action.create({
                data: {
                    actionName: args.actionName,
                    service: {
                        connect: {
                            serviceName: args.serviceName
                        }
                    }
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
            const myHonest = await context.prisma.reaction.create({
                data: {
                    serviceName: args.serviceId,
                    actionName: args.actionId,
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