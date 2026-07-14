const parsedPort = parseInt(process.env.PORT, 10);

const env = {
  port: Number.isNaN(parsedPort) ? 5000 : parsedPort,
  nodeEnv: process.env.NODE_ENV || 'development',
};

module.exports = env;
