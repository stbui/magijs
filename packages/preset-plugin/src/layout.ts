import { IApi } from 'umi';

export default (api: IApi) => {
  api.describe({
    key: 'layout',
    config: {
      schema(Joi) {
        return Joi.object();
      },
    },
    enableBy: api.EnableBy.config,
  });
};
