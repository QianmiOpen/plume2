#!/usr/bin/env node
const commander = require('commander');
const fs = require('fs-extra');
const path = require('path');

commander.parse(process.argv);

const curDir = process.cwd();
const appName = commander.args[0] || '';

(() => {
  //validate appName
  if (!appName) {
    console.error('😭，please specify your app name');
    return;
  }

  const appPath = path.join(curDir, appName);
  fs.pathExists(appPath, (err, exists) => {
    const existsErr = exists ? new Error(`${appPath} was exisits`) : null;
    const error = err || existsErr;
    if (error) {
      console.error(error.message);
      return;
    }

    fs.copy(path.join(__dirname, './template'), appPath, err => {
      if (err) {
        throw err;
      }
      console.log(`😁 create ${appName} successfully.`);
    });
  });
})();
