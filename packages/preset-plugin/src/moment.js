import momentPlugin from '@umijs/plugins/dist/moment2dayjs';
import { logger } from '@umijs/utils';

export default api => {
  api.onStart(() => {
    logger.info('Using Moment Plugin');
  });
  // @ts-ignore
  momentPlugin(api);
};
