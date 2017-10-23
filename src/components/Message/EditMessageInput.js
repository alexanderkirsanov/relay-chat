import React from 'react';
import {TextField} from 'material-ui';
import {Button} from 'material-ui';
import {withStyles} from 'material-ui/styles';
import PropTypes from 'prop-types';
const styles = theme => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        margin: '0 10px 0 20px'
    },
    button: {
        margin: theme.spacing.unit
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'flex-end'
    }
});

class EditMessageInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.text
        };
    }
    render() {
        const {classes} = this.props;
        return (
            <div className={classes.container}>
                <TextField
                    placeholder="Enter your message..."
                    defaultValue={this.props.text}
                    className={classes.textField}
                    onChange={event => this.setState({value: event.target.value})}
                    margin="normal"
                />
                <div className={classes.buttonContainer}>
                    <Button
                        raised
                        color="primary"
                        className={classes.button}
                        onClick={() => this.props.onSave(this.state.value)}
                    >
                        Save
                    </Button>
                    <Button raised className={classes.button} onClick={this.props.onCancel}>
                        Cancel
                    </Button>
                </div>
            </div>
        );
    }
    static propTypes = {
        text: PropTypes.string,
        onSave: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        classes: PropTypes.object.isRequired
    };
}

export default withStyles(styles)(EditMessageInput);
export {EditMessageInput as PureEditMessageInput};
