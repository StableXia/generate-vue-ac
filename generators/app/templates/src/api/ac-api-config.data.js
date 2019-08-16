const AcApiConfig = {
	dev: {
		url: '/',
	},
	build: {
		url: '/',
	}
};

export default (process.env.NODE_ENV === 'production' ? AcApiConfig.build : AcApiConfig.dev);
