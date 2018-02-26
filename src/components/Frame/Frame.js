import * as React from 'react';
import {withRouter, Link} from 'react-router-dom';

import {Button, ButtonGroup, Stack} from '@shopify/polaris';

import './Frame.css';

class Frame extends React.Component {
  logout = () => {
    localStorage.removeItem('graphcoolToken');
    window.location.reload();
  };

  showLogin = () => {
    this.props.history.replace('/login');
  };

  showSignup = () => {
    this.props.history.replace('/signup');
  };

  render() {
    const {loggedIn, children} = this.props;

    const topBarActions = loggedIn
      ? (
        <Button onClick={this.logout}>
          Logout
        </Button>
      ) : (
        <ButtonGroup>
          <Button onClick={this.showLogin}>
            Login
          </Button>
          <Button onClick={this.showSignup}>Signup</Button>
        </ButtonGroup>
      );

    const topBar = (
      <Stack distribution="equalSpacing" alignment="center">
        <Link className="frame__heading-link" to="/">Polaris Playgrounds</Link>
        {topBarActions}
      </Stack>
    );

    return (
      <div className="frame">
        <div className="frame__top-bar">{topBar}</div>
        <main className="frame__main">{children}</main>
      </div>
    );
  }
}

export default withRouter(Frame);
