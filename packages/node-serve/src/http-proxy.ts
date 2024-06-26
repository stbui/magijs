import compression from '@magijs/compiled/compression';
import express from '@magijs/compiled/express';
import history from '@magijs/compiled/connect-history-api-fallback';
import cors from '@magijs/compiled/cors';
import { createProxyMiddleware } from '@magijs/compiled/http-proxy-middleware';

export function httpProxy(options, publicPath?, staticDir = 'dist') {
  const app = express();
  app.get('/health', (req, res) => res.status(200).send('OK'));

  app.use(cors());
  app.use(history());
  app.use(compression());

  let proxyMiddlewares: any = [];
  if (options) {
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
  }

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
