export default dsn => `
import React, { Component } from 'react';
import * as Sentry from '@sentry/browser';

Sentry.init({
    dsn: '${dsn}',
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
`;
