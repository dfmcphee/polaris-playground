import React from 'react';
import {Link} from 'react-router-dom';
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

import Prototype from '../components/Prototype';

class ListPage extends React.Component {
  handleRefresh = () => {
    this.props.allPrototypesQuery.refetch();
  };

  componentWillReceiveProps(nextProps) {
    const {location, allPrototypesQuery} = this.props;
    if (location.key !== nextProps.location.key) {
      allPrototypesQuery.refetch();
    }
  }

  render() {
    const {loading} = this.props;
    if (loading) {
      return (
        <div>
          <div>Loading</div>
        </div>
      );
    }
    const {allPrototypesQuery, children} = this.props;

    const prototypesMarkup = allPrototypesQuery.allPrototypes
      ? allPrototypesQuery.allPrototypes.map((prototype) => {
        return (
          <Prototype
            key={prototype.id}
            prototype={prototype}
            refresh={this.handleRefresh}
          />
        );
      })
      : null;

    return (
      <div>
        <div>
          <Link to="/create">
            <img src={require('../assets/plus.svg')} alt="" />
            <div>New Post</div>
          </Link>
          {prototypesMarkup}
        </div>
        {children}
      </div>
    );
  }
}

const ALL_PROTOTYPES_QUERY = gql`
  query allPrototypesQuery {
    allPrototypes(orderBy: createdAt_DESC) {
      id
      content
      description
    }
  }
`;

const ListPageWithQuery = graphql(ALL_PROTOTYPES_QUERY, {
  name: 'allPrototypesQuery',
  options: {
    fetchPolicy: 'network-only',
  },
})(ListPage);

export default ListPageWithQuery;
