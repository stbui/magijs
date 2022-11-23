import { IApi } from 'umi';
import chalk from '@magijs/compiled/chalk';

export default (api: IApi) => {
  api.describe({
    key: 'xflow',
    config: {
      schema(joi) {
        return joi.alternatives(joi.string(), joi.object());
      },
      onChange: api.ConfigChangeType.regenerateTmpFiles,
    },
    enableBy() {
      return api.EnableBy.config && api.env !== 'development';
    },
  });

  const defaultConfig = {
    env: process.env.MAGI_ENV,
    jssdkVersion: 'v0.0.1',
    link: process.env.MAGI_XFLOW_LINK,
  };

  let { xflow } = api.userConfig;

  if (xflow) {
    if (typeof xflow === 'string') {
      xflow = {
        siteId: xflow,
      };
    }

    const config = Object.assign(defaultConfig, xflow);

    if (config.siteId) {
      api.addHTMLHeadScripts(() => [
        {
          src: config.link,
        },
        {
          content: `window._XFLOW_ = new XFlow(${JSON.stringify(config)});`,
        },
      ]);
    } else {
      console.log(chalk.red('[xflow] 没有定义站点ID,先申请xflow站点ID'));
    }
  }
};
