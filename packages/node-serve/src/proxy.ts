import compression from '@magijs/compiled/compression';
import history from '@magijs/compiled/connect-history-api-fallback';
import express from '@magijs/compiled/express';
import { createProxyMiddleware } from '@magijs/compiled/http-proxy-middleware';

interface INodeProxyconfig {
  /**
   * 静态文件目录
   */
  static?: string;
  /**
   * 静态文件路径
   */
  publicPath?: string;
  /**
   * 代理配置
   */
  proxy: any;
}

export class NodeProxy {
  proxyMiddlewares: any[] = [];
  express;

  constructor(
    protected config: INodeProxyconfig = {
      proxy: {},
    }
  ) {
    this.resolveProxyConfig();
    this.initExpress();
    this.useMiddleware();
    this.listen();
  }

  /**
   * 解析配置
   */
  resolveProxyConfig() {
    Object.keys(this.config.proxy)
      .map(option => {
        const proxyOptions = this.config.proxy[option];
        proxyOptions.context = option;

        return proxyOptions;
      })
      .forEach(option => {
        const context = option.context || option.path;

        if (option.target) {
          this.proxyMiddlewares.push(createProxyMiddleware(context, option));
        }
      });
  }

  initExpress() {
    this.express = express();
    this.express.get('/health', (req, res) => res.status(200).send('OK'));
  }

  useMiddleware() {
    this.express.use(history());
    this.express.use(compression());

    if (this.proxyMiddlewares.length) {
      this.express.use(this.proxyMiddlewares);
    }

    const routes = this.config.publicPath ? [this.config.publicPath, ''] : [''];
    const _static = this.config.static || 'dist';
    this.express.use(routes, express.static(_static));
  }

  listen() {
    this.express.listen(8080);
  }

  log() {
    console.log();
    console.log('[magi] Server: listening on port 8080');
    console.log();
  }
}
