import React from 'react';
import {graphql, compose} from 'react-apollo';
import {withRouter} from 'react-router-dom';
import gql from 'graphql-tag';
import {GoogleLogin} from 'react-google-login';
import {createContext} from 'react-broadcast';
import Notifications from 'react-notify-toast';

import {
  Button,
  Card,
  Layout,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  TextContainer,
} from '@shopify/polaris';

import Frame from './Frame';

export const AccountContext = createContext();

// eslint-disable-next-line
const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const notificationOptions = {
  wrapperId: 'notification-wrapper',
  animationDuration: 250,
  timeout: 2500,
  zIndex: 1000,
  colors: {
    error: {color: '#FFFFFF', backgroundColor: '#BF0711'},
    info: {color: '#FFFFFF', backgroundColor: '#00848E'},
  },
};

function setStorage(id, token) {
  localStorage.setItem('graphcoolId', id);
  localStorage.setItem('graphcoolToken', token);
}

function clearStorage() {
  localStorage.removeItem('graphcoolId');
  localStorage.removeItem('graphcoolToken');
}

class App extends React.Component {
  state = {
    accountId: null,
  };

  handleLogout = () => {
    clearStorage();
    this.setState({accountId: null});
  };

  handleGoogleResponse = async (response) => {
    const googleToken = response.tokenId;

    if (!googleToken) {
      return;
    }

    const email = response.profileObj.email;
    const name = response.profileObj.name;

    const graphcoolResponse = await this.props.authenticateUserMutation({
      variables: {
        googleToken,
        email,
        name,
      },
    });

    const graphcoolId = graphcoolResponse.data.authenticateGoogleUser.id;
    const graphcoolToken = graphcoolResponse.data.authenticateGoogleUser.token;

    setStorage(graphcoolId, graphcoolToken);

    this.setState({accountId: graphcoolId});
  };

  componentWillMount() {
    const accountId = localStorage.getItem('graphcoolId');
    if (!accountId) {
      return;
    }

    this.setState({accountId});
  }

  render() {
    const {children} = this.props;
    const {accountId} = this.state;

    const topBarActions = accountId ? (
      <Button onClick={this.handleLogout}>Logout</Button>
    ) : (
      <GoogleLogin
        clientId={googleClientId}
        buttonText="Login"
        onSuccess={this.handleGoogleResponse}
        onFailure={this.handleGoogleResponse}
        className="Polaris-Button"
        style={{fontSize: '1.4rem'}}
      />
    );

    if (this.props.loggedInUserQuery.loading) {
      return (
        <Frame>
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
        </Frame>
      );
    }

    return (
      <AccountContext.Provider value={{accountId}}>
        <Frame topBarActions={topBarActions}>{children}</Frame>
        <Notifications options={notificationOptions} />
      </AccountContext.Provider>
    );
  }
}

const LOGGED_IN_USER_QUERY = gql`
  query LoggedInUserQuery {
    loggedInUser {
      id
    }
  }
`;

const AUTHENTICATE_GOOGLE_USER = gql`
  mutation AuthenticateUserMutation($googleToken: String!) {
    authenticateGoogleUser(googleToken: $googleToken) {
      id
      token
    }
  }
`;

export default compose(
  graphql(AUTHENTICATE_GOOGLE_USER, {name: 'authenticateUserMutation'}),
  graphql(LOGGED_IN_USER_QUERY, {
    name: 'loggedInUserQuery',
    options: {fetchPolicy: 'network-only'},
  }),
)(withRouter(App));
