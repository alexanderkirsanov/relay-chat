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
import EditMessageMutation from '../../mutations/EditMessageMutation';
import EditMessageInput from './EditMessageInput';
import PropTypes from 'prop-types';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit
    },
    avatar: {
        margin: 10
    },
    text: {
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        maxWidth: 300
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
        const color = this.props.message.edited ? '#e4f3ff' : '#FAFAFA';
        const style = {backgroundColor: color};
        return (
            <div>
                <ListItem dense button className={classes.listItem} style={style}>
                    <Avatar className={classes.avatar}>
                        {' '}
                        {getAvatarText(this.props.message.user ? this.props.message.user.avatar : 'User')}{' '}
                    </Avatar>
                    <ListItemText
                        className={classes.text}
                        primary={this.props.message.text}
                        secondary={convertTime(this.props.message.date)}
                    />
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
                    <EditMessageInput
                        text={this.props.message.text}
                        onSave={value => {
                            this.handleTextInput(value);
                            this.toggleEdit();
                        }}
                        onCancel={this.toggleEdit}
                    />
                )}
            </div>
        );
    }
    static propTypes = {
        relay: PropTypes.shape({
            environment: PropTypes.object
        }),
        message: PropTypes.shape({
            user: PropTypes.object,
            text: PropTypes.string,
            date: PropTypes.any,
            edited: PropTypes.any
        }),
        chat: PropTypes.object,
        classes: PropTypes.object
    };
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
