/* eslint-disable no-undef */

const AcApiConfig = {
	dev: {
		url: 'http://vega-dev.rongyi.com/',
		analysisUrl: 'http://192.168.10.170:9002/api/',
	},
	build: {
		url: 'http://vega.rongyi.com/',
		analysisUrl: 'http://altair.rongyi.com/api/',
	}
};

export default (process.env.NODE_ENV === 'production' ? AcApiConfig.build : AcApiConfig.dev);
