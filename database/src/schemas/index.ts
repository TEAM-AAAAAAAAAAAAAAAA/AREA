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

    type CreateUserResponse {
        code: Int!
        success: Boolean!
        message: String!
        user: User
    }

    type CreateServiceResponse {
        code: Int!
        success: Boolean!
        message: String!
        service: Service
    }

    type CreateWebhookResponse {
        code: Int!
        success: Boolean!
        message: String!
        webhook: Webhook
    }

    type Query {
        user(id: ID!): User
        allUsers: [User!]!
        allServices: [Service!]!
        allWebhooks: [Webhook!]!
        allReactions: [Reaction!]!
        allActions: [Action!]!
    }

    type CreateActionResponse {
        code: Int!
        success: Boolean!
        message: String!
        action: Action
    }

    type Mutation {
        removeWebhooks: Int!
        createAction(actionName: String!, serviceName: String!): CreateActionResponse!
        createWebhook(userId: String!, actionId: String!, serviceId: String!, outgoingWebhook: String!): CreateWebhookResponse!
        createUser(name: String!, email: String!, password: String!): CreateUserResponse!
        createService(name: String!): CreateServiceResponse!
    }

    scalar DateTime
`;

export const resolvers = {
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
        }
    },
    Mutation: {
        removeWebhooks: async (_: any, args: any, context: Context) => {
            await context.prisma.webhook.deleteMany();
            return 1;
        },
        createAction: async (_: any, args: any, context: Context) => {
            if (args.actionName === undefined || args.actionName === '') {
                return await context.prisma.createActionResponse.create({
                    data: {
                        code: 400,
                        success: false,
                        message: "Action name is required"
                    },
                });
            }
            if (args.serviceName === undefined || args.serviceName === '') {
                return await context.prisma.createActionResponse.create({
                    data: {
                        code: 400,
                        success: false,
                        message: "Service name is required"
                    },
                });
            }
            return await context.prisma.createActionResponse.create({
                data: {
                    code: 200,
                    success: true,
                    message: "Action created successfully",
                    action: {
                        create: {
                            actionName: args.actionName,
                            service: {
                                connect: {
                                    serviceName: args.serviceName
                                }
                            }
                        }
                    }
                }
            });
        },
        createWebhook: async (_: any, args: any, context: Context) => {
            if (args.userId === undefined || args.userId === '') {
                return await context.prisma.createWebhookResponse.create({
                    data: {
                        code: 400,
                        success: false,
                        message: "User ID is required"
                    },
                });
            }
            if (args.actionId === undefined || args.actionId === '') {
                return await context.prisma.createWebhookResponse.create({
                    data: {
                        code: 400,
                        success: false,
                        message: "Action ID is required"
                    },
                });
            }
            if (args.serviceId === undefined || args.serviceId === '') {
                return await context.prisma.createWebhookResponse.create({
                    data: {
                        code: 400,
                        success: false,
                        message: "Service ID is required"
                    },
                });
            }
            if (args.outgoingWebhook === undefined || args.outgoingWebhook === '') {
                return await context.prisma.createWebhookResponse.create({
                    data: {
                        code: 400,
                        success: false,
                        message: "Outgoing webhook is required"
                    },
                });
            }
            const myHonest = await context.prisma.reaction.create({
                data: {
                    serviceName: args.serviceId,
                    actionName: args.actionId,
                    outgoingWebhook: args.outgoingWebhook,
                }
            });
            return await context.prisma.createWebhookResponse.create({
                data: {
                    code: 200,
                    success: true,
                    message: "Webhook created successfully",
                    webhook: {
                        create: {
                            userId: args.userId,
                            reactionId: myHonest.reactionId,
                            incomingServiceName: args.serviceId,
                        },
                    },
                },
            });
        },
        createService: async (_: any, args: any, context: Context) => {
            if (args.name === undefined || args.name === '') {
                return await context.prisma.createServiceResponse.create({
                    data: {
                        code: 400,
                        success: false,
                        message: "Name is required"
                    },
                });
            }
            if (await context.prisma.service.findUnique({
                where: {
                    serviceName: args.name
                }
            })) {
                return await context.prisma.createServiceResponse.create({
                    data: {
                        code: 400,
                        success: false,
                        message: "Service already exists"
                    },
                });
            }
            return await context.prisma.createServiceResponse.create({
                data: {
                    code: 200,
                    success: true,
                    message: "Service created successfully",
                    service: {
                        create: {
                            serviceName: args.name
                        }
                    }
                }
            });
        },
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