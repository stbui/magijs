import prettier from 'prettier';
import path from 'path';
import fs from 'fs';
import { upperFirst, camelCase } from 'lodash';

const defaultPrettierOptions: any = {
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  proseWrap: 'never',
  endOfLine: 'lf',
  overrides: [
    {
      files: '.prettierrc',
      options: {
        parser: 'json',
      },
    },
    {
      files: 'document.ejs',
      options: {
        parser: 'html',
      },
    },
  ],
};

export function prettierFile(content) {
  let result = content;
  let hasError = false;
  try {
    result = prettier.format(
      content,
      Object.assign(
        { singleQuote: true, trailingComma: 'all', printWidth: 100, parser: 'typescript' },
        defaultPrettierOptions
      )
    );
  } catch (error) {
    hasError = true;
  }
  return [result, hasError];
}

export const getAbsolutePath = filePath => {
  if (filePath && !path.isAbsolute(filePath)) {
    return path.join(process.cwd(), filePath);
  }
  return filePath;
};

export const mkdir = dir => {
  if (!fs.existsSync(dir)) {
    mkdir(path.dirname(dir));
    fs.mkdirSync(dir);
  }
};

export const writeFile = (folderPath, fileName, content) => {
  const filePath = path.join(folderPath, fileName);
  mkdir(path.dirname(filePath));
  const [prettierContent, hasError] = prettierFile(content);
  fs.writeFileSync(filePath, prettierContent, {
    encoding: 'utf8',
  });
  return hasError;
};

export const getTagName = name => {
  const result = name.split('.');
  // 数据源中的 tag 等同于全量的 op API 名，确定为 4-5 段，如上格式
  // 取中间的 1-2 字段作为 tag，作为 serviceController 创建目录的依据
  if (result.length === 4) {
    return result[2];
  }
  if (result.length === 5) {
    return result[2] + upperFirst(result[3]);
  }
  return name;
};

/**
 * 根据当前的数据源类型，对请求回来的 apiInfo 进行格式化
 * 如果是 op 数据源，对 tags 以及 path 中的 tags 进行处理
 * - before: 前缀（产品集.产品码） + 操作对象（必填）+ 子操作对象（可选）+ 动作（必填）
 * - after: 操作对象（必填）+ 子操作对象（可选） ==> 驼峰
 */
export const formatApiInfo = apiInfo => {
  if (
    !(
      apiInfo &&
      apiInfo.schema.info &&
      apiInfo.schema.info.extensions &&
      apiInfo.schema.info.extensions['x-antTech-description']
    )
  ) {
    // 非 op 数据源，直接返回
    return apiInfo;
  }
  apiInfo.schema.tags = apiInfo.schema.tags.map(item => {
    return Object.assign(Object.assign({}, item), { name: exports.getTagName(item.name) });
  });
  for (const child_path in apiInfo.schema.paths) {
    apiInfo.schema.paths[child_path].post.tags = apiInfo.schema.paths[child_path].post.tags.map(tag =>
      exports.getTagName(tag)
    );
  }
  return apiInfo;
};

export function formatParamsForYFH(params, paramsObject = {}) {
  Object.keys(params).forEach(name => {
    const prop = params[name];
    let key = name;
    const nameList = name.split('.');
    const nameListLength = nameList.length;
    if (nameListLength === 1) {
      // 正常的 key
      paramsObject[key] = Object.assign({}, prop);
    } else if (nameListLength === 2 && nameList[1] !== 'n' && nameList[1] !== 'm') {
      const [childKey] = nameList;
      // key.child_key
      const key_child_key = camelCase(nameList[1]);
      paramsObject[childKey] = combineParams(childKey, key_child_key, prop, paramsObject);
    } else {
      // key.n.child_key
      if (nameList[nameListLength - 2] === 'n' || nameList[nameListLength - 2] === 'm') {
        const child_key = camelCase(nameList.pop());
        nameList.pop();
        key = nameList.join('.');
        paramsObject[key] = combineParams(key, child_key, prop, paramsObject, '.n.key');
      } else {
        const child_key = camelCase(nameList.pop());
        key = nameList.join('.');
        // .key.n
        if (child_key === 'n' || child_key === 'm') {
          // .n.key.m
          if (nameList[nameList.length - 2] === 'n' || nameList[nameList.length - 2] === 'm') {
            const child_child_key = camelCase(nameList.pop());
            nameList.pop();
            key = nameList.join('.');
            paramsObject[key] = combineParams(key, child_child_key, prop, paramsObject, '.n.key.m');
          } else {
            prop.type = `${prop.type}[]`;
            paramsObject[key] = Object.assign({}, prop);
          }
        } else {
          paramsObject[key] = combineParams(key, child_key, prop, paramsObject);
        }
      }
    }
    paramsObject[key].name = camelCase(key);
  });
  const hasInvoke = Object.keys(paramsObject).filter(param => param.includes('.')).length > 0;
  if (hasInvoke) {
    // 递归
    return formatParamsForYFH(paramsObject);
  }
  return paramsObject;
}

export function combineParams(key, child_key, prop, paramsObject, type?) {
  const typeSuffix = type === '.n.key.m' ? '[]' : '';
  const keySuffix = type === '.n.key' || type === '.n.key.m' ? '[]' : '';
  if (paramsObject[key]) {
    const child_type = `{${child_key}:${prop.type}${typeSuffix}, ${paramsObject[key].type.slice(1)}`;
    paramsObject[key] = Object.assign(Object.assign({}, paramsObject[key]), { type: child_type });
  } else {
    paramsObject[key] = Object.assign(Object.assign({}, prop), {
      type: `{${child_key}:${prop.type}
      }${keySuffix}`,
    });
  }
  return paramsObject[key];
}
export const stripDot = str => {
  return str.replace(/[-_ .](\w)/g, (_all, letter) => letter.toUpperCase());
};
