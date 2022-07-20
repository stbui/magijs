import serveStatic from 'serve-static';
import finalhandler from 'finalhandler';
import http from 'http';
import { join } from 'path';

export function ServerStatic() {
  const serve = serveStatic(join(__dirname, '../dist'), { index: ['index.html', 'index.htm'] });

  var server = http.createServer(function onRequest(req, res) {
    serve(req, res, finalhandler(req, res));
  });

  server.listen(9966);
  console.log();
  console.log('查看文档: ', 'http://127.0.0.1:9966/');
}
