import { IApi } from 'umi';
import { start, getRandomPort } from './client';

export default (api: IApi) => {
  api.registerCommand({
    name: 'tunnel',
    fn({ args }) {
      const server_addr = args.server_addr || '156.251.130.35';

      const remote_port = getRandomPort();

      api.onDevCompileDone(() => {
        let config = {
          server_addr: server_addr, //服务端地址
          server_port: 10001, //服务端端口
          token: 'stbui', //连接令牌
          timeout: 3000, //请求超时时间
          interval: 5000, //异常重试
          binds: {
            [`${api.pkg.name}-${remote_port}`]: {
              local_ip: api.getHostname(), //当前内网被转发的ip
              local_port: api.getPort(), //当前内网被转发的端口
              remote_port: remote_port, //服务端映射的端口
            },
          },
        };

        const tunnel = api.userConfig.tunnel;
        if (tunnel) {
          config = Object.assign(config, tunnel);
        }

        // @ts-ignore
        start(config);
        console.log(`  - Publish: http://${config.server_addr}:${remote_port}`);
        console.log();
      });
    },
  });
};
