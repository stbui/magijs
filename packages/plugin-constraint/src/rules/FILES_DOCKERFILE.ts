import { join } from 'path';
import { existsSync, readFileSync } from 'fs';

function parse(dockerFile) {
  const arrayFields = ['add', 'expose', 'volume', 'run', 'workdir'];
  const arrayFieldMap = {};
  const filters = {
    add(val) {
      const parts = val.split(' ');
      return {
        source: parts[0],
        dest: parts[1],
      };
    },
    expose(val) {
      let n = parseInt(val);
      if (isNaN(n)) {
        n = val;
      }
      return n;
    },
  };

  let pojo: any = {};

  arrayFields.forEach(f => {
    pojo[f] = [];
    arrayFieldMap[f] = true;
  });

  dockerFile = dockerFile.replace(/\\\n/g, '');
  const lines = dockerFile.split(/\r?\n/) || [];

  lines.forEach(line => {
    let cmd;

    if (!line.trim() || line[0] === '#') {
      return;
    }

    line = line.replace(/^\w+ /, command => {
      cmd = command.replace(/\s+/, '').toLowerCase();
      return '';
    });

    if (!cmd || !cmd.match(/\w/)) {
      return;
    }
    if (filters[cmd]) {
      line = filters[cmd](line);
    }
    if (arrayFieldMap[cmd]) {
      pojo[cmd].push(line);
    } else if (cmd === 'env') {
      if (!pojo.env) pojo.env = {};

      const vars = line.split(/[ =]/);
      let isKey = true;
      let currentKey;

      vars.forEach(v => {
        if (isKey) {
          currentKey = v;
        } else {
          pojo.env[currentKey] = v;
        }
        isKey = !isKey;
      });
    } else {
      pojo[cmd] = line;
    }
  });

  return pojo;
}

export function validate(dockerfile: any) {
  if (!dockerfile.from) {
    throw new Error(`FROM 指定基础镜像未定义。`);
  }
  if (!dockerfile.cmd) {
    throw new Error(`执行命令未定义。`);
  }

  if (!dockerfile.expose) {
    throw new Error(`监听的端口未定义。`);
  }

  if (dockerfile.expose[0] !== 8080) {
    throw new Error(`监听的端口应是8080端口。`);
  }
}

export default (api, opts) => {
  api.onPluginReady(() => {
    const filePath = join(api.cwd, 'Dockerfile');

    if (!existsSync(filePath)) {
      opts.printError({
        exit: true,
        why: `项目中没有 Dockerfile 文件。`,
      });
      return;
    }

    const content = readFileSync(filePath, 'utf-8');
    let dockerfile;
    try {
      dockerfile = parse(content);
    } catch (e) {
      opts.printError({
        exit: true,
        why: `dockerfile 解析失败，不是合法的 dockerfile 文件。`,
      });
      return;
    }

    try {
      validate(dockerfile);
    } catch (e) {
      opts.printError({
        exit: true,
        why: e.message,
      });
    }
  });
};
