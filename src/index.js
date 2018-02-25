import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {ApolloProvider} from 'react-apollo';
import {ApolloClient} from 'apollo-client';
import {HttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import '@shopify/polaris/styles.css';

import ListPage from './components/ListPage';
import CreatePage from './components/CreatePage';
import DetailPage from './components/DetailPage';

import './index.css';

const httpLink = new HttpLink({
  uri: 'https://api.graph.cool/simple/v1/cje0rcoie0jhm0114uope1nru',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <div>
        <Route exact path="/" component={ListPage} />
        <Route path="/create" component={CreatePage} />
        <Route path="/prototype/:id" component={DetailPage} />
      </div>
    </Router>
  </ApolloProvider>,
  document.getElementById('root'),
);
