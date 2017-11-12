import AppBar from 'material-ui/AppBar';
import React from 'react';
import {Button, Toolbar, Typography} from 'material-ui';
import {withRouter} from 'found';
import {withStyles} from 'material-ui/styles';

const logout = router =>
    fetch('/logout', {
        method: 'post',
        credentials: 'same-origin'
    }).then(() => router.replace('/login'));
const styles = theme => ({
    flex: {
        flex: 1
    }
});
const MainPage = ({children, router, classes}) => (
    <div>
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography type="title" color="inherit" className={classes.flex}>
                        Chat app
                    </Typography>
                    <Button raised color="contrast" onClick={() => logout(router)}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <div>{children}</div>
        </div>
    </div>
);
export default withRouter(withStyles(styles)(MainPage));
