import {commitMutation, graphql} from 'react-relay';
import {ConnectionHandler} from 'relay-runtime';

const mutation = graphql`
    mutation RemoveMessageMutation($input: RemoveMessageInput!) {
        removeMessage(input: $input) {
            deletedMessageId
            chat {
                totalCount
            }
        }
    }
`;

function sharedUpdater(store, chat, deletedID) {
    const chatProxy = store.get(chat.id);
    const conn = ConnectionHandler.getConnection(chatProxy, 'ChatDialog_messages');
    ConnectionHandler.deleteNode(conn, deletedID);
}

function commit(environment, message, chat) {
    return commitMutation(environment, {
        mutation,
        variables: {
            input: {id: message.id}
        },
        updater: store => {
            const payload = store.getRootField('removeMessage');
            sharedUpdater(store, chat, payload.getValue('deletedMessageId'));
        },
        optimisticUpdater: store => {
            sharedUpdater(store, chat, message.id);
        }
    });
}

export default {commit};
