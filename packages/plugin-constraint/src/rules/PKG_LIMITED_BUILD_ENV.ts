import { IApi } from 'umi';

export function validate(pkg: any): boolean {
    return !/(ANALYZE|COMPRESS|BABEL_CACHE)=/.test(pkg.scripts?.build || '');
}

export default (api: IApi, opts: any) => {
    if (!validate(api.pkg)) {
        opts.printError({
            exit: true,
            why: `你在 package.json 中的 scripts.build 里使用了 ANALYZE、COMPRESS 或 BABEL_CACHE 环境变量。`,
        });
    }
};
