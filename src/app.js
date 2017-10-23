import React from 'react';
import ReactDOM from 'react-dom';

import {QueryRenderer, graphql} from 'react-relay';
import {Environment, Network, RecordSource, Store} from 'relay-runtime';

import ChatApp from './components/ChatApp/ChatApp';

function fetchQuery(operation, variables) {
    return fetch('/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: operation.text,
            variables
        })
    }).then(response => {
        return response.json();
    });
}

const modernEnvironment = new Environment({
    network: Network.create(fetchQuery),
    store: new Store(new RecordSource())
});

ReactDOM.render(
    <QueryRenderer
        environment={modernEnvironment}
        query={graphql`
            query appQuery {
                chat {
                    ...ChatApp_chat
                }
            }
        `}
        variables={{}}
        render={({_error, props}) => {
            if (props) {
                return <ChatApp chat={props.chat} />;
            }
            return <div>Loading</div>;
        }}
    />,
    document.getElementById('app-root')
);
