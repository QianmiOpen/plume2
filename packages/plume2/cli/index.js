#!/usr/bin/env node
const commander = require('commander');

commander
  .version(require('../package.json'))
  .command('new [name]', 'create a new plume2 app')
  .parse(process.argv);
