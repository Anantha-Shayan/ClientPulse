module.exports = {
  apps: [
    {
      name: 'clientpulse-api',
      cwd: './backend',
      script: 'server.js',
      env: { NODE_ENV: 'production' }
    }
  ]
};
