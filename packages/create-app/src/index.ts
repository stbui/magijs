import fs from 'fs';
import path from 'path';
import { prompt } from 'enquirer';
import { yellow, green, cyan, magenta, lightRed, red, stripColors } from 'kolorist';
const argv = require('minimist')(process.argv.slice(2));

const cwd = process.cwd();

const TEMPLATES = [
    yellow('react'),
    green('vue'),
    // green('prophet'),
    // cyan('hfe-common'),
];

const renameFiles = {
    _gitignore: '.gitignore',
    _npmrc: '.npmrc',
};

async function init() {
    let targetDir = argv._[0];
    if (!targetDir) {
        // @ts-ignore
        const { name } = await prompt({
            type: 'input',
            name: 'name',
            message: `请输入项目名称:`,
            initial: 'magi-project',
        });
        targetDir = name;
    }

    const root = path.join(cwd, targetDir);
    console.log(`\n初始化模板 ${root} 目录...`);

    if (!fs.existsSync(root)) {
        fs.mkdirSync(root, { recursive: true });
    } else {
        const existing = fs.readdirSync(root);
        if (existing.length) {
            // @ts-ignore
            const { yes } = await prompt({
                type: 'confirm',
                name: 'yes',
                initial: 'Y',
                message: `打开的目录 ${targetDir} 已存在.\n` + `是否要继续执行?`,
            });
            if (yes) {
                emptyDir(root);
            } else {
                return;
            }
        }
    }

    // determine template
    let template = argv.t || argv.template;
    let message = '选择模板:';
    let isValidTemplate = false;

    // --template expects a value
    if (typeof template === 'string') {
        const availableTemplates = TEMPLATES.map(stripColors);
        isValidTemplate = availableTemplates.includes(template);
        message = `${template} 无效模板，请重新选择:`;
    }

    if (!template || !isValidTemplate) {
        // @ts-ignore
        const { t } = await prompt({
            type: 'select',
            name: 't',
            message,
            choices: TEMPLATES,
        });
        template = stripColors(t);
    }

    const templateDir = path.join(__dirname, '../', `template-${template}`);

    const write = (file, content?: string) => {
        const targetPath = renameFiles[file] ? path.join(root, renameFiles[file]) : path.join(root, file);
        if (content) {
            fs.writeFileSync(targetPath, content);
        } else {
            copy(path.join(templateDir, file), targetPath);
        }
    };

    const files = fs.readdirSync(templateDir);
    for (const file of files.filter(f => f !== 'package.json')) {
        write(file);
    }

    const pkg = require(path.join(templateDir, `package.json`));

    pkg.name = path
        .basename(root)
        // #2360 ensure packgae.json name is valid
        .trim()
        .replace(/\s+/g, '-')
        .replace(/^[._]/, '')
        .replace(/[~)('!*]+/g, '-');

    write('package.json', JSON.stringify(pkg, null, 2));

    // @ts-ignore
    const pkgManager = /yarn/.test(process.env.npm_execpath) ? 'yarn' : 'npm';

    console.log(`\n完成。可以执行:\n`);
    if (root !== cwd) {
        console.log(`  cd ${path.relative(cwd, root)}`);
    }
    console.log(`  ${pkgManager === 'yarn' ? `yarn` : `npm install`}`);
    console.log(`  ${pkgManager === 'yarn' ? `yarn start` : `npm run start`}`);
    console.log();
}

function copy(src, dest) {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
        copyDir(src, dest);
    } else {
        fs.copyFileSync(src, dest);
    }
}

function copyDir(srcDir, destDir) {
    fs.mkdirSync(destDir, { recursive: true });
    for (const file of fs.readdirSync(srcDir)) {
        const srcFile = path.resolve(srcDir, file);
        const destFile = path.resolve(destDir, file);
        copy(srcFile, destFile);
    }
}

function emptyDir(dir) {
    if (!fs.existsSync(dir)) {
        return;
    }
    for (const file of fs.readdirSync(dir)) {
        const abs = path.resolve(dir, file);
        // baseline is Node 12 so can't use rmSync :(
        if (fs.lstatSync(abs).isDirectory()) {
            emptyDir(abs);
            fs.rmdirSync(abs);
        } else {
            fs.unlinkSync(abs);
        }
    }
}

init().catch(e => {
    console.error(e);
});
