import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {ApolloClient} from 'apollo-client';
import {ApolloProvider} from 'react-apollo';
import {createHttpLink} from 'apollo-link-http';
import {ApolloLink} from 'apollo-link';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {AppProvider} from '@shopify/polaris';

import '@shopify/polaris/styles.css';

import App from './components/App';
import ListPage from './components/ListPage';
import CreatePage from './components/CreatePage';
import DetailPage from './components/DetailPage';
import PreviewPage from './components/PreviewPage';

import './index.css';

// eslint-disable-next-line
const graphCoolAPI = process.env.REACT_APP_GRAPH_COOL_API;

const httpLink = createHttpLink({
  uri: graphCoolAPI,
});

const middlewareLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('graphcoolToken');
  const authorizationHeader = token ? `Bearer ${token}` : null;
  operation.setContext({
    headers: {
      authorization: authorizationHeader,
    },
  });
  return forward(operation);
});

const httpLinkWithAuthToken = middlewareLink.concat(httpLink);

const client = new ApolloClient({
  link: httpLinkWithAuthToken,
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
});

ReactDOM.render(
  <AppProvider>
    <ApolloProvider client={client}>
      <Router>
        <App>
          <Route exact path="/" component={ListPage} />
          <Route path="/create" component={CreatePage} />
          <Route path="/playground/:id" component={DetailPage} />
          <Route path="/preview/:id" component={PreviewPage} />
        </App>
      </Router>
    </ApolloProvider>
  </AppProvider>,
  document.getElementById('root'),
);
