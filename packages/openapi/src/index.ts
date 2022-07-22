import nodefetch from '@magijs/compiled/node-fetch';
import swagger2openapi from '@magijs/compiled/swagger2openapi';
import { OperationObject } from '@magijs/compiled/openapi3-ts';

import log from './log';
import { ServiceGenerator } from './serviceGenerator';
import { mockGenerator } from './mockGenerator';

export type GenerateServiceProps = {
    requestLibPath?: string;
    requestImportStatement?: string;
    /**
     * api 的前缀
     */
    apiPrefix?:
        | string
        | ((params: {
              path: string;
              method: string;
              namespace: string;
              functionName: string;
              autoExclude?: boolean;
          }) => string);
    /**
     * 生成的文件夹的路径
     */
    serversPath?: string;
    /**
     * openAPI 3.0 的地址
     */
    schemaPath?: string;
    /**
     * 项目名称
     */
    projectName?: string;
    hook?: {
        /** 自定义函数名称 */
        customFunctionName?: (data: OperationObject) => string;
        /** 自定义类名 */
        customClassName?: (tagName: string) => string;
    };
    namespace?: string;
    mockFolder?: string;
};

const getImportStatement = requestLibPath => {
    if (requestLibPath && requestLibPath.startsWith('import')) {
        return requestLibPath;
    }
    if (requestLibPath) {
        return `import request from '${requestLibPath}'`;
    }
    return `import { request } from "@magi/magi"`;
};

const converterSwaggerToOpenApi = swagger => {
    if (!swagger.swagger) {
        return swagger;
    }
    return new Promise((resolve, reject) => {
        swagger2openapi.convertObj(swagger, {}, (err, options) => {
            log(['💺 将 Swagger 转化为 openAPI']);
            if (err) {
                reject(err);
                return;
            }
            resolve(options.openapi);
        });
    });
};

export const getSchema = (schemaPath: string): Promise<any> => {
    if (schemaPath.startsWith('http')) {
        const json = nodefetch(schemaPath).then(rest => rest.json());
        return json;
    }
    const schema = require(schemaPath);
    return schema;
};

const getOpenAPIConfig = schemaPath => {
    const schema = getSchema(schemaPath);
    const openAPI = converterSwaggerToOpenApi(schema);
    if (!schema) {
        return null;
    }
    return openAPI;
};

// 从 appName 生成 service 数据
export const generateService = ({
    requestLibPath,
    schemaPath,
    mockFolder,
    ...rest
}: GenerateServiceProps): Promise<never> => {
    const openAPI = getOpenAPIConfig(schemaPath);
    const requestImportStatement = getImportStatement(requestLibPath);

    const serviceGenerator = new ServiceGenerator(
        Object.assign({ namespace: 'API', requestImportStatement }, rest),
        openAPI
    );
    serviceGenerator.genFile();
    if (mockFolder) {
        mockGenerator({
            openAPI,
            mockFolder: mockFolder,
        });
    }
    process.exit();
};
