import configlocal from './configlocal';

function gitRemoteOriginUrl() {
  const cwd = process.cwd();
  const remoteName = 'origin';
  let url = '';

  configlocal(cwd, function (err, config) {
    url = config.remote && config.remote[remoteName] && config.remote[remoteName].url;
  });

  return url;
}

export default gitRemoteOriginUrl;
