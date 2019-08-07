/*
 * File Created: 2018-09-29 10:22:24 am
 * Author: xiawen
 * -----
 * Last Modified: 2018-09-29 10:56:40 am
 * Modified By: xiawen
 * -----
 * Copyright (c) 2018 AC
 */

/* eslint-disable no-console */
/* eslint-disable no-undef */

const webpack = require('webpack');
const webpackConfig = require('./webpack.prod.config');
const ora = require('ora');
const rlColor = require('cli-color');

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

const spinner = ora('building for production...');
spinner.start();

webpack(webpackConfig, (err, status) => {
	spinner.stop();
	if (err) throw err;

	process.stdout.write(status.toString({
		colors: true,
		modules: false,
		children: false,
		chunks: false,
		chunkModules: false
	}));

	if (status.hasErrors()) {
		consoleMsg.error('Build failed with errors.');
		process.exit(1);
	}

	consoleMsg.success('Build complete.');
	consoleMsg.notice('Tip: built files are meant to be served over an HTTP server.');
});
