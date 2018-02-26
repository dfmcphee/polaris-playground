import React from 'react';
import {Stack} from '@shopify/polaris';

import './Toolbar.css';

export default function Toolbar({children}) {
  return (
    <div className="toolbar">
      <Stack distribution="equalSpacing" alignment="center">
        {children}
      </Stack>
    </div>
  );
}
