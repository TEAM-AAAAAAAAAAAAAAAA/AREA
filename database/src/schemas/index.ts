import { gql } from 'apollo-server';
import { DateTimeResolver } from 'graphql-scalars';
import GraphQLJSON from 'graphql-type-json';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Context } from '../context';

export const typeDefs = gql`
"""
A custom scalar type representing a JSON object. The JSON object can contain
any valid JSON data type: string, number, object, array, boolean, or null.
"""
scalar JSON

"""
A custom scalar type representing a JSON object. The JSON object can only
contain key-value pairs where the keys are strings and the values are any valid
JSON data type: string, number, object, array, boolean, or null.
"""
scalar JSONObject

"""
A custom scalar type representing a date and time in ISO 8601 format.
For example, "2019-11-19T23:55:34Z" represents November 19, 2019 at
23:55:34 UTC.
"""
scalar DateTime

"""
An enumeration representing the types of tokens that can be created.
"""
enum TokenType {
  EMAIL_VERIFICATION
  API
  PASSWORD_RESET
}

"""
A user object with a unique identifier, name, email, and creation date.
"""
type User {
  id: ID!
  name: String!
  email: String!
  createdAt: DateTime!
}

"""
A service object representing a third-party service that can be integrated with.
"""
type Service {
  """
  The name of the service.
  """
  serviceName: String!
}

"""
A reaction object representing a reaction that can be triggered by a webhook.
"""
type Reaction {
  """
  The unique identifier of the reaction.
  """
  reactionId: Int!

  """
  The name of the reaction.
  """
  reactionName: String!

  """
  The name of the service associated with the reaction.
  """
  serviceName: String!

  """
  The service associated with the reaction.
  """
  service: Service!

  """
  The React object representing the action to be taken when the reaction is triggered.
  """
  react: React!

  """
  The URL of the outgoing webhook associated with the reaction.
  """
  outgoingWebhook: String

  """
  The incoming webhook associated with the reaction.
  """
  incomingWebhook: Webhook

  """
  A flag indicating whether the reaction is enabled or not.
  """
  enabled: Boolean!

  """
  A flag indicating whether the reaction is part of a chain or not.
  """
  enabledChain: Boolean!
}

"""
A React object representing an action that can be taken when a webhook is triggered.
"""
type React {
  """
  The name of the action.
  """
  reactionName: String!

  """
  A description of the action.
  """
  description: String!

  """
  The name of the service associated with the action.
  """
  serviceName: String!

  """
  The service associated with the action.
  """
  service: Service!
}

type ActionWebhook {
  action: Action!
  actionName: String!
  service: Service!
  serviceName: String!
  user: User!
  userId: String!
  webhook: Webhook!
  webhookId: String!
}

"""
A webhook object representing a webhook that can be triggered by an external source.
"""
type Webhook {
  """
  The unique identifier of the webhook.
  """
  webhookId: String!

  """
  The user associated with the webhook.
  """
  user: User!

  """
  The Reaction object representing the reaction to be triggered when the webhook is activated.
  """
  reaction: Reaction!

  """
  The Service object representing the external service from which the webhook originates.
  """
  incomingService: Service!
}

"""
An action object representing an action that can be taken by a user.
"""
type Action {
  """
  The name of the action.
  """
  actionName: String!

  """
  A description of the action.
  """
  description: String!

  """
  The name of the service associated with the action.
  """
  serviceName: String!
}

"""
An action-reaction pair that defines what should happen when an action occurs
"""
type ActionReaction {
    action: Reaction!
    reaction: Reaction!
}

"""
An OAuth provider used for authentication
"""
type oAuthProvider {
    oAuthProviderName: String!
    service: Service
    serviceName: String
}

"""
OAuth user data associated with a user account
"""
type oAuthUserData {
    user: User!
    data: JSONObject
    oAuthProvider: oAuthProvider!
    accessToken: String
    refreshToken: String
}

"""
Discord bot webhook data
"""
type DiscordBotWebhook {
    command: String!
    webhookWebhookId: String!
    webhook: Webhook!
    userId: String!
    serverId: String!
    user: User!
}

"""
A token used for authentication
"""
type Token {
    id: String!
    userId: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    valid: Boolean!
    user: User!
    type: TokenType!
}

"""
The root query object of the schema
"""
type Query {
    """
    Retrieves a user by ID
    """
    user(id: ID!): User

    """
    Retrieves all users
    """
    allUsers: [User!]!

    """
    Retrieves all services
    """
    allServices: [Service!]!

    """
    Retrieves all webhooks
    """
    allWebhooks: [Webhook!]!

    """
    Retrieves all reactions
    """
    allReact: [React!]!

    """
    Retrieves all reactions
    """
    allReactions: [Reaction!]!

    """
    Retrieves all actions
    """
    allActions: [Action!]!

    """
    Retrieves all action-reaction pairs
    """
    allActionReactions: [ActionReaction!]!

    """
    Retrieves all OAuth user data
    """
    allOAuthUserData: [oAuthUserData!]!

    """
    Retrieves all OAuth providers
    """
    allOAuthProviders: [oAuthProvider!]!

    """
    Retrieves information about a webhook
    """
    userInfo(id: ID!): [Webhook!]!

    """
    Retrieves all Discord bot webhooks
    """
    allDiscordBotWebhooks: [DiscordBotWebhook!]!

    """
    Retrieves all tokens
    """
    allTokens: [Token!]!

    getUserFromToken(token: String!): User!
    allActionWebhooks: [ActionWebhook!]!
    getWebhook(reactionId: Int!): Webhook!
}

"""
The root mutation type for modifying data in the system.
"""
type Mutation {
  createReaction(reactionName: String!, serviceName: String!, outgoingWebhook: String, userId: String!): Int!

  enableReaction(reactionId: Int!): Int!

  disableReaction(reactionId: Int!): Int!

  linkActionWebhook(reactionId: Int!, userId: String!, actionName: String!, serviceName: String!): Int!

  """
  Create a new action with the specified name, description, and service name.
  """
  createAction(actionName: String!, description: String!, serviceName: String!): Int!

  """
  Create a new webhook with the specified user ID, reaction name, action ID, service ID, and optional outgoing webhook URL.
  """
  createWebhook(userId: String!, reactionName: String!, actionId: String!, serviceId: String!, outgoingWebhook: String): Int!

  """
  Create a new user with the specified name, email, and password.
  """
  createUser(name: String!, email: String!, password: String!): Int!

  """
  Create a new service with the specified name.
  """
  createService(name: String!): Int!

  """
  Create a new chained reaction with the specified action name, action service name, reaction name, reaction service name, and optional outgoing webhook URLs.
  """
  createChainedReaction(actionId: Int!, reactionId: Int!): Int!

  """
  Create new OAuth user data with the specified user ID, refresh token, access token, data, OAuth provider name, and provider user ID.
  """
  createOAuthUserData(userId: String!, refreshToken: String, accessToken: String, data: JSONObject, oAuthProviderName: String!, providerUserId: String!): Int!

  """
  Create a new Discord bot webhook with the specified command, user ID, server ID, reaction name, action ID, service ID, and optional outgoing webhook URL.
  """
  createDiscordBotWebhook(command: String!, userId: String!, serverId: String!, webhookId: String): Int!

  """
  Create a new token with the specified user ID and token type.
  """
  createToken(userId: String!, type: TokenType!): Token!

  """
  Delete the service with the specified name.
  """
  deleteService(name: String!): Int!
}
`;

export const resolvers = {
    JSON: GraphQLJSON,
    JSONObject: GraphQLJSONObject,
    DateTime: DateTimeResolver,

    ActionWebhook: {
        action: async (parent: any, _: any, context: Context) => {
            return await context.prisma.actionWebhook.findUnique({ where: { serviceName_actionName_userId: { actionName: parent.actionName, serviceName: parent.serviceName, userId: parent.userId } } }).action();
        },
        service: async (parent: any, _: any, context: Context) => {
            return await context.prisma.actionWebhook.findUnique({ where: { serviceName_actionName_userId: { actionName: parent.actionName, serviceName: parent.serviceName, userId: parent.userId } } }).service();
        },
        webhook: async (parent: any, _: any, context: Context) => {
            return await context.prisma.actionWebhook.findUnique({ where: { serviceName_actionName_userId: { actionName: parent.actionName, serviceName: parent.serviceName, userId: parent.userId } } }).webhook();
        },
        user: async (parent: any, _: any, context: Context) => {
            return await context.prisma.actionWebhook.findUnique({ where: { serviceName_actionName_userId: { actionName: parent.actionName, serviceName: parent.serviceName, userId: parent.userId } } }).user();
        }
    },
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
        incomingWebhook: async (parent: any, _: any, context: Context) => {
            return await context.prisma.reaction.findUnique({ where: { reactionId: parent.reactionId } }).incomingWebhook();
        },
        react: async (parent: any, _: any, context: Context) => {
            return await context.prisma.reaction.findUnique({ where: { reactionId: parent.reactionId } }).react();
        },
        service: async (parent: any, _: any, context: Context) => {
            return await context.prisma.reaction.findUnique({ where: { reactionId: parent.reactionId } }).service();
        }
    },
    Query: {
        getWebhook: async (_: any, args: any, context: Context) => {
            return await context.prisma.webhook.findUnique({ where: { reactionId: args.reactionId } });
        },
        allActionWebhooks: async (_: any, args: any, context: Context) => {
            return await context.prisma.actionWebhook.findMany();
        },
        getUserFromToken: async (_: any, args: any, context: Context) => {
            return await context.prisma.token.findUnique({ where: { id: args.token } }).user();
        },
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
        linkActionWebhook: async (_: any, args: any, context: Context) => {
            await context.prisma.actionWebhook.create({
                data: {
                    service: { connect: { serviceName: args.serviceName } },
                    action: {
                        connect: {
                            actionName_serviceName: {
                                actionName: args.actionName,
                                serviceName: args.serviceName
                            }
                        }
                    },
                    webhook: {
                        create: {
                            userId: args.userId,
                            reactionId: args.reactionId,
                            incomingServiceName: args.serviceName,
                        }
                    },
                    user: { connect: { id: args.userId } }
                }
            })
            return 200;
        },
        createReaction: async (_: any, args: any, context: Context) => {
            const reaction = await context.prisma.reaction.create({
                data: {
                    service: {
                        connect: {
                            serviceName: args.serviceName
                        }
                    },
                    react: {
                        connect: {
                            serviceName_reactionName: {
                                reactionName: args.reactionName,
                                serviceName: args.serviceName
                            }
                        }
                    },
                    outgoingWebhook: args.outgoingWebhook,
                }
            });
            return 200;
        },
        disableReaction: async (_: any, args: any, context: Context) => {
            await context.prisma.reaction.update({
                where: {
                    reactionId: args.reactionId
                },
                data: {
                    enabled: false
                }
            });
            return 200;
        },
        enableReaction: async (_: any, args: any, context: Context) => {
            await context.prisma.reaction.update({
                where: {
                    reactionId: args.reactionId
                },
                data: {
                    enabled: true
                }
            });
            return 200;
        },
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
                        connect: {
                            webhookId: args.webhookId
                    }
                }
            }});
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
                    actionId: args.actionId,
                    reactionId: args.reactionId
                }
            });
            return 200
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