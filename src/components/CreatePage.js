import React from 'react';
import {withRouter} from 'react-router-dom';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import * as Polaris from '@shopify/polaris';

import Playground from './Playground';

class CreatePage extends React.Component {
  state = {
    description: '',
    content: '<Button>Add</Button>',
  };

  handlePrototype = async () => {
    const {createPrototypeMutation, history} = this.props;
    const {description, content} = this.state;

    await createPrototypeMutation({
      variables: {description, content},
    });

    history.replace('/');
  };

  handleDescriptionChange = (value) => {
    this.setState({description: value});
  };

  render() {
    const {content} = this.state;

    return (
      <div>
        <Playground codeText={content} scope={{React, ...Polaris}} />
        <Polaris.TextField
          value={this.state.description}
          placeholder="Description"
          onChange={this.handleDescriptionChange}
        />
        <Polaris.Button onClick={this.handlePrototype}>Save</Polaris.Button>
      </div>
    );
  }
}

const CREATE_PROTOTYPE_MUTATION = gql`
  mutation CreatePrototypeMutation($description: String, $content: String!) {
    createPrototype(description: $description, content: $content) {
      id
      description
      content
    }
  }
`;

const CreatePageWithMutation = graphql(CREATE_PROTOTYPE_MUTATION, {
  name: 'createPrototypeMutation',
})(CreatePage);

export default withRouter(CreatePageWithMutation);
