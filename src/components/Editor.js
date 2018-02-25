import React from 'react';
import * as Polaris from '@shopify/polaris';
import {Stack, TextField} from '@shopify/polaris';

import Frame from './Frame';
import Playground from './Playground';

export default function Editor({actions, description, content, onDescriptionChange, onCodeChange}) {
  const topBar = <Stack>
      <Stack.Item fill>
        <TextField label="Description" labelHidden value={description} onChange={onDescriptionChange} />
      </Stack.Item>
      <Stack.Item>
        {actions}
      </Stack.Item>
    </Stack>;

  return <Frame topBar={topBar}>
      <Playground codeText={content} scope={{React, ...Polaris}} onChange={onCodeChange} />
    </Frame>;
}