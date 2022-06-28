import { IApi, IConfig } from 'umi';

export function validate(userConfig: IConfig) {
    if (userConfig.dva && userConfig.dva.skipModelValidate) {
        throw new Error(`配置里配置了 dva.skipModelValidate 。`);
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
