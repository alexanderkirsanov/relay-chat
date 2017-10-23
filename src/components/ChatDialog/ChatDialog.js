import React from 'react';
import {createFragmentContainer, graphql} from 'react-relay';
import List from 'material-ui/List';
import {withStyles} from 'material-ui/styles';
import Message from '../Message/Message';
const styles = theme => ({
    list: {
        width: 500,
        height: 600,
        overflow: 'auto'
    }
});

class ChatDialog extends React.Component {
    renderMessages() {
        return this.props.chat.messages.edges.map(edge => (
            <Message key={edge.node.id} message={edge.node} chat={this.props.chat} />
        ));
    }

    render() {
        const {classes} = this.props;
        return <List className={classes.list}>{this.renderMessages()}</List>;
    }
}

export default createFragmentContainer(withStyles(styles)(ChatDialog), {
    chat: graphql`
        fragment ChatDialog_chat on Chat {
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
        }
    `
});
