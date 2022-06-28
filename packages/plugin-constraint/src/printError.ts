import { getErrorMsg } from './getErrorMsg';

export function printError(opts: { ruleId: string; rule }, args: { why?: string; exit?: boolean } = {}) {
    console.error(
        getErrorMsg(opts, {
            why: args.why,
        })
    );
    if (args.exit) {
        process.exit(1);
    }
}
