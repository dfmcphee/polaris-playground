import React from 'react';
import {withRouter} from 'react-router-dom';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Button, TextField} from '@shopify/polaris';

import {AccountContext} from './App';
import Editor from './Editor';
import Toolbar from './Toolbar';

class CreatePage extends React.Component {
  state = {
    title: '',
    content: '<Button>Add</Button>',
  };

  handlePlayground = async (accountId) => {
    const {createPlaygroundMutation, history} = this.props;

    const {title, content} = this.state;

    const authorId = accountId;

    await createPlaygroundMutation({
      variables: {title, content, authorId},
    }).then(({data}) => {
      return history.replace(`/playground/${data.createPlayground.id}`);
    });
  };

  handleTitleChange = (value) => {
    this.setState({title: value});
  };

  handleCodeChange = (content) => {
    this.setState({content});
  };

  render() {
    const {content, title} = this.state;

    return (
      <AccountContext.Consumer>
        {(context) => {
          return (
            <div style={{height: '100%'}}>
              <Toolbar>
                <TextField
                  label="Playground title"
                  labelHidden
                  value={title}
                  onChange={this.handleTitleChange}
                />
                <Button
                  primary
                  onClick={() => this.handlePlayground(context.accountId)}
                  disabled={!context.accountId}
                >
                  Save
                </Button>
              </Toolbar>
              <Editor
                content={content}
                title={title}
                onCodeChange={this.handleCodeChange}
              />
            </div>
          );
        }}
      </AccountContext.Consumer>
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

const CreatePageWithMutation = graphql(CREATE_PLAYGROUND_MUTATION, {
  name: 'createPlaygroundMutation',
})(CreatePage);

export default withRouter(CreatePageWithMutation);
