import * as React from 'react';

import './Frame.css';

export default function Frame({topBar, children}) {
  return (
    <div className="frame">
      <div className="frame__top-bar">
        {topBar}
      </div>
      <main className="frame__main">
        {children}
      </main>
    </div>
  );
}