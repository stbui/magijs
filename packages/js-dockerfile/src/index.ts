import { readFileSync } from 'fs';

export function parse(dockerFile) {
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

export function contentFromFile(filePath: string) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    return parse(content);
  } catch (e) {
    throw new Error('dockerfile 解析失败，不是合法的 dockerfile 文件。');
  }
}
