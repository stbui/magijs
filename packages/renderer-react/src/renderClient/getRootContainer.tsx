import { ApplyPluginsType } from '@umijs/runtime';
import React from 'react';
import RouterComponent from './RouteComponent';
import { IOpts } from './types';

export default function getRootContainer(opts: IOpts) {
  return opts.pluginManager.applyPlugins({
    type: ApplyPluginsType.modify,
    key: 'rootContainer',
    initialValue: (
      <RouterComponent
        history={opts.history}
        routes={opts.routes}
        pluginManager={opts.pluginManager}
        ssrProps={opts.ssrProps}
        defaultTitle={opts.defaultTitle}
      />
    ),
    args: {
      history: opts.history,
      routes: opts.routes,
      pluginManager: opts.pluginManager,
    },
  });
}