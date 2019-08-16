import AcApiError, { AcApiErrorCode } from './ac-api-error.class';
import AcApiAdapterAxios from './ac-api-adapter-axios.class';

function createHeader() {
	const loginInfo = JSON.parse(localStorage.getItem(`${window.location.host}_loginInfo`));
	return loginInfo && loginInfo.Token ? { Authorization: `Bearer ${loginInfo.Token}` } : {};
}

function handleGeneralError(error, apiMethod, url) {
	if (error instanceof AcApiError) {
		throw error;
	} else if (error instanceof Error) {
		console.error(error);
		throw new AcApiError({
			code: AcApiErrorCode.GENERAL,
			message: `Error when doing [${apiMethod}] to [${url}]: ${error.message}`,
			source: error,
		});
	} else {
		console.error(error);
		throw new AcApiError({
			code: AcApiErrorCode.GENERAL,
			message: `Error when doing [${apiMethod}] to [${url}]: ${error}`,
		});
	}
}

/**
 * Detect if server indicates business error occurred in the backend.
 * Normalized server responsed data should be of the shape as below in order to get this work:
 * ```
 * {
 * success: boolean,
 * code?: number, // present when success === false
 * message?: string, // present when success === false
 * data?: any, // the actual business data we want to receive when success === true
 * }
 * ```
 * @param {any} respData server returned data from response
 * @param {string} apiMethod
 * @param {string} url
 */
function handleServerBusinessError(respData, apiMethod, url) {
	if (respData && respData.success !== true) {
		throw new AcApiError({
			code: AcApiErrorCode.SERVER_ERROR,
			serverCode: respData.code || 0,
			message: `Server error when doing [${apiMethod}] to [${url}]: ${respData.errorMessage}`,
			errorMessage: respData.errorMessage,
		});
	}
	return respData;
}

/**
 * Low-level API class for invoking network adapter to initiate request to servers,
 * it also does some primitive error handlings for general cases, while some of these
 * error handlings are performed in network adapter.
 *
 * `config` argument used in some of the member functions are in flavor of Axios config
 * object (https://github.com/axios/axios#request-config), with some additional properties:
 * ```
 * {
 * requestType: string, // 'json'(default), 'form-urlencoded'
 * }
 * ```
 * `AcApi` would not do much with `config` but pass it to adapter to allow adapters to
 * translate and handle respectively.
 */

class AcApi {
	constructor(adapter = new AcApiAdapterAxios()) {
		this._adapter = adapter;
		this._baseUrl = '';
		this._defaultConfig = {
			timeout: 180000,
			requestType: 'json',
			responseType: 'json',
			headers: {},
		};
	}

	_getUrl(endpoint) {
		return `${this._baseUrl}${endpoint}`;
	}

	_normalizeConfig(inConfig) {
		function getContentTypeFromRequestType(requestType) {
			if (requestType === 'json') {
				return 'application/json';
			} else if (requestType === 'form-urlencoded') {
				return 'application/x-www-form-urlencoded;charset=UTF-8';
			}
			return 'text/plain';
		}

		const preNormalizedConfig = Object.assign({}, this._defaultConfig, inConfig);

		/** we want to merge header config */
		const headers = Object.assign(createHeader(), this._defaultConfig.headers, {
			'Content-Type': getContentTypeFromRequestType(preNormalizedConfig.requestType),
		}, inConfig.headers || {});

		return Object.assign({}, preNormalizedConfig, {
			headers,
			/** there could be more to-merged config */
		});
	}

	get(endpoint, config = {}, detectServerBusinessError = false) {
		const apiConfig = this._normalizeConfig(config);
		const url = this._getUrl(endpoint);

		let result = this._adapter.get(url, apiConfig).catch((error) => {
			handleGeneralError(error, 'get', url);
		});
		if (detectServerBusinessError) {
			result = result.then(respData => handleServerBusinessError(respData, 'get', url));
		}
		return result;
	}

	post(endpoint, data, config = {}, detectServerBusinessError = false) {
		const apiConfig = this._normalizeConfig(config);
		const url = this._getUrl(endpoint);

		let result = this._adapter.post(url, data, apiConfig).catch((error) => {
			handleGeneralError(error, 'post', url);
		});
		if (detectServerBusinessError) {
			result = result.then(respData => handleServerBusinessError(respData, 'post', url));
		}
		return result;
	}

	put(endpoint, data, config = {}, detectServerBusinessError = false) {
		const apiConfig = this._normalizeConfig(config);
		const url = this._getUrl(endpoint);

		let result = this._adapter.put(url, data, apiConfig).catch((error) => {
			handleGeneralError(error, 'put', url);
		});
		if (detectServerBusinessError) {
			result = result.then(respData => handleServerBusinessError(respData, 'put', url));
		}
		return result;
	}

	delete(endpoint, config = {}, detectServerBusinessError = false) {
		const apiConfig = this._normalizeConfig(config);
		const url = this._getUrl(endpoint);

		let result = this._adapter.delete(url, apiConfig).catch((error) => {
			handleGeneralError(error, 'delete', url);
		});
		if (detectServerBusinessError) {
			result = result.then(respData => handleServerBusinessError(respData, 'delete', url));
		}
		return result;
	}
}

const apiService = new AcApi();

export {
	AcApi,
};

export default apiService;
