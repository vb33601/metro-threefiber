module.exports = {
  apps: [
    {
      name: 'metro-threefiber',
      cwd: '.',
      script: 'npx',
      args: 'vite preview --port 4002 --host 0.0.0.0 --strictPort',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        HOST: '0.0.0.0'
      },
      autorestart: true,
      max_restarts: 100,
      min_uptime: '5s',
      cron_restart: '0 */6 * * *',
      restart_delay: 2000,
      log_file: './logs/app.log',
      out_file: './logs/out.log',
      err_file: './logs/err.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      max_memory_restart: '500M',
      watch: false,
      kill_timeout: 5000,
      listen_timeout: 8000,
      pmx: false,
      automation: false
    }
  ]
};
