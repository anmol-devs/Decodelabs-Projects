require('dotenv').config();

const app = require('./app');
const env = require('./src/config/env');

const server = app.listen(env.port, () => {
  console.log(`Server running on port ${env.port} in ${env.nodeEnv} mode`);
});

module.exports = server;
