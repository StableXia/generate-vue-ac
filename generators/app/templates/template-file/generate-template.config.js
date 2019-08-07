/*
 * File Created: 2018-09-12 1:19:03 pm
 * Author: xiawen
 * -----
 * Last Modified: 2018-09-12 4:47:01 pm
 * Modified By: xiawen
 * -----
 * Copyright (c) 2018 rongyi
 */

/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const path = require('path');
const fs = require('fs');
const readline = require('readline');
const rlColor = require('cli-color');
const pageTemplate = require('./page-template.service.js');

function joinPath(dir) {
	return path.join(__dirname, '../src', dir);
}

function exists(path) {
	return fs.existsSync(path);
}

function isFile(path) {
	return exists(path) && fs.statSync(path).isFile();
}

function isDir(path) {
	return exists(path) && fs.statSync(path).isDirectory();
}

function readSyncByRl(tips) {
	tips = tips || '> ';

	return new Promise((resolve) => {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});

		rl.question(tips, (answer) => {
			resolve({ answer, rl });
		});
	});
}

class Message {
	constructor() { }
	error(msg) {
		console.log(rlColor.red.bold(msg));
	}
	warn(msg) {
		console.log(rlColor.yellow(msg));
	}
	notice(msg) {
		console.log(rlColor.blue(msg));
	}
	success(msg) {
		console.log(rlColor.green(msg));
	}
}

const consoleMsg = new Message();


function writeFile(name, content) {
	return new Promise((reslove, reject) => {
		fs.writeFile(name, content, (err) => {
			if (err) {
				reject({
					success: false,
					message: err
				});
			} else {
				reslove({
					success: true
				});
			}
		});
	});
}

const fileParamSource = JSON.parse(process.env.npm_config_argv).original;

// if (!fileParamSource[2] || !fileParamSource[3] || !(fileParamSource[2] === 'html' || fileParamSource[2] === 'scss' || fileParamSource[2] === 'js')) {
// 	consoleMsg.error(`
//     Please enter the correct instruction.
//     eg:
//       npm run generate html [fileName]
//       npm run generate scss [fileName]
//       npm run generate js   [fileName]
//   `);
// 	process.exit(1);
// }

// const dirMap = {
// 	html: 'pages',
// 	js: 'js',
// 	scss: 'styles',
// };
// const dirName = fileParamSource[2];
// const fileName = fileParamSource[3];
// const rootPath = joinPath(`${dirMap[dirName]}/${fileName}.${dirName}`);

// let templateContent = '';
// if (dirName === 'html') {
// 	templateContent = pageTemplate.createPageTemplateModule(fileName);
// }

// if (isFile(rootPath)) {
// 	readSyncByRl(`The [${fileName}.${dirName}] already exists, overridden or not? <yes or no>`)
// 		.then(({ answer, rl }) => {
// 			rl.close();

// 			if (answer === 'yes') {
// 				writeFile(rootPath, templateContent)
// 					.then(() => {
// 						consoleMsg.success('success!!!');
// 					})
// 					.catch(err => {
// 						consoleMsg.error(err.message);
// 					})
// 			}
// 		});
// } else {
// 	writeFile(rootPath, templateContent)
// 		.then(() => {
// 			consoleMsg.success('success!!!');
// 		})
// 		.catch(err => {
// 			consoleMsg.error(err.message);
// 		});
// }




