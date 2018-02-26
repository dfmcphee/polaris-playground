import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {ApolloClient} from 'apollo-client';
import {ApolloProvider} from 'react-apollo';
import {createHttpLink} from 'apollo-link-http';
import {ApolloLink} from 'apollo-link';
import {InMemoryCache} from 'apollo-cache-inmemory';

import '@shopify/polaris/styles.css';

import App from './components/App';
import CreatePage from './components/CreatePage';
import CreateUser from './components/CreateUser';
import DetailPage from './components/DetailPage';
import LoginUser from './components/LoginUser';

import './index.css';

const httpLink = createHttpLink({
  uri: 'https://api.graph.cool/simple/v1/cje0rcoie0jhm0114uope1nru',
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
  <ApolloProvider client={client}>
    <Router>
      <div>
        <Route exact path="/" component={App} />
        <Route path="/create" component={CreatePage} />
        <Route path="/login" component={LoginUser} />
        <Route path="/signup" component={CreateUser} />
        <Route path="/playground/:id" component={DetailPage} />
      </div>
    </Router>
  </ApolloProvider>,
  document.getElementById('root'),
);
