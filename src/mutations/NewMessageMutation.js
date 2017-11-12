import {commitMutation, graphql} from 'react-relay';
import {ConnectionHandler} from 'relay-runtime';

const mutation = graphql`
    mutation NewMessageMutation($input: NewMessageInput!) {
        newMessage(input: $input) {
            messageEdge {
                __typename
                cursor
                node {
                    id
                    text
                    edited
                    date
                    user {
                        avatar
                        name
                        id
                    }
                }
            }
            chat {
                id
                totalCount
                user {
                    avatar
                    name
                    id
                }
            }
        }
    }
`;

function sharedUpdater(store, chat, newEdge) {
    const chatProxy = store.get(chat.id);
    const conn = ConnectionHandler.getConnection(chatProxy, 'ChatDialog_messages');
    ConnectionHandler.insertEdgeAfter(conn, newEdge);
}

let tempID = 0;

function commit(environment, text, chat, user) {
    return commitMutation(environment, {
        mutation,
        variables: {
            input: {
                text,
                user,
                clientMutationId: ++tempID
            }
        },
        updater: store => {
            const payload = store.getRootField('newMessage');
            const newEdge = payload.getLinkedRecord('messageEdge');
            sharedUpdater(store, chat, newEdge);
        },
        optimisticUpdater: store => {
            const id = 'client:newMessage:' + tempID;
            const node = store.create(id, 'Message');
            node.setValue(text, 'text');
            node.setValue(id, 'id');
            node.setValue(new Date().getTime(), 'date');
            node.setValue(false, 'edited');
            const user = store.create('client:newUser:' + tempID, 'User');
            const {avatar, name} = chat.user;
            user.setValue(avatar, 'avatar');
            user.setValue(name, 'name');
            node.setLinkedRecord(user, 'user');
            const newEdge = store.create('client:newEdge:' + tempID, 'MessageEdge');
            newEdge.setLinkedRecord(node, 'node');
            sharedUpdater(store, chat, newEdge);
            const chatProxy = store.get(chat.id);
            chatProxy.setValue(chatProxy.getValue('totalCount') + 1, 'totalCount');
        }
    });
}

export default {commit};
