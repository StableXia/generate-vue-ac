import AcApiService from '../ac-api.service';
import AcApiConfig from '../ac-api-config.data';

function normalizeData(respData) {
	return respData;
}

const acLoginService = {
	login(params = {}, config = {}) {
		return AcApiService.post(`${AcApiConfig.url}v1/account/login`, params, { config }, false).then(normalizeData);
	},
};

export default acLoginService;
