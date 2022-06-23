import { IApi } from 'umi';

export default (api: IApi) => {
  api.registerCommand({
    name: 'lint',
    async fn({ args }) {},
  });
};
