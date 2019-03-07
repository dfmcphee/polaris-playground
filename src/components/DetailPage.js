import React from 'react';
import {graphql, compose} from 'react-apollo';
import {
  Button,
  ButtonGroup,
  Heading,
  TextContainer,
  Layout,
  Card,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  TextField,
} from '@shopify/polaris';

import {withRouter} from 'react-router-dom';
import gql from 'graphql-tag';
import {notify} from 'react-notify-toast';

import {AccountContext} from './App';
import Editor from './Editor';
import Toolbar from './Toolbar';

class DetailPage extends React.Component {
  state = {
    content: '',
    title: '',
  };

  handleDelete = async () => {
    const {history, deletePlaygroundMutation, PlaygroundQuery} = this.props;

    if (!window.confirm('Are you sure you want to delete this playground?')) {
      return;
    }

    await deletePlaygroundMutation({
      variables: {
        id: PlaygroundQuery.Playground.id,
      },
    });

    history.replace('/');
  };

  handleUpdate = async (accountId) => {
    const {updatePlaygroundMutation, PlaygroundQuery} = this.props;

    const authorId = accountId;

    await updatePlaygroundMutation({
      variables: {
        id: PlaygroundQuery.Playground.id,
        content: this.state.content,
        title: this.state.title,
        authorId,
      },
    });

    notify.show('Playground saved', 'info');
  };
  
  handlePreview = async (accountID, previewPath ) => {
    await this.handleUpdate(accountID);
    this.props.history.push(previewPath);
  };

  handleFork = async (accountId) => {
    const {createPlaygroundMutation, history} = this.props;
    const {title, content} = this.state;

    const authorId = accountId;

    await createPlaygroundMutation({
      variables: {title, content, authorId},
    }).then(({data}) => {
      return history.replace(`/playground/${data.createPlayground.id}`);
    });
  };

  handleCodeChange = (content) => {
    this.setState({content});
  };

  handleTitleChange = (title) => {
    this.setState({title});
  };

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.PlaygroundQuery.loading &&
      !this.props.PlaygroundQuery.loading
    ) {
      return;
    }

    const {Playground} = nextProps.PlaygroundQuery;

    if (!Playground) {
      return;
    }

    this.setState({
      content: Playground.content,
      title: Playground.title,
    });
  }

  render() {
    const {PlaygroundQuery} = this.props;
    const {content, title} = this.state;

    if (PlaygroundQuery.loading) {
      return (
        <div>
          <Toolbar>
            <SkeletonDisplayText size="small" />
            <SkeletonDisplayText size="small" />
          </Toolbar>
          <SkeletonPage>
            <Layout>
              <Layout.Section>
                <Card sectioned>
                  <TextContainer>
                    <SkeletonDisplayText size="small" />
                    <SkeletonBodyText />
                  </TextContainer>
                </Card>
              </Layout.Section>
            </Layout>
          </SkeletonPage>
        </div>
      );
    }

    const editor =
      content && content !== '' ? (
        <Editor
          content={content}
          title={title}
          onCodeChange={this.handleCodeChange}
        />
      ) : null;

    return (
      <div style={{height: '100%'}}>
        <AccountContext.Consumer>
          {(context) => {
            const accountId = context.accountId;
            const isAuthor =
              accountId &&
              PlaygroundQuery.Playground &&
              (accountId === PlaygroundQuery.Playground.author.id);

            const titleMarkup = isAuthor ? (
              <div className="toolbar-field">
                <TextField
                  label="Playground title"
                  labelHidden
                  value={title}
                  onChange={this.handleTitleChange}
                />
              </div>
            ) : (
              <Heading>{title}</Heading>
            );

            const actionsMarkup = isAuthor ? (
              <ButtonGroup>
                <Button onClick={this.handleDelete}>Delete</Button>
                <Button onClick={() => this.handleFork(accountId)}>Fork</Button>
                <Button onClick={() => this.handlePreview(
                  accountId,
                  `/preview/${PlaygroundQuery.Playground.id}`,
                )}>
                Preview
                </Button>
                <Button primary onClick={() => this.handleUpdate(accountId)}>
                  Save
                </Button>
              </ButtonGroup>
            ) : (
              <ButtonGroup>
                <Button
                  onClick={() => this.handleFork(accountId)}
                  disabled={!accountId}
                >
                  Fork
                </Button>
                <Button
                  url={`/preview/${PlaygroundQuery.Playground.id}`}
                  target="playground"
                >
                  Preview
                </Button>
              </ButtonGroup>
            );

            return (
              <div style={{height: '100%'}}>
                <Toolbar>
                  {titleMarkup}
                  {actionsMarkup}
                </Toolbar>
                {editor}
              </div>
            );
          }}
        </AccountContext.Consumer>
      </div>
    );
  }
}

const DELETE_PLAYGROUND_MUTATION = gql`
  mutation DeletePlaygroundMutation($id: ID!) {
    deletePlayground(id: $id) {
      id
    }
  }
`;

const UPDATE_PLAYGROUND_MUTATION = gql`
  mutation UpdatePlaygroundMutation(
    $id: ID!
    $title: String!
    $content: String!
    $authorId: ID!
  ) {
    updatePlayground(
      id: $id
      title: $title
      content: $content
      authorId: $authorId
    ) {
      id
      title
      content
    }
  }
`;

const PLAYGROUND_QUERY = gql`
  query PlaygroundQuery($id: ID!) {
    Playground(id: $id) {
      id
      content
      title
      author {
        id
      }
    }
  }
`;

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

const DetailPageWithGraphQL = compose(
  graphql(PLAYGROUND_QUERY, {
    name: 'PlaygroundQuery',
    options: ({match}) => ({
      variables: {
        id: match.params.id,
      },
    }),
  }),
  graphql(UPDATE_PLAYGROUND_MUTATION, {
    name: 'updatePlaygroundMutation',
  }),
  graphql(DELETE_PLAYGROUND_MUTATION, {
    name: 'deletePlaygroundMutation',
  }),
  graphql(CREATE_PLAYGROUND_MUTATION, {
    name: 'createPlaygroundMutation',
  }),
)(DetailPage);

const DetailPageWithDelete = graphql(DELETE_PLAYGROUND_MUTATION)(
  DetailPageWithGraphQL,
);

export default withRouter(DetailPageWithDelete);
