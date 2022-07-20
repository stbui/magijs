import compression from 'compression';
import history from 'connect-history-api-fallback';
import cors from 'cors';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

export function httpProxy(options, publicPath?, staticDir = 'dist') {
  if (!options) {
    return console.error('[magi] 代理服务:', '配置文件有误');
  }

  const app = express();
  app.get('/health', (req, res) => res.status(200).send('OK'));

  let proxyMiddlewares: any = [];
  Object.keys(options)
    .map(option => {
      const proxyOptions = options[option];
      proxyOptions.context = option;

      return proxyOptions;
    })
    .forEach(option => {
      const context = option.context || option.path;

      if (option.target) {
        proxyMiddlewares.push(createProxyMiddleware(context, option));
      }
    });

  app.use(cors());
  app.use(history());
  app.use(compression());

  if (proxyMiddlewares.length) {
    app.use(proxyMiddlewares);
  }

  const p = publicPath ? [publicPath, ''] : [''];

  app.use(p, express.static(staticDir, { dotfiles: 'allow' }));
  app.listen(8080);

  console.log();
  console.log('[magi] 代理服务:', '完成启动，监听端口8080');
  console.log();
}
