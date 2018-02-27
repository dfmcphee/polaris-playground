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
    if (nextProps.PlaygroundQuery.loading && !this.props.PlaygroundQuery.loading) {
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
          <Layout>
            <Layout.Section secondary>
              <Card sectioned>
                <TextContainer>
                  <SkeletonBodyText lines={6} />
                </TextContainer>
              </Card>
            </Layout.Section>
            <Layout.Section>
              <Card sectioned>
                <TextContainer>
                  <SkeletonBodyText lines={8} />
                </TextContainer>
              </Card>
            </Layout.Section>
          </Layout>
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
            const isAuthor = accountId && (accountId === PlaygroundQuery.Playground.author.id);

            const titleMarkup = isAuthor ? (
              <TextField label="Playground title" labelHidden value={title} onChange={this.handleTitleChange} />
            ) : (
              <Heading>{title}</Heading>
            );

            const actionsMarkup = isAuthor
              ? (
                <ButtonGroup>
                  <Button onClick={this.handleDelete}>Delete</Button>
                  {/* eslint-disable-next-line */}
                  <Button onClick={() => this.handleFork(accountId)}>
                    Fork
                  </Button>
                  {/* eslint-disable-next-line */}
                  <Button primary onClick={() => this.handleUpdate(accountId)}>
                    Save
                  </Button>
                </ButtonGroup>
              ) : (
                <ButtonGroup>
                  {/* eslint-disable-next-line */}
                  <Button onClick={() => this.handleFork(accountId)} disabled={!accountId}>
                    Fork
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
    updatePlayground(id: $id, title: $title, content: $content, authorId: $authorId) {
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
  mutation CreatePlaygroundMutation($title: String!, $content: String!, $authorId: ID!) {
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
