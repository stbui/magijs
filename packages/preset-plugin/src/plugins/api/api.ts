import { IApi, utils } from 'umi';

export default (api: IApi) => {
    api.registerCommand({
        name: 'api',
        fn({ args }) {
            console.log(
                utils.chalk.yellow(`
      api 命令已支持如下参数:
      generate [option] --app=[app]   自动生成 service 代码或 mock 数据
          option 可选值：service | mock
          --app 参数可生成指定应用的 service 或 mock
      
      示例：
      magi api generate                                        --> 通过命令行交互生成代码
      magi api generate service                                --> 按 config.js 中的配置生成 service 代码
      magi api generate service --app=xxx                      --> 生成 xxx 应用的 service 代码
      `)
            );
        },
    });
};
