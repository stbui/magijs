import { IApi } from 'umi';

export function validate(version: string) {
    if (version.charAt(0) !== '^') {
        return false;
    } else {
        return true;
    }
}

export default (api: IApi, opts) => {
    api.onPluginReady(async () => {
        const version = api.pkg?.dependencies?.['@magi/magi'] || api.pkg?.devDependencies?.['@magi/magi'];

        if (version && !validate(version)) {
            opts.printError({
                exit: true,
                why: `你在 package.json 里却声明了 "@magi/magi": "${opts.highlight(version)} 。"`,
            });
        }
    });
};
