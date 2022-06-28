import { IApi } from 'umi';

const INVALID_PKGS = ['antd', 'antd-mobile', 'dva', 'qiankun', 'umi', 'umi-request'];

export function validate(resolutions: any) {
    const keys = Object.keys(resolutions);
    for (const key of keys) {
        if (INVALID_PKGS.includes(key)) return false;
        if (key.startsWith(`@umijs/`)) return false;
        if (key.startsWith(`@ant-design/`)) return false;
        if (key.startsWith(`@magi/`)) return false;
        if (key.startsWith(`@za/`)) return false;
    }
    return true;
}

export default (api: IApi, opts: any) => {
    api.onPluginReady(async () => {
        const resolutions = api.pkg?.resolutions;
        if (resolutions && !validate(resolutions)) {
            opts.printError({
                exit: true,
                why: `你在 package.json 里却声明了 "resolutions": "${opts.highlight(JSON.stringify(resolutions))} 。"`,
            });
        }
    });
};
