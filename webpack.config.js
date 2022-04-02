const webpackConfig = require("./script/webpack.base");

const getEnv = function () {
  let isDev = false;
  let processArgv = process.argv;
  let env = processArgv[processArgv.length - 1].match(/env=(.*)/);
  console.log(env)
  if (env && env.length >= 2) {
    isDev = env[1] === "development";
  }
  console.log(isDev)
  return isDev;
};

module.exports = webpackConfig({ development: getEnv() });
