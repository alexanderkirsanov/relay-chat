import React from 'react';
import {createFragmentContainer, graphql} from 'react-relay';
import List from 'material-ui/List';
import Message from '../Message/Message';
class ChatDialog extends React.Component {
    renderMessages() {
        return this.props.viewer.messages.edges.map(edge => (
            <Message key={edge.node.id} message={edge.node} viewer={this.props.viewer} />
        ));
    }

    render() {
        return <List>{this.renderMessages()}</List>;
    }
}

export default createFragmentContainer(ChatDialog, {
    viewer: graphql`
        fragment ChatDialog_viewer on User {
            messages(first: 2147483647) @connection(key: "ChatDialog_messages") {
                edges {
                    node {
                        id
                        ...Message_message
                    }
                }
            }
            id
            totalCount
            ...Message_viewer
        }
    `
});
