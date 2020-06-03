module.exports = {
  apps: [
    {
      name: "my-secondcompany-pwa",
      script: "./node_modules/.bin/ts-node",
      args: "./server/app.ts",
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "my-secondcompany-pwa-test",
      script: "./node_modules/.bin/ts-node",
      args: "./server/app.ts",
      env: {
        NODE_ENV: "test"
      }
    }
  ],
  deploy: {
    test: {
      user: "secondcompany",
      host: "platform.secondcompany.nl",
      ref: "origin/develop",
      repo: "git@gitlab.com:second-company/my-secondcompany-pwa.git",
      path: "/var/www/my-secondcompany-pwa-test",
      "post-deploy":
        "yarn build && pm2 startOrRestart ecosystem.config.js --only my-secondcompany-pwa-test"
    },
    production: {
      user: "secondcompany",
      host: "platform.secondcompany.nl",
      ref: "origin/master",
      repo: "git@gitlab.com:second-company/my-secondcompany-pwa.git",
      path: "/var/www/my-secondcompany-pwa",
      "post-deploy":
        "yarn build && pm2 startOrRestart ecosystem.config.js --only my-secondcompany-pwa"
    }
  }
};
