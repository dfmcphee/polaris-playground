import * as React from 'react';
import {Link} from 'react-router-dom';

import {Stack} from '@shopify/polaris';

import './Frame.css';


export default function Frame({children, topBarActions}) {
  const topBar = (
    <Stack distribution="equalSpacing" alignment="center">
      <Link className="frame__heading-link" to="/">
        Polaris Playgrounds
      </Link>
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
