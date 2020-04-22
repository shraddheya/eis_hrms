const moment = require('moment');
const execSync = require('child_process').execSync;
const buildpath = require('./package.json').config.buildpath;

// const buildpath = "../../../../../01officeWork/githubEislabs/eis_hrms_deploy/dist/"
const dateTime = moment().format('MM/DD/YYYY HH:mm:ss');

execSync(`git -C ${buildpath} add -A && git -C ${buildpath} commit -m \"Release at ${dateTime}\" && git -C ${buildpath} push prod`, { stdio: [0, 1, 2]} );

