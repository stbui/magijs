import { IApi, IConfig } from 'umi';

export function validate(config: IConfig) {
    return !!config.routes;
}

export default (api: IApi, opts: any) => {
    api.modifyConfig(memo => {
        // 注意：校验的是用户定义的 api.userConfig
        if (!validate(api.userConfig)) {
            opts.printError({
                exit: true,
                why: `配置里没有定义 ${opts.highlight('routes')} 从而使用了约定式路由。`,
            });
        }
        return memo;
    });
};
