import { logger } from '@umijs/utils';
import chalk from '@magijs/compiled/chalk';

export default api => {
  api.describe({
    key: 'seraph',
    config: {
      schema(Joi) {
        return Joi.object();
      },
    },
    enableBy() {
      return api.EnableBy.config && api.env !== 'development';
    },
  });

  api.onStart(() => {
    logger.info('seraph disabled');
  });

  const defaultConfig = {
    env: process.env.MAGI_ENV,
    link: process.env.MAGI_SERAPH_LINK,
  };

  let { seraph } = api.userConfig;

  if (seraph) {
    if (typeof seraph === 'string') {
      seraph = {
        siteId: seraph,
      };
    }

    const config = Object.assign(defaultConfig, seraph);

    if (config.siteId) {
      api.addHTMLHeadScripts(() => [
        {
          src: config.link,
          crossorigin: 'anonymous',
        },
        {
          content: `window._SERAPH_ = new MonitorJS(${JSON.stringify(seraph)});`,
        },
      ]);
    } else {
      console.log(chalk.red('[seraph] 没有定义站点ID,先申请seraph站点ID, 前往申请'));
    }
  }
};
