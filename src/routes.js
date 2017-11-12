import ChatApp from './components/ChatApp/ChatApp';
import {graphql} from 'react-relay';
import makeRouteConfig from 'found/lib/makeRouteConfig';
import Route from 'found/lib/Route';
import React from 'react';
import Login from './components/Login/Login';
import MainPage from './components/MainPage/MainPage';

const chatAppQuery = graphql`
    query routesQuery {
        chat {
            ...ChatApp_chat
        }
    }
`;

export default makeRouteConfig(
    <Route path="/" Component={MainPage}>
        <Route path="/login" Component={Login} />
        <Route path="/chat" Component={ChatApp} query={chatAppQuery} />
    </Route>
);
