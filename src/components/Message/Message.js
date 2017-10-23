import React from 'react';
import {createFragmentContainer, graphql} from 'react-relay';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import ModeEditIcon from 'material-ui-icons/ModeEdit';
import {withStyles} from 'material-ui/styles';
import RemoveMessageMutation from '../../mutations/RemoveMessageMutation';
import {ListItem, ListItemSecondaryAction, ListItemText} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import {compose, prop} from 'ramda';
import {TextField} from 'material-ui';
import EditMessageMutation from '../../mutations/EditMessageMutation';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit
    },
    avatar: {
        margin: 10
    }
});

class Message extends React.Component {
    state = {
        isEditing: false
    };
    removeMessage = () => {
        RemoveMessageMutation.commit(this.props.relay.environment, this.props.message, this.props.chat);
    };
    toggleEdit = () => {
        this.setState({isEditing: !this.state.isEditing});
    };
    handleTextInput = text => {
        EditMessageMutation.commit(this.props.relay.environment, text, this.props.message);
    };
    render() {
        const {classes} = this.props;
        const toUpperCase = str => str.toUpperCase();
        const getAvatarText = compose(toUpperCase, prop('0'));
        const convertTime = time => {
            const date = new Date(+time);
            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.toTimeString().substr(0, 5)}`;
        };
        return (
            <div>
                <ListItem dense button className={classes.listItem}>
                    <Avatar className={classes.avatar}>
                        {' '}
                        {getAvatarText(this.props.message.user ? this.props.message.user.avatar : 'User')}{' '}
                    </Avatar>
                    <ListItemText primary={this.props.message.text} secondary={convertTime(this.props.message.date)} />
                    <ListItemSecondaryAction>
                        <IconButton className={classes.button} aria-label="Edit" onClick={this.toggleEdit}>
                            <ModeEditIcon />
                        </IconButton>
                        <IconButton className={classes.button} aria-label="Delete" onClick={this.removeMessage}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
                {this.state.isEditing && (
                    <TextField
                        placeholder="Enter your message..."
                        defaultValue={this.props.message.text}
                        onKeyPress={event => {
                            if (event.key === 'Enter') {
                                this.handleTextInput(event.target.value);
                                event.preventDefault();
                                this.toggleEdit();
                            }
                        }}
                        className={classes.textField}
                        margin="normal"
                    />
                )}
            </div>
        );
    }
}

export default createFragmentContainer(withStyles(styles)(Message), {
    message: graphql`
        fragment Message_message on Message {
            id
            text
            edited
            date
            user {
                avatar
            }
        }
    `
});
