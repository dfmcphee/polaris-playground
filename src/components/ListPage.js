import React from 'react';
import {graphql, compose} from 'react-apollo';
import gql from 'graphql-tag';
import {withRouter} from 'react-router-dom';
import {
  Card,
  Page,
  ResourceList,
  TextStyle,
  SkeletonBodyText,
  SkeletonPage,
  SkeletonDisplayText,
  Layout,
  TextContainer,
} from '@shopify/polaris';

class ListPage extends React.Component {
  handleRefresh = () => {
    this.props.allPlaygroundsQuery.refetch();
  };

  handleDelete = async (id) => {
    const {deletePlaygroundMutation} = this.props;

    await deletePlaygroundMutation({
      variables: {
        id,
      },
    });

    this.handleRefresh();
  };

  renderItem = (item) => {
    const {id, title, author} = item;

    const authorMarkup = author ? <TextStyle variation="subdued">by {author.name}</TextStyle> : null;

    return (
      <ResourceList.Item
        id={id}
        url={`/playground/${item.id}`}
      >
        <h3>
          <TextStyle variation="strong">{title}</TextStyle>
          {authorMarkup}
        </h3>
      </ResourceList.Item>
    );
  };

  componentWillReceiveProps(nextProps) {
    const {location, allPlaygroundsQuery} = this.props;
    if (location.key !== nextProps.location.key) {
      allPlaygroundsQuery.refetch();
    }
  }

  render() {
    const {allPlaygroundsQuery} = this.props;

    if (allPlaygroundsQuery.loading) {
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

    return (
      <Page title="Playgrounds" primaryAction={{content: 'New playground', url: '/create'}}>
        <Card>
          <ResourceList
            resourceName={{singular: 'playground', plural: 'playgrounds'}}
            items={allPlaygroundsQuery.allPlaygrounds}
            renderItem={this.renderItem}
          />
        </Card>
      </Page>
    );
  }
}

const ALL_PLAYGROUNDS_QUERY = gql`
  query allPlaygroundsQuery {
    allPlaygrounds(orderBy: createdAt_DESC) {
      id
      content
      title
      author {
        id,
        name,
        email
      }
    }
  }
`;

const DELETE_PLAYGROUND_MUTATION = gql`
  mutation DeletePlaygroundMutation($id: ID!) {
    deletePlayground(id: $id) {
      id
    }
  }
`;

const ListPageWithGraphQL = compose(
  graphql(ALL_PLAYGROUNDS_QUERY, {
    name: 'allPlaygroundsQuery',
    options: {
      fetchPolicy: 'network-only',
    },
  }),
  graphql(DELETE_PLAYGROUND_MUTATION, {
    name: 'deletePlaygroundMutation',
  }),
)(ListPage);

const ListPageWithDelete = graphql(DELETE_PLAYGROUND_MUTATION)(
  ListPageWithGraphQL,
);

export default withRouter(ListPageWithDelete);
