export default () => `
import React from 'react';
import SentryReport from './sentry';

export function rootContainer(container) {
  return React.createElement(SentryReport, null, container);
}
`;
