const nextEnv = require('next-env');
const dotenvLoad = require('dotenv-load');

dotenvLoad();

console.log(process.env);

const withNextEnv = nextEnv();

module.exports = withNextEnv();