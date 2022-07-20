const express = require('./express');
const chalk = require('./chalk');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(chalk.yellow(`Example app listening on port ${port}`));
});
