import React from 'react';
import {graphql, compose} from 'react-apollo';
import {Button, ButtonGroup} from '@shopify/polaris';
import {withRouter} from 'react-router-dom';
import gql from 'graphql-tag';

import Editor from './Editor';

class DetailPage extends React.Component {
  state = {
    content: '',
    description: '',
  };

  handleDelete = async () => {
    const {history, deletePrototypeMutation, PrototypeQuery} = this.props;

    await deletePrototypeMutation({
      variables: {
        id: PrototypeQuery.Prototype.id,
      },
    });

    history.replace('/');
  };

  handleUpdate = async () => {
    const {updatePrototypeMutation, PrototypeQuery} = this.props;

    await updatePrototypeMutation({
      variables: {
        id: PrototypeQuery.Prototype.id,
        content: this.state.content,
        description: this.state.description,
      },
    });
  };

  handleCodeChange = (content) => {
    this.setState({content});
  };

  handleDescriptionChange = (description) => {
    this.setState({description});
  };

  componentWillReceiveProps(nextProps) {
    if (!nextProps.PrototypeQuery.loading && this.props.PrototypeQuery.loading) {
      const {Prototype} = nextProps.PrototypeQuery;
      this.setState({
        content: Prototype.content,
        description: Prototype.description,
      });
    }
  }

  render() {
    const {PrototypeQuery} = this.props;
    const {content, description} = this.state;

    if (PrototypeQuery.loading) {
      return (
        <div>
          <div>Loading</div>
        </div>
      );
    }

    const actions = <ButtonGroup>
        <Button primary onClick={this.handleUpdate}>
          Update
        </Button>
        <Button destructive onClick={this.handleDelete}>
          Delete
        </Button>
      </ButtonGroup>;

    return (
      <Editor
        actions={actions}
        content={content}
        description={description}
        onCodeChange={this.handleCodeChange}
        onDescriptionChange={this.handleDescriptionChange}
      />
    );
  }
}

const DELETE_PROTOTYPE_MUTATION = gql`
  mutation DeletePrototypeMutation($id: ID!) {
    deletePrototype(id: $id) {
      id
    }
  }
`;

const UPDATE_PROTOTYPE_MUTATION = gql`
  mutation UpdatePrototypeMutation(
    $id: ID!
    $description: String
    $content: String!
  ) {
    updatePrototype(id: $id, description: $description, content: $content) {
      id
      description
      content
    }
  }
`;

const PROTOTYPE_QUERY = gql`
  query PrototypeQuery($id: ID!) {
    Prototype(id: $id) {
      id
      content
      description
    }
  }
`;

const DetailPageWithGraphQL = compose(
  graphql(PROTOTYPE_QUERY, {
    name: 'PrototypeQuery',
    options: ({match}) => ({
      variables: {
        id: match.params.id,
      },
    }),
  }),
  graphql(UPDATE_PROTOTYPE_MUTATION, {
    name: 'updatePrototypeMutation',
  }),
  graphql(DELETE_PROTOTYPE_MUTATION, {
    name: 'deletePrototypeMutation',
  }),
)(DetailPage);

const DetailPageWithDelete = graphql(DELETE_PROTOTYPE_MUTATION)(
  DetailPageWithGraphQL,
);

export default withRouter(DetailPageWithDelete);
