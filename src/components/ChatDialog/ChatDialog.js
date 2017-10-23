import React from 'react';
import {createFragmentContainer, graphql} from 'react-relay';
import List from 'material-ui/List';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Message from '../Message/Message';
const styles = () => ({
    list: {
        width: 500,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        flex: 1
    },
    container: {
        flex: '1 1 auto',
        display: 'flex',
        flexDirection: 'column-reverse',
        overflowY: 'scroll'
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
        return (
            <div className={classes.container}>
                <List className={classes.list}>{this.renderMessages()}</List>
            </div>
        );
    }
    static propTypes = {
        chat: PropTypes.shape({
            messages: PropTypes.object
        }),
        classes: PropTypes.object
    };
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
