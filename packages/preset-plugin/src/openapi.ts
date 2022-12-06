import { logger } from '@umijs/utils';

export default api => {
  api.describe({
    key: 'openAPI',
    config: {
      schema(Joi) {
        return Joi.object();
      },
    },
    enableBy: api.EnableBy.config,
  });

  api.onStart(() => {
    logger.info('openAPI disabled');
  });
};
