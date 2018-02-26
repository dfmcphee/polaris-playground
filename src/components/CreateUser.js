import React from 'react';
import {withRouter} from 'react-router-dom';
import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';

import {Page, Card, TextField, Button, Stack} from '@shopify/polaris';

class CreateUser extends React.Component {
  signupUser = async () => {
    const {email, password, name} = this.state;

    try {
      const user = await this.props.signupUserMutation({
        variables: {email, password, name},
      });
      localStorage.setItem('graphcoolToken', user.data.signupUser.token);
      this.props.history.replace('/');
    } catch (error) {
      this.props.history.replace('/');
    }
  };

  handleEmailChange = (value) => {
    this.setState({email: value});
  };

  handlePasswordChange = (value) => {
    this.setState({password: value});
  };

  handleNameChange = (value) => {
    this.setState({name: value});
  };

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      name: '',
    };
  }

  render() {
    if (this.props.loggedInUserQuery.loading) {
      return <div>Loading</div>;
    }

    // redirect if user is logged in
    if (this.props.loggedInUserQuery.loggedInUser.id) {
      this.props.history.replace('/');
    }

    return (
      <Page title="Signup">
        <Card sectioned>
          <Stack vertical>
            <TextField
              type="email"
              value={this.state.email}
              label="Email"
              onChange={this.handleEmailChange}
            />
            <TextField
              value={this.state.password}
              type="password"
              label="Password"
              onChange={this.handlePasswordChange}
            />
            <TextField
              value={this.state.name}
              label="Name"
              onChange={this.handleNameChange}
            />
            <Button onClick={this.signupUser} primary>Sign up</Button>
          </Stack>
        </Card>
      </Page>
    );
  }
}

const SIGNUP_USER_MUTATION = gql`
  mutation SignupUserMutation(
    $email: String!
    $password: String!
    $name: String
  ) {
    signupUser(email: $email, password: $password, name: $name) {
      id
      token
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

export default compose(
  graphql(SIGNUP_USER_MUTATION, {name: 'signupUserMutation'}),
  graphql(LOGGED_IN_USER_QUERY, {
    name: 'loggedInUserQuery',
    options: {fetchPolicy: 'network-only'},
  }),
)(withRouter(CreateUser));
