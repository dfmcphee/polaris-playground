import React from 'react';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {withRouter} from 'react-router-dom';
import * as Polaris from '@shopify/polaris';

import Preview from './Playground/Preview';

const {
  TextContainer,
  Layout,
  Card,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
} = Polaris;

function PreviewPage({PlaygroundQuery}) {
  if (PlaygroundQuery.loading) {
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

  const {Playground} = PlaygroundQuery;

  return (
    <div style={{height: '100%'}}>
      <Preview
        code={Playground.content}
        scope={{React, ...Polaris}}
      />
    </div>
  );
}

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

const PreviewPageWithGraphQL = graphql(PLAYGROUND_QUERY, {
  name: 'PlaygroundQuery',
  options: ({match}) => ({
    variables: {
      id: match.params.id,
    },
  }),
})(PreviewPage);

export default withRouter(PreviewPageWithGraphQL);
