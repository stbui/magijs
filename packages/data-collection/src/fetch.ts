const https = require('https');
const http = require('node:http');

function fetch(url: string, options): Promise<any> {
  return new Promise((resovle, reject) => {
    if (!url) {
      reject('xxxx');
    }

    const config = new URL(url);
    let client = config.protocol == 'https' ? https : http;

    const _options = {
      protocol: config.protocol,
      hostname: config.hostname,
      host: config.hostname,
      port: config.port,
      path: config.pathname,
      method: options.method,
      headers: options.headers,
      ...options,
    };

    const req = client
      .request(_options, res => {
        let data = '';

        res.on('data', chunk => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            resovle(data);
          } catch (e) {
            reject(e);
          }
        });
      })
      .on('error', err => {
        reject(err);
      });

    if (options.body) {
      const body = JSON.stringify(options.body);
      req.write(body);
    }

    req.end();
  });
}

export default fetch;

// fetch('http://127.0.0.1', {
//   method: 'POST',
// })
//   .then(res => {
//     console.log(res);
//   })
//   .catch(e => {
//     console.log('Error: xxxx', e);
//   });
