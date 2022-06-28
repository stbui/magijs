import { utils } from 'umi';

export default function isSrcFile(opts: { srcPath: string; filePath: string }) {
    const srcPath = utils.winPath(opts.srcPath) + `/`;
    const filePath = utils.winPath(opts.filePath);
    if (filePath.startsWith(srcPath)) {
        const relPath = filePath.replace(srcPath, '');
        if (
            !relPath.startsWith('.magi/') &&
            !relPath.startsWith('.magi-production/') &&
            !relPath.startsWith('.magi-test/')
        ) {
            return true;
        }
    }
    return false;
}
