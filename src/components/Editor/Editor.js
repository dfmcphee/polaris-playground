import React from 'react';
import * as Polaris from '@shopify/polaris';
import Playground from '../Playground';

import './Editor.css';

export default function Editor({content, onCodeChange}) {
  return (
    <Playground
      codeText={content}
      scope={{React, ...Polaris}}
      onChange={onCodeChange}
      noRender={false}
    />
  );
}
