#! /usr/bin/env node

const program = require('commander');
const download = require('download-git-repo');
const {version} = require('./package.json');
const child_process = require('child_process');
const path = require('path');
//version 版本号
//name 新项目名称
program.version(version, '-v, --version')
  .command('init <templateName> <projectName>')
  .action((templateName, projectName) => {
    if (templateName === "vue") {
      console.log('clone template ...');
      download('github:mileagewan/mileage-cli-vue-template', projectName, function (err) {
        console.log(err ? 'Error' : 'Success')
      })
    } else if (templateName === "react") {
      console.log('clone template ...');
      download('github:mileagewan/mileage-cli-react-template', projectName, function (err) {
        console.log(err ? 'Error' : 'Success')
      })
    } else {
      console.error('A template name that does not exist')
    }
  });
program.command('mock <dataPath> <port>')
  .action((dataPath, port) => {
    console.log('mock server start ...');
    console.log(`dataPath: ${dataPath}`);
    console.log(`port: ${port}`);
    const cwd = process.cwd()
    const childProcessPath = path.join(cwd, 'node_modules', '.bin', 'mileage-mock')
    child_process.exec(`${childProcessPath} mock ${dataPath} ${port}`, function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
    });
  });
program.parse(process.argv);
