/**
 * @license
 * Copyright Stbui All Rights Reserved.
 * https://github.com/stbui
 */

import net from 'net';

interface IConfig {
    /**
     * 服务端地址
     */
    server_addr: string;
    /**
     * 服务端端口
     */
    server_port: number;
    /**
     * 连接令牌
     */
    token: string;
    /**
     * 请求超时时间
     */
    timeout: number;
    /**
     * 异常重试
     */
    interval: number;
    binds: any;
}

let linkClient;

function listenClient(config: IConfig) {
    /**
     * 用于校验请求的code
     */
    let CODE;

    linkClient = net.createConnection({ host: config.server_addr, port: config.server_port }, () => {
        CODE = +new Date();

        linkClient.write(
            JSON.stringify({
                token: config.token,
                code: CODE,
                type: 'register',
                binds: config.binds,
            })
        );

        console.log(`[${new Date().toLocaleString()}] 正在尝试连接...`);
    });

    linkClient.setTimeout(config.timeout);

    linkClient.on('data', data => {
        try {
            data = JSON.parse(data);

            if (data.code == CODE) {
                if (data.type == 'register') {
                    console.log(
                        `[${new Date().toLocaleString()}] 已连接到服务器 ${config.server_addr}:${config.server_port}`
                    );
                } else {
                    // 请求标识
                    const key = data.key;
                    // 应用名称
                    const name = data.name;
                    // 本地的应用
                    const localApp = config.binds[name];
                    if (!localApp) linkClient.end();

                    // 创建服务端用的Socket
                    const serverClient = new net.Socket();
                    serverClient.setTimeout(config.timeout);
                    // 创建局域网内的Socket
                    const localClient = new net.Socket();
                    localClient.setTimeout(config.timeout);

                    // 连接服务端
                    serverClient.connect(config.server_port, config.server_addr, () => {
                        serverClient.write(JSON.stringify({ type: 'connect', key: key }));
                        // 连接本地服务器
                        localClient.connect(localApp.local_port, localApp.local_ip, () => {
                            console.log(
                                `[${new Date().toLocaleString()}] [${name}] ${localApp.local_port}<===>${
                                    localApp.remote_port
                                }`
                            );
                        });

                        // 本地数据转发服务端
                        localClient.pipe(serverClient);
                        localClient.on('end', data => {
                            serverClient.end();
                        });
                    });

                    serverClient.on('error', function (err) {
                        console.error(`[${new Date().toLocaleString()}] 访问服务器异常，${err.message}`);
                        localClient.end();
                    });
                    localClient.on('error', function (err) {
                        console.error(`[${new Date().toLocaleString()}] 局域网访问异常，${err.message}`);
                        serverClient.end();
                    });

                    // 服务端数据转发本地
                    serverClient.pipe(localClient);
                    serverClient.on('end', function (data) {
                        localClient.end();
                    });
                }
                return;
            }
        } catch (error) {
            // 异常
        }

        return linkClient.end();
    });

    linkClient.on('error', err => {
        console.error(`[${new Date().toLocaleString()}] 异常:` + err.message);
    });
    linkClient.on('end', () => {
        console.log(`[${new Date().toLocaleString()}] 已从服务器 ${config.server_port}:${config.server_port} 断开`);
    });
}

export const getRandomPort = () => {
    const min = 30000;
    const max = 65535;
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export function start(config: IConfig) {
    listenClient(config);
    //异常重试
    setInterval(() => {
        if (linkClient.readyState == 'closed') {
            linkClient.end();
            console.log(`[${new Date().toLocaleString()}] 正在重新连接服务器...`);
            listenClient(config);
        }
    }, config.interval);
}
