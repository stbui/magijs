import { IApi, IConfig } from 'umi';

export function validate(userConfig: IConfig) {
    if (
        userConfig.oneApi &&
        userConfig.oneApi.requestImportStatement &&
        !userConfig.oneApi.requestImportStatement.includes(`import { request } from '@magi/magi'`)
    ) {
        throw new Error(
            `配置了 openApi，但 openApi.requestImportStatement 是 ${userConfig.oneApi.requestImportStatement} 。`
        );
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
