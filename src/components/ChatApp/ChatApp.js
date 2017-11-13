import React from 'react';
import pluralize from 'pluralize';
import {withStyles} from 'material-ui/styles';
import TextField from 'material-ui/TextField';

import {createFragmentContainer, graphql} from 'react-relay';
import NewMessageMutation from '../../mutations/NewMessageMutation';
import ChatDialog from '../ChatDialog/ChatDialog';
import PropTypes from 'prop-types';

const styles = () => ({
    container: {
        display: 'flex',
        flexFlow: 'column',
        width: 500,
        height: 500
    },
    textField: {
        marginLeft: 'auto',
        marginRight: 20,
        width: 450,
        flex: '0 0 auto'
    }
});

class ChatApp extends React.PureComponent {
    handleTextInputSave = text => {
        NewMessageMutation.commit(this.props.relay.environment, text, this.props.chat, this.props.chat.user.name);
    };

    render() {
        const messagesCount = this.props.chat.totalCount;
        const {classes} = this.props;
        return (
            <div className={classes.container}>
                <h1>
                    {messagesCount} {pluralize('item', messagesCount)}
                </h1>
                <ChatDialog chat={this.props.chat} user={this.props.chat.user} />
                <TextField
                    placeholder="Enter your message..."
                    onKeyPress={event => {
                        if (event.key === 'Enter') {
                            this.handleTextInputSave(event.target.value);
                            event.target.value = '';
                            event.preventDefault();
                        }
                    }}
                    className={classes.textField}
                    margin="normal"
                />
            </div>
        );
    }

    static propTypes = {
        relay: PropTypes.shape({
            environment: PropTypes.object
        }),
        chat: PropTypes.shape({
            totalCount: PropTypes.number,
            user: PropTypes.object
        }),
        classes: PropTypes.object
    };
}

export default createFragmentContainer(withStyles(styles)(ChatApp), {
    chat: graphql`
        fragment ChatApp_chat on Chat {
            id
            totalCount
            user {
                avatar
                name
            }
            ...ChatDialog_chat
        }
    `
});
