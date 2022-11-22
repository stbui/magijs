import { logger } from '@umijs/utils';
import { withTmpPath } from './utils/withTmpPath';
import chalk from '@magijs/compiled/chalk';

export default api => {
  api.describe({
    key: 'sentry',
    config: {
      schema(Joi) {
        return Joi.object();
      },
      onChange: api.ConfigChangeType.regenerateTmpFiles,
    },
    enableBy() {
      return api.EnableBy.config && api.env !== 'development';
    },
  });

  api.onStart(() => {
    logger.info('Using Sentry Plugin');
  });

  const { sentry } = api.userConfig;

  if (!sentry) {
    return;
  }

  if (!sentry.dsn) {
    console.log(chalk.red(`${chalk.green('[sentry]')} dsn 没有配置, ${chalk.white('前往申请')}`));
    return;
  }

  if (!sentry.authToken) {
    console.log(
      chalk.yellow(`${chalk.green('[sentry]')} authToken 没有配置, sourceMap功能未开启, ${chalk.white('前往申请')}`)
    );
  }

  if (!sentry.org) {
    console.log(
      chalk.yellow(`${chalk.green('[sentry]')} org 没有配置, sourceMap功能未开启, ${chalk.white('前往申请')}`)
    );
  }

  const {
    dsn,
    environment = api.env || 'dev',
    project = sentry.project || api.pkg.name,
    release = sentry.version || api.pkg.version || '1.0.0',
    authToken,
    org,
    url = process.env.MAGI_SENTRY_URL,
    ...other
  } = sentry;

  // authToken && org && project 都申请配置好，启用sourceMap 功能
  if (authToken && org && project) {
    api.modifyConfig(memo => {
      memo.devtool = 'source-map';
      return memo;
    });

    api.chainWebpack(memo => {
      const sentryConfig = {
        authToken,
        org,
        project,
        release,
        environment,
        include: './dist',
        ...other,
      };

      const sentry = require('@sentry/webpack-plugin');

      memo.plugin('sentry').use(sentry, [sentryConfig]);

      return memo;
    });

    api.onGenerateFiles(() => {
      api.writeTmpFile({
        path: 'sentry.tsx',
        content: `
        import React, { Component } from 'react';
        import * as Sentry from '@sentry/browser';
        
        Sentry.init({
            dsn: '${dsn}',
            autoSessionTracking: false,
            sendClientReports: false
        });
        
        class SentryReport extends Component {
          constructor(props) {
            super(props);
            this.state = { error: null, eventId: null };
          }
         
          componentDidCatch(error, errorInfo) {
            this.setState({ error });
            Sentry.withScope((scope) => {
              scope.setExtras(errorInfo);
              const eventId = Sentry.captureException(error);
              this.setState({ eventId });
            });
          }
         
          render() {
            if (this.state.error) {
              return <a onClick={() => Sentry.showReportDialog({ eventId: this.state.eventId })}>反馈问题</a>;
            }
          
            return this.props.children;
          }
        }
        export default SentryReport;
        `,
      });

      api.writeTmpFile({
        path: 'runtime.tsx',
        content: `
        import React from 'react';
        import SentryReport from './sentry';
        
        export function rootContainer(container) {
          return React.createElement(SentryReport, null, container);
        }
        `,
      });
    });

    api.addRuntimePlugin(() => [withTmpPath({ api, path: 'runtime.tsx' })]);
  }
};
