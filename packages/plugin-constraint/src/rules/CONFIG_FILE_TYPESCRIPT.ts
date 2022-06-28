import { IApi } from 'umi';

export default (api: IApi, opts: any) => {
    api.onPluginReady(() => {
        const { configFile } = api.service.configInstance;
        if (configFile !== 'config/config.ts') {
            opts.printError({
                exit: true,
                why: `你的配置文件是 ${opts.highlight(configFile!)} 。`,
            });
        }
    });
};
