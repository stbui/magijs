import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import FileStreamRotator from 'file-stream-rotator';

const logDirectory = path.join(process.cwd(), 'logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYY-MM-DD',
  filename: path.join(logDirectory, 'access-%DATE%.log'),
  frequency: 'daily',
  verbose: false,
});

morgan.format('stbui', '[:date[iso]] :response-time ms :status :method :url');

export default () => morgan('stbui', { stream: accessLogStream });
