import { gql } from 'apollo-server';
import { DateTimeResolver } from 'graphql-scalars';
import GraphQLJSON from 'graphql-type-json';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Context } from '../context';

export const typeDefs = gql`
scalar JSON
scalar JSONObject
scalar DateTime

enum TokenType {
    EMAIL_VERIFICATION
    API
    PASSWORD_RESET
  }

    type User {
        id: ID!
        name: String!
        email: String!
        createdAt: DateTime!
    }

    type Service {
        serviceName: String!
    }

    type Reaction {
        reactionId: Int!
        serviceName: String!
        service: Service!
        reactionName: String!
        react: React!
        outgoingWebhook: String
        enabled: Boolean!
        enabledChain: Boolean!
    }

    type React {
        reactionName: String!
        description: String!
        serviceName: String!
        service: Service!
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
        service: Service
        serviceName: String
    }

    type oAuthUserData {
        user: User!
        data: JSONObject
        oAuthProvider: oAuthProvider!
        accessToken: String
        refreshToken: String
    }

    type DiscordBotWebhook {
        command: String!
        webhookWebhookId: String!
        webhook: Webhook!
        userId: String!
        serverId: String!
        user: User!
    }

    type Token {
        id: String!
        userId: String!
        createdAt: DateTime!
        updatedAt: DateTime!
        valid: Boolean!
        user: User!
        type: TokenType!
    }

    type Query {
        user(id: ID!): User
        allUsers: [User!]!
        allServices: [Service!]!
        allWebhooks: [Webhook!]!
        allReact: [React!]!
        allReactions: [Reaction!]!
        allActions: [Action!]!
        allActionReactions: [ActionReaction!]!
        allOAuthUserData: [oAuthUserData!]!
        allOAuthProviders: [oAuthProvider!]!
        userInfo(id: ID!): [Webhook!]!
        allDiscordBotWebhooks: [DiscordBotWebhook!]!
        allTokens: [Token!]!
    }

    type Mutation {
        removeWebhooks: Int!
        createAction(actionName: String!, description: String!, serviceName: String!): Int!
        createWebhook(userId: String!, reactionName: String!, actionId: String!, serviceId: String!, outgoingWebhook: String): Int!
        createUser(name: String!, email: String!, password: String!): Int!
        createService(name: String!): Int!
        createChainedReaction(actionId: Int!, reactionName: String!, serviceName: String!, actionName: String!, outgoingWebhook: String): Int!
        createOAuthUserData(userId: String!, refreshToken: String, accessToken: String, data: JSONObject, oAuthProviderName: String!, providerUserId: String!): Int!
        createDiscordBotWebhook(command: String!, userId: String!, serverId: String!, reactionName: String!, actionId: String!, serviceId: String!, outgoingWebhook: String): Int!
        createToken(userId: String!, type: TokenType!): Token!
        deleteService(name: String!): Int!
    }
`;

export const resolvers = {
    JSON: GraphQLJSON,
    JSONObject: GraphQLJSONObject,
    DateTime: DateTimeResolver,
    oAuthProvider: {
        service: async (parent: any, _: any, context: Context) => {
            return await context.prisma.oAuthProvider.findUnique({ where: { oAuthProviderName: parent.oAuthProviderName } }).service();
        }
    },
    Token: {
        user: async (parent: any, _: any, context: Context) => {
            return await context.prisma.token.findUnique({ where: { id: parent.id } }).user();
        }
    },
    DiscordBotWebhook: {
        webhook: async (parent: any, _: any, context: Context) => {
            return await context.prisma.discordBotWebhook.findUnique({ where: { command_userId_serverId: { serverId: parent.serverId, command: parent.command, userId: parent.userId } } }).webhook();
        },
        user: async (parent: any, _: any, context: Context) => {
            return await context.prisma.discordBotWebhook.findUnique({ where: { command_userId_serverId: { serverId: parent.serverId, command: parent.command, userId: parent.userId } } }).user();
        }
    },
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
    React: {
        service: async (parent: any, _: any, context: Context) => {
            return await context.prisma.react.findUnique({ where: { serviceName_reactionName: { reactionName: parent.reactionName, serviceName: parent.serviceName } } }).service();
        }
    },
    Reaction: {
        react: async (parent: any, _: any, context: Context) => {
            return await context.prisma.reaction.findUnique({ where: { reactionId: parent.reactionId } }).react();
        },
        service: async (parent: any, _: any, context: Context) => {
            return await context.prisma.reaction.findUnique({ where: { reactionId: parent.reactionId } }).service();
        }
    },
    Query: {
        allTokens: async (_: any, args: any, context: Context) => {
            return await context.prisma.token.findMany();
        },
        allDiscordBotWebhooks: async (_: any, args: any, context: Context) => {
            return await context.prisma.discordBotWebhook.findMany();
        },
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
        allReact: async (_: any, args: any, context: Context) => {
            return await context.prisma.react.findMany();
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
        deleteService: async (_: any, args: any, context: Context) => {
            const webhooks = await context.prisma.webhook.findMany({
                where: {
                    incomingServiceName: args.name
                }
            });
            for (const webhook of webhooks)
                await context.prisma.discordBotWebhook.deleteMany({
                    where: {
                        webhook: webhook
                    }
                });
            await context.prisma.webhook.deleteMany({
                where: {
                    incomingServiceName: args.name
                }
            });
            await context.prisma.reaction.deleteMany({
                where: {
                    serviceName: args.name
                }
            });
            await context.prisma.action.deleteMany({
                where: {
                    serviceName: args.name
                }
            });
            await context.prisma.react.deleteMany({
                where: {
                    serviceName: args.name
                }
            });
            await context.prisma.oAuthProvider.deleteMany({
                where: {
                    serviceName: args.name
                }
            });
            await context.prisma.service.delete({
                where: {
                    serviceName: args.name
                }
            });
            return 200
        },
        createToken: async (_: any, args: any, context: Context) => {
            await context.prisma.token.create({
                data: {
                    type: args.type,
                    userId: args.userId
                }
            });
            return 200
        },
        createDiscordBotWebhook: async (_: any, args: any, context: Context) => {
            await context.prisma.discordBotWebhook.create({
                data: {
                    command: args.command,
                    serverId: args.serverId,
                    user: {
                        connect: {
                            id: args.userId
                        },
                    },
                    webhook: {
                        create: {
                            user: {
                                connect: {
                                    id: args.userId,
                                }
                            },
                            reaction: {
                                create: {
                                    serviceName: args.serviceId,
                                    reactionName: args.reactionName,
                                    outgoingWebhook: args.outgoingWebhook,
                                }
                            },
                            incomingService: {
                                connect: {
                                    serviceName: args.serviceId,
                                }
                            },
                        }
                    }
                }
            });
            return 200
        },
        createOAuthUserData: async (_: any, args: any, context: Context) => {
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
            await context.prisma.actionReaction.create({
                data: {
                    action: {
                        connect: {
                            reactionId: args.actionId
                        }
                    },
                    reaction: {
                        create: {
                            reactionName: args.reactionName,
                            serviceName: args.serviceName,
                            outgoingWebhook: args.outgoingWebhook,
                        }
                    },
                }
            });
            return 200
        },
        removeWebhooks: async (_: any, args: any, context: Context) => {
            await context.prisma.webhook.deleteMany();
            return 200;
        },
        createAction: async (_: any, args: any, context: Context) => {
            await context.prisma.action.create({
                data: {
                    actionName: args.actionName,
                    serviceName: args.serviceName,
                    description: args.description
                }
            });
            return 200
        },
        createWebhook: async (_: any, args: any, context: Context) => {
            await context.prisma.webhook.create({
                data: {
                    user: {
                        connect: {
                            id: args.userId,
                        }
                    },
                    reaction: {
                        create: {
                            serviceName: args.serviceId,
                            reactionName: args.reactionName,
                            outgoingWebhook: args.outgoingWebhook,
                        }
                    },
                    incomingService: {
                        connect: {
                            serviceName: args.serviceId,
                        }
                    },
                },
            });
            return 200
        },
        createService: async (_: any, args: any, context: Context) => {
            await context.prisma.service.create({
                data: {
                    serviceName: args.name
                }
            });
            return 200
        },
        createUser: async (_: any, args: any, context: Context) => {
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