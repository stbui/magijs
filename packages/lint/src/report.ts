import { writeFileSync, access } from 'fs';
import shelljs from 'shelljs';
import { stylelintReport } from './stylelint-report';

const eslintrcConfig = {
  root: true,
  extends: ['za/typescript-react'],
};

const stylelintrcConfig = {
  extends: 'stylelint-config-za',
};

const eslintFileName = '.eslintrc';
const styleFile = '.stylelintrc';

function isFileExisted(file) {
  return new Promise((resolve, reject) => {
    access(file, err => {
      if (err) {
        reject(err.message);
      } else {
        resolve('ok');
      }
    });
  });
}

async function generateFile(fileName: string, config) {
  try {
    var res = await isFileExisted(fileName);
    console.log('[magi]', fileName, res);
  } catch (error) {
    writeFileSync(fileName, JSON.stringify(config), 'utf-8');
    console.log('[magi]', fileName, 'created');
  }
}

export async function report(argv: string[]) {
  await generateFile(eslintFileName, eslintrcConfig);
  await generateFile(styleFile, stylelintrcConfig);

  stylelintReport();

  const argvParam = argv[1] || 'src';
  const esCmd = [
    'eslint',
    '-f',
    'checkstyle',
    '-o',
    'report_zacc_eslint_js.xml',
    '--ext',
    '.jsx,.js,.ts,.tsx',
    argvParam,
  ];

  const child = shelljs.exec(esCmd.join(' '), {
    async: true,
  });
  child.stdout.on('data', chunk => {
    console.log(chunk);
    console.log(`=> ./report_zacc_eslint_js.xml`);
  });
}
