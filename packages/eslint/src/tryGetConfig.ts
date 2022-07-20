import { join } from 'path';

// 获取配置
export const tryGetConfig = (cwd: string, name: string) => {
  const extensions = ['', '.js', 'json'];

  for (const item of extensions) {
    let filePath: string;
    try {
      filePath = require.resolve(join(cwd, `${name}${item}`));
      return filePath;
    } catch (e) {
      filePath = '';
    }
  }

  return null;
};
