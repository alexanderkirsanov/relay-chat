import React from 'react';
import pluralize from 'pluralize';
import {withStyles} from 'material-ui/styles';
import TextField from 'material-ui/TextField';

import {createFragmentContainer, graphql} from 'react-relay';
import NewMessageMutation from '../../mutations/NewMessageMutation';
import ChatDialog from '../ChatDialog/ChatDialog';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        width: 500
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200
    }
});

class ChatApp extends React.Component {
    _handleTextInputSave = text => {
        NewMessageMutation.commit(this.props.relay.environment, text, this.props.chat);
    };

    render() {
        const messagesCount = this.props.chat.totalCount;
        const {classes} = this.props;
        return (
            <div className={classes.container}>
                <div>
                    <h1>
                        {messagesCount} {pluralize('item', messagesCount)}
                    </h1>
                    <ChatDialog chat={this.props.chat} />
                    <TextField
                        placeholder="Enter your message..."
                        onKeyPress={event => {
                            if (event.key === 'Enter') {
                                this._handleTextInputSave(event.target.value);
                                event.target.value = '';
                                event.preventDefault();
                            }
                        }}
                        className={classes.textField}
                        margin="normal"
                    />
                </div>
            </div>
        );
    }
}

export default createFragmentContainer(withStyles(styles)(ChatApp), {
    chat: graphql`
        fragment ChatApp_chat on Chat {
            id
            totalCount
            user {
                avatar
            }
            ...ChatDialog_chat
        }
    `
});
