import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import React from 'react';
import {FormControlLabel} from 'material-ui/Form';
import {withRouter} from 'found';
import {Checkbox} from 'material-ui';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';

const register = (username, password) =>
    fetch('/register', {
        method: 'post',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `username=${username}&password=${password}`
    });
const login = (username, password) =>
    fetch('/login', {
        method: 'post',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `username=${username}&password=${password}`
    });
const redirectTo = router => path => router.replace(path);

const styles = {
    loginButton: {
        margin: 15
    }
};

class Login extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        username: '',
        password: '',
        register: false,
        error: ''
    };

    handleClick = () => {
        const {username, password} = this.state;
        if (this.state.register) {
            return register(username, password);
        } else {
            return login(username, password)
                .then(response => (response.ok ? '/chat' : '/login'))
                .then(redirectTo(this.props.router));
        }
    };

    render() {
        return (
            <div>
                <div>
                    <TextField onChange={event => this.setState({username: event.target.value})} />
                    <br />
                    <TextField type="password" onChange={event => this.setState({password: event.target.value})} />
                    <br />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.state.register}
                                onChange={event => this.setState({register: event.target.checked})}
                                value="checkedA"
                            />
                        }
                        label="Register"
                    />
                    <Button
                        raised
                        color="primary"
                        className={this.props.classes.loginButton}
                        onClick={event => this.handleClick(event)}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        );
    }

    static propTypes = {
        router: PropTypes.object,
        classes: PropTypes.object
    };
}

export default withRouter(withStyles(styles)(Login));
