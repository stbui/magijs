import { run } from './run';

(async function main() {
  await run();
})().catch(error => {
  process.exitCode = 1;
  console.error(error);
});
