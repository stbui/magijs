import { httpProxy } from '@magijs/node-serve';
import { IApi } from 'umi';
import { modifyHtml, modifyHtmlContent } from './utils/modifyHtmlContent';

function ProxyFromConfig(config) {
  let proxy = config.proxy;
  if (config.proxy) {
    if (config.proxy.dev || config.proxy.test || config.proxy.prd) {
      proxy = config.proxy[process.env.DEPLOY_ENV || 'prd'];
    }
  }

  return proxy;
}

export function startNode(config) {
  console.log('[magi] 代理服务:', '正在启动');

  const outputPath = config.outputPath;
  const proxy = ProxyFromConfig(config);

  console.log('[magi] config:', config);

  httpProxy(proxy, config.publicPath, outputPath);
}

export default (api: IApi) => {
  modifyHtmlContent(api);

  api.modifyDefaultConfig(memo => {
    const proxy = ProxyFromConfig(api.userConfig);

    return {
      ...memo,
      proxy,
    };
  });

  api.registerCommand({
    name: 'deploy',
    fn() {
      // 输出环境
      console.log('[magi] 环境变量: ', `SHIP_DEPLOY_ENV=${process.env.DEPLOY_ENV}`);
      console.log('[magi] 环境变量: ', `MAGI_ENV=${process.env.MAGI_ENV}`);
      console.log('[magi] 环境变量: ', `MAGI_VERSION=${process.env.MAGI_VERSION}`);
      console.log('[magi] 环境变量: ', `NODE_ENV=${process.env.NODE_ENV}`);
      console.log();

      modifyHtml(api.userConfig);
      startNode(api.userConfig);
    },
  });
};
