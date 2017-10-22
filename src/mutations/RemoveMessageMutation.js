import {commitMutation, graphql} from 'react-relay';
import {ConnectionHandler} from 'relay-runtime';

const mutation = graphql`
    mutation RemoveMessageMutation($input: RemoveMessageInput!) {
        removeMessage(input: $input) {
            deletedMessageId
            viewer {
                totalCount
            }
        }
    }
`;

function sharedUpdater(store, user, deletedID) {
    const userProxy = store.get(user.id);
    const conn = ConnectionHandler.getConnection(userProxy, 'ChatDialog_messages');
    ConnectionHandler.deleteNode(conn, deletedID);
}

function commit(environment, message, user) {
    return commitMutation(environment, {
        mutation,
        variables: {
            input: {id: message.id}
        },
        updater: store => {
            const payload = store.getRootField('removeMessage');
            sharedUpdater(store, user, payload.getValue('deletedMessageId'));
        },
        optimisticUpdater: store => {
            sharedUpdater(store, user, message.id);
        }
    });
}

export default {commit};
