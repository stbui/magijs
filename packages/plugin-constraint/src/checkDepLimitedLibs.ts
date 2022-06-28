import { IApi } from 'umi';

interface IDeps {
    [name: string]: string;
}

const isLimitedLib = (key: string, INVALID_PKGS: Array<string>) =>
    INVALID_PKGS.some(pkg => (pkg.endsWith('/') ? key.startsWith(pkg) : pkg === key));

export function validate(opts: { deps: IDeps; type: string; INVALID_PKGS: Array<string> }) {
    const { type, deps, INVALID_PKGS } = opts;
    const keys = Object.keys(deps);
    for (const key of keys) {
        if (isLimitedLib(key, INVALID_PKGS)) {
            throw new Error(
                JSON.stringify({
                    type,
                    message: `"${key}"`,
                })
            );
        }
    }
    return true;
}

export default async (api: IApi, opts: any, INVALID_PKGS: Array<string>) => {
    const { dependencies = {}, devDependencies = {} } = api.pkg || {};
    try {
        validate({
            deps: dependencies,
            type: 'dependencies',
            INVALID_PKGS,
        });
        validate({
            deps: devDependencies,
            type: 'devDependencies',
            INVALID_PKGS,
        });
    } catch (e) {
        const { type, message } = JSON.parse(e.message);
        opts.printError({
            exit: true,
            why: `你在 package.json 的 ${opts.highlight(type)} 里声明了 ${opts.highlight(message)}`,
        });
    }
};
