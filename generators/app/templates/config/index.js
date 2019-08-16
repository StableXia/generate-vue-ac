const path = require('path');

module.exports = {
	dev: {
		port: process.env.NODE_ENV === 'development-demo' ? 6061 : 6062,
		open: true,

		assetsSubDirectory: 'static',
		assetsPublicPath: '/',
	},

	build: {
		assetsRoot: path.resolve(__dirname, '../dist'),
		assetsSubDirectory: 'static',
		assetsPublicPath: '/',
	},
};
