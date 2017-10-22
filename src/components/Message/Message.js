import React from 'react';
import {createFragmentContainer, graphql} from 'react-relay';

class Message extends React.Component {
    state = {
        isEditing: false
    };

    render() {
        return <div>{this.props.message.text}</div>;
    }
}

export default createFragmentContainer(Message, {
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
