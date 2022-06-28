import { IApi, IRoute, utils } from 'umi';

function isUpperCamelCase(str: string) {
    const firstChar = str.charAt(0);
    return firstChar === firstChar.toUpperCase() && !str.includes('-') && !str.includes('_');
}

function isLowerCase(str: string) {
    return str.toLowerCase() === str;
}

export function validate(components: string[]) {
    components.forEach(component => {
        const paths = component.split('/');
        if (
            !((paths.length >= 2 && isLowerCase(paths[0]) && isUpperCamelCase(paths[1])) || isUpperCamelCase(paths[0]))
        ) {
            throw new Error(`路由组件 ${component} 不符合规则。`);
        }
    });
}

function traverseRoutes(opts: { onRoute: Function; routes: IRoute[] }) {
    opts.routes.forEach(route => {
        opts.onRoute({ route });
        if (route.routes) {
            traverseRoutes({
                ...opts,
                routes: route.routes,
            });
        }
    });
}

function getValidComponents(opts: { routes: IRoute[]; absPagesPath: string }) {
    const components: string[] = [];
    traverseRoutes({
        routes: opts.routes,
        onRoute: ({ route }: { route: IRoute }) => {
            if (!route.component || typeof route.component !== 'string') return;
            const pagesPath = utils.winPath(opts.absPagesPath) + '/';
            const componentPath = utils.winPath(route.component);
            const isUnderPages = componentPath.startsWith(pagesPath);
            if (isUnderPages) {
                components.push(componentPath.replace(pagesPath, ''));
            }
        },
    });
    return components;
}

export default (api: IApi, opts: any) => {
    api.onGenerateFiles(async () => {
        const routes = await api.getRoutes();
        const components = getValidComponents({
            routes,
            absPagesPath: api.paths.absPagesPath!,
        });

        try {
            validate(components);
        } catch (e) {
            opts.printError({
                exit: true,
                why: e.message,
            });
        }
    });
};
