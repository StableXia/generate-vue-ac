import AcApiService from '../ac-api.service';

function normalizeData(respData) {
	return respData;
}

const acCommonService = {
	getServerList(params = {}, config = {}) {
		return AcApiService.post('url', params, { config }, true).then(normalizeData);
	},

	addServerList(params = {}) {
		return AcApiService.get('url', { params }, true).then(normalizeData);
	},
};

export default acCommonService;
