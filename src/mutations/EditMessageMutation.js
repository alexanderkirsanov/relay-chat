import {commitMutation, graphql} from 'react-relay';

const mutation = graphql`
    mutation EditMessageMutation($input: EditMessageInput!) {
        editMessage(input: $input) {
            message {
                id
                text
                edited
            }
        }
    }
`;

function commit(environment, text, message) {
    return commitMutation(environment, {
        mutation,
        variables: {
            input: {text, id: message.id}
        },
        optimisticResponse: {
            editMessage: {
                message: {
                    id: message.id,
                    text,
                    edited: true
                }
            }
        }
    });
}

export default {commit};
