import type { MagiApi } from '@magi/types';
import { logger } from '@umijs/utils';

export default (api: MagiApi) => {
  api.describe({
    key: 'sso',
    config: {
      schema(Joi) {
        return Joi.object();
      },
    },
    enableBy: api.EnableBy.config,
  });

  api.onStart(() => {
    logger.info('sso disabled');
  });
};
