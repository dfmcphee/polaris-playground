import React from 'react';
import {withRouter} from 'react-router-dom';
import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';

import {
  Page,
  Card,
  TextField,
  Button,
  Stack,
  SkeletonPage,
  SkeletonBodyText,
  SkeletonDisplayText,
  TextContainer,
  Layout,
} from '@shopify/polaris';

class CreateLogin extends React.Component {
  state = {
    email: '',
    password: '',
    error: false,
  };

  handleEmailChange = (value) => {
    this.setState({email: value});
  };

  handlePasswordChange = (value) => {
    this.setState({password: value});
  };

  authenticateUser = async () => {
    const {authenticateUserMutation, history} = this.props;
    const {email, password} = this.state;

    try {
      const response = await authenticateUserMutation({
        variables: {email, password},
      });

      localStorage.setItem('graphcoolToken', response.data.authenticateUser.token);

      history.replace('/');
    } catch (error) {
      this.setState({error: true});
    }
  };

  render() {
    const {loggedInUserQuery, history} = this.props;
    const {email, password, error} = this.state;

    if (loggedInUserQuery.loading) {
      return (
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
      );
    }

    // redirect if user is logged in
    if (loggedInUserQuery.loggedInUser.id) {
      history.replace('/');
    }

    const errorMessage = error ? 'Your email or password was incorrect.' : false;

    return (
      <Page title="Login">
        <Card sectioned>
          <Stack vertical>
            <TextField type="email" value={email} label="Email" onChange={this.handleEmailChange} error={errorMessage} />
            <TextField value={password} type="password" label="Password" onChange={this.handlePasswordChange} />
            <Button onClick={this.authenticateUser} primary>
              Login
            </Button>
          </Stack>
        </Card>
      </Page>
    );
  }
}

const AUTHENTICATE_USER_MUTATION = gql`
  mutation AuthenticateUserMutation($email: String!, $password: String!) {
    authenticateUser(email: $email, password: $password) {
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
  graphql(AUTHENTICATE_USER_MUTATION, {name: 'authenticateUserMutation'}),
  graphql(LOGGED_IN_USER_QUERY, {
    name: 'loggedInUserQuery',
    options: {fetchPolicy: 'network-only'},
  }),
)(withRouter(CreateLogin));
