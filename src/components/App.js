import React from 'react';
import {graphql} from 'react-apollo';
import {withRouter} from 'react-router-dom';
import gql from 'graphql-tag';

import {
  Card,
  Layout,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  TextContainer,
} from '@shopify/polaris';

import ListPage from './ListPage';
import Frame from './Frame';

class App extends React.Component {
  isLoggedIn = () => {
    return (
      this.props.loggedInUserQuery.loggedInUser &&
      this.props.loggedInUserQuery.loggedInUser.id !== null
    );
  };

  render() {
    if (this.props.loggedInUserQuery.loading) {
      return (
        <Frame loggedIn={false}>
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
      <Frame loggedIn={this.isLoggedIn()}>
        <ListPage />
      </Frame>
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

export default graphql(LOGGED_IN_USER_QUERY, {
  name: 'loggedInUserQuery',
  options: {fetchPolicy: 'network-only'},
})(withRouter(App));
