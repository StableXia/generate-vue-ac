/* eslint-disable no-undef */

const path = require('path');
const merge = require('webpack-merge');
const base = require('./webpack.base.config.js');
const config = require('../config');
const configJson = require('../project.config.json');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const portfinder = require('portfinder');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

base.entry = {
	demo: './src/demo.js',
};

const devWebpackConfig = merge(base, {
	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		contentBase: false,
		port: config.dev.port,
		open: config.dev.open,

		historyApiFallback: {
			rewrites: [
				{ from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
			],
		},
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': require('../config/dev-demo.env'),
		}),
		new HtmlWebpackPlugin({
			title: configJson.demo.htmlTitle,
			filename: 'index.html',
			template: 'demo.html',
		}),
	],
});

module.exports = new Promise((resolve, reject) => {
	portfinder.basePort = process.env.PORT || config.dev.port;
	portfinder.getPort((err, port) => {
		if (err) {
			reject(err);
		} else {
			// publish the new Port, necessary for e2e tests
			process.env.PORT = port;
			// add port to devServer config
			devWebpackConfig.devServer.port = port;

			// Add FriendlyErrorsPlugin
			devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
				compilationSuccessInfo: {
					messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
				},
				onErrors: config.dev.notifyOnErrors
					? utils.createNotifierCallback()
					: undefined
			}));

			resolve(devWebpackConfig);
		}
	});
});
