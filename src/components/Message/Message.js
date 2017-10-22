import React from 'react';
import {createFragmentContainer, graphql} from 'react-relay';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import {withStyles} from 'material-ui/styles';
import RemoveMessageMutation from '../../mutations/RemoveMessageMutation';

const styles = theme => ({
    button: {
        margin: theme.spacing.unit
    }
});

class Message extends React.Component {
    state = {
        isEditing: false
    };
    removeMessage = () => {
        RemoveMessageMutation.commit(this.props.relay.environment, this.props.message, this.props.viewer);
    };

    render() {
        const {classes} = this.props;
        return (
            <div>
                {this.props.message.text}
                <IconButton className={classes.button} aria-label="Delete" onClick={this.removeMessage}>
                    <DeleteIcon />
                </IconButton>
            </div>
        );
    }
}

export default createFragmentContainer(withStyles(styles)(Message), {
    message: graphql`
        fragment Message_message on Message {
            id
            text
        }
    `,
    viewer: graphql`
        fragment Message_viewer on User {
            id
            totalCount
        }
    `
});
