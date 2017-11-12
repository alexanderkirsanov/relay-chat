import React from 'react';
import ReactDOM from 'react-dom';
import BrowserProtocol from 'farce/lib/BrowserProtocol';
import queryMiddleware from 'farce/lib/queryMiddleware';
import createFarceRouter from 'found/lib/createFarceRouter';
import createRender from 'found/lib/createRender';
import {Resolver} from 'found-relay';
import {Environment, Network, RecordSource, Store} from 'relay-runtime';
import routes from './routes';

function fetchQuery(operation, variables) {
    return fetch('/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            query: operation.text,
            variables
        })
    })
        .then(response => {
            if (!response.ok) {
                window.location.href = '/login';
                return;
            }
            return response.json();
        })
        .catch(e => console.log(e));
}

const modernEnvironment = new Environment({
    network: Network.create(fetchQuery),
    store: new Store(new RecordSource())
});

const Router = createFarceRouter({
    historyProtocol: new BrowserProtocol(),
    historyMiddlewares: [queryMiddleware],
    routeConfig: routes,
    render: createRender({})
});

ReactDOM.render(<Router resolver={new Resolver(modernEnvironment)} />, document.getElementById('app-root'));
