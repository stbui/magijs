import { IApi } from 'umi';

interface IDeps {
    [name: string]: string;
}

export function validate(opts: { deps: IDeps; type: string }) {
    const { type, deps } = opts;
    const keys = Object.keys(deps);
    for (const key of keys) {
        const version = deps[key];
        if (!/^[~^]?\d/.test(version)) {
            throw new Error(
                JSON.stringify({
                    type,
                    message: `"${key}": "${version}"`,
                })
            );
        }
    }
    return true;
}

export default (api: IApi, opts: any) => {
    api.onPluginReady(async () => {
        const { dependencies = {}, devDependencies = {} } = api.pkg || {};
        try {
            validate({
                deps: dependencies,
                type: 'dependencies',
            });
            validate({
                deps: devDependencies,
                type: 'devDependencies',
            });
        } catch (e) {
            const { type, message } = JSON.parse(e.message);
            opts.printError({
                exit: true,
                why: `你在 package.json 的 ${opts.highlight(type)} 里却声明了 ${opts.highlight(message)} 。`,
            });
        }
    });
};
