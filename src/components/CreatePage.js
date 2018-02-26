import React from 'react';
import {withRouter} from 'react-router-dom';
import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import {Button, TextField} from '@shopify/polaris';

import Editor from './Editor';
import Frame from './Frame';
import Toolbar from './Toolbar';

class CreatePage extends React.Component {
  state = {
    title: '',
    content: '<Button>Add</Button>',
  };

  handlePlayground = async () => {
    const {createPlaygroundMutation, loggedInUserQuery, history} = this.props;

    const {title, content} = this.state;

    const authorId = loggedInUserQuery.loggedInUser.id;

    await createPlaygroundMutation({
      variables: {title, content, authorId},
    });

    history.replace('/');
  };

  handleTitleChange = (value) => {
    this.setState({title: value});
  };

  render() {
    const {content, title} = this.state;
    const {loggedInUserQuery} = this.props;

    const isLoggedIn = (loggedInUserQuery.loggedInUser && (loggedInUserQuery.loggedInUser.id !== null));

    return (
      <Frame loggedIn={isLoggedIn}>
        <Toolbar>
          <TextField label="Title" value={title} onChange={this.handleTitleChange} />
          <Button primary onClick={this.handlePlayground} disabled={!isLoggedIn}>Save</Button>
        </Toolbar>
        <Editor content={content} title={title} onCodeChange={this.handleCodeChange} />
      </Frame>
    );
  }
}

const CREATE_PLAYGROUND_MUTATION = gql`
  mutation CreatePlaygroundMutation(
    $title: String!
    $content: String!
    $authorId: ID!
  ) {
    createPlayground(title: $title, content: $content, authorId: $authorId) {
      id
    }
  }
`;

const LOGGED_IN_USER_QUERY = gql`
  query LoggedInUserQuery {
    loggedInUser {
      id
    }
  }
`;

const CreatePageWithMutation = compose(
  graphql(CREATE_PLAYGROUND_MUTATION, {
    name: 'createPlaygroundMutation',
  }),
  graphql(LOGGED_IN_USER_QUERY, {
    name: 'loggedInUserQuery',
    options: {fetchPolicy: 'network-only'},
  }),
)(CreatePage);

export default withRouter(CreatePageWithMutation);
