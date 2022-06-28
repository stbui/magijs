import { IApi, IConfig } from 'umi';

export function validate(userConfig: IConfig) {
    if (userConfig.oneApi && !userConfig.oneApi.typescript) {
        throw new Error(`配置了 openApi，但 oneApi.typescript 为 false 。`);
    }
}

export default (api: IApi, opts: any) => {
    api.modifyConfig(memo => {
        try {
            validate(api.userConfig);
        } catch (e) {
            opts.printError({
                exit: true,
                why: e.message,
            });
        }
        return memo;
    });
};
