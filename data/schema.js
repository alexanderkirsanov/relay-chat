const {
    GraphQLBoolean,
    GraphQLID,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString
} = require('graphql');

const {
    connectionArgs,
    connectionDefinitions,
    connectionFromArray,
    cursorForObjectInConnection,
    fromGlobalId,
    globalIdField,
    mutationWithClientMutationId,
    nodeDefinitions
} = require('graphql-relay');

const {
    Message,
    User,
    addMessage,
    changeMessage,
    getMessage,
    getMessages,
    getUser,
    getViewer,
    removeMessage
} = require('./database');
const {prop} = require('ramda');

const {nodeInterface, nodeField} = nodeDefinitions(
    globalId => {
        const {type, id} = fromGlobalId(globalId);
        if (type === 'Message') {
            return getMessage(id);
        } else if (type === 'User') {
            return getUser(id);
        }
        return null;
    },
    obj => {
        if (obj instanceof Message) {
            return GraphQLMessage;
        } else if (obj instanceof User) {
            return GraphQLUser;
        }
        return null;
    }
);

const GraphQLMessage = new GraphQLObjectType({
    name: 'Message',
    fields: {
        id: globalIdField('Message'),
        text: {
            type: GraphQLString,
            resolve: prop('text')
        },
        edited: {
            type: GraphQLBoolean,
            resolve: prop('edited')
        },
        date: {
            type: GraphQLString,
            resolve: prop('date')
        }
    },
    interfaces: [nodeInterface]
});

const {connectionType: MessagesConnection, edgeType: GraphQLMessageEdge} = connectionDefinitions({
    name: 'Message',
    nodeType: GraphQLMessage
});

const GraphQLUser = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: globalIdField('User'),
        messages: {
            type: MessagesConnection,
            args: connectionArgs,
            resolve: (obj, args) => connectionFromArray(getMessages(), args)
        },
        totalCount: {
            type: GraphQLInt,
            resolve: () => getMessages().length
        }
    },
    interfaces: [nodeInterface]
});

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        viewer: {
            type: GraphQLUser,
            resolve: () => getViewer()
        },
        node: nodeField
    }
});

const GraphQLNewMessageMutation = mutationWithClientMutationId({
    name: 'NewMessage',
    inputFields: {
        text: {type: new GraphQLNonNull(GraphQLString)}
    },
    outputFields: {
        messageEdge: {
            type: GraphQLMessageEdge,
            resolve: ({localMessageId}) => {
                const message = getMessage(localMessageId);
                return {
                    cursor: cursorForObjectInConnection(getMessages(), message),
                    node: message
                };
            }
        },
        viewer: {
            type: GraphQLUser,
            resolve: () => getViewer()
        }
    },
    mutateAndGetPayload: ({text}) => {
        const localMessageId = addMessage(text);
        return {localMessageId};
    }
});

const GraphQLRemoveMessageMutation = mutationWithClientMutationId({
    name: 'RemoveMessage',
    inputFields: {
        id: {type: new GraphQLNonNull(GraphQLID)}
    },
    outputFields: {
        deletedMessageId: {
            type: GraphQLID,
            resolve: ({id}) => id
        },
        viewer: {
            type: GraphQLUser,
            resolve: () => getViewer()
        }
    },
    mutateAndGetPayload: ({id}) => {
        const localMessageId = fromGlobalId(id).id;
        removeMessage(localMessageId);
        return {id};
    }
});

const GraphQLEditMessageMutation = mutationWithClientMutationId({
    name: 'EditMessage',
    inputFields: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        text: {type: new GraphQLNonNull(GraphQLString)}
    },
    outputFields: {
        message: {
            type: GraphQLMessage,
            resolve: ({localMessageId}) => getMessage(localMessageId)
        }
    },
    mutateAndGetPayload: ({id, text}) => {
        const localMessageId = fromGlobalId(id).id;
        changeMessage(localMessageId, text);
        return {localMessageId};
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        newMessage: GraphQLNewMessageMutation,
        editMessage: GraphQLEditMessageMutation,
        removeMessage: GraphQLRemoveMessageMutation
    }
});
const schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation
});

module.exports = {
    schema,
    Mutation,
    GraphQLEditMessageMutation,
    GraphQLRemoveMessageMutation,
    GraphQLNewMessageMutation,
    Query,
    GraphQLUser,
    GraphQLMessage
};
