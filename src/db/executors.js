const { exec } = require('child_process');

const callback = (resolve, reject) => (error, stdout, stderr) => {
  if (error) {
    console.error(error.message, { origin: 'Sequelize' });
    reject(error.message);

    return;
  }
  if (stderr) {
    console.error(stderr.message, { origin: 'Sequelize' });
    reject(stderr.message);

    return;
  }

  console.info(stdout, { origin: 'Sequelize' });
  resolve();
};

// eslint-disable-next-line no-async-promise-executor
const runMigration = () => new Promise(async (resolve, reject) => {
  await exec('npx sequelize-cli db:migrate', callback(resolve, reject));
});

// eslint-disable-next-line no-async-promise-executor
const runSeedAll = () => new Promise(async (resolve, reject) => {
  await exec('npx sequelize-cli db:seed:all', callback(resolve, reject));
});

module.exports = {
  runMigration,
  runSeedAll,
};
