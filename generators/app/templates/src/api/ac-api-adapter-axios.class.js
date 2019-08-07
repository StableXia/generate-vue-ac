import qs from 'qs';
import axios from 'axios';
import AcApiError, { AcApiErrorCode } from './ac-api-error.class';

/**
 * Normalized the protocol errors to `AcApiError`
 */
function handleProtocolError(error, axiosRunningConfig) {
	if (error.response) {
		throw new AcApiError({
			code: AcApiErrorCode.PROT_RESP_STATUS_CODE,
			message: `Response of [${axiosRunningConfig.method}] to [${axiosRunningConfig.url}] has status code [${error.response.status}]`,
		});
	} else if (error.request) {
		throw new AcApiError({
			code: AcApiErrorCode.PROT_RESP_NO_RESP,
			message: `No response for [${axiosRunningConfig.method}] to [${axiosRunningConfig.url}]`,
		});
	} else {
		throw new AcApiErrorCode({
			code: AcApiErrorCode.PROT_REQ_NOT_SENT,
			message: `Request for [${axiosRunningConfig.method}] to [${axiosRunningConfig.url}] failed to be sent`,
			source: (error instanceof Error) ? error : null,
		});
	}
}

/**
 * Detect protocol-level malformatted response.
 * @returns {any}
 */
function screenResponse(response) {
	const axiosRunningConfig = response.config;

	if (response.status !== 200 && response.status !== 204) {
		throw new AcApiError({
			code: AcApiErrorCode.PROT_RESP_MALFORMAT_DATA,
			message: `Malformat data: Response of [${axiosRunningConfig.method}] to [${axiosRunningConfig.url}] has undesired status code [${response.status}]`,
		});
	} else if (response.data === null || response.data === undefined) {
		/** force to have effective data */
		throw new AcApiError({
			code: AcApiErrorCode.PROT_RESP_MALFORMAT_DATA,
			message: `Null Response of [${axiosRunningConfig.method}] to [${axiosRunningConfig.url}]`,
		});
	}

	return response;
}

/**
 * Extract adapter config that is used for driving low-level axios, from the normalized api config.
 */
function getAdapterConfigFromApiConfig(apiConfig) {
	const adapterConfig = Object.assign({}, apiConfig);
	/** remove those AcApi-specific configs that would not be used for axios */
	delete adapterConfig.requestType;
	return adapterConfig;
}

function normalizeRequestData(data, apiConfig) {
	let nData = null;
	if (apiConfig.requestType === 'json') {
		nData = data;
	} else if (apiConfig.requestType === 'form-urlencoded') {
		nData = qs.stringify(data);
	} else {
		nData = String(data);
	}
	return nData;
}

/**
 * Axios adapter as data communication layer for AcApi
 */
class AcApiAdapterAxios {
	constructor() {
		this._axios = axios.create();
		/** special config to tweak this adapter internal */
		this._specialConfig = {};
	}

	_getRunningConfig(apiConfig, forceConfig) {
		const adapterConfig = getAdapterConfigFromApiConfig(apiConfig);
		return Object.assign({}, this._specialConfig, adapterConfig, forceConfig);
	}

	/**
   * @returns {Promise}
   */
	_initiate(runningConfig) {
		return this._axios(runningConfig).catch((error) => {
			handleProtocolError(error, runningConfig);
		}).then(screenResponse).then(response => response.data);
	}

	get(url, config = {}) {
		const axiosRunningConfig = this._getRunningConfig(config, {
			url,
			method: 'get',
		});

		return this._initiate(axiosRunningConfig);
	}

	post(url, data, config = {}) {
		const axiosRunningConfig = this._getRunningConfig(config, {
			url,
			method: 'post',
			data: normalizeRequestData(data, config),
		});

		return this._initiate(axiosRunningConfig);
	}

	put(url, data, config = {}) {
		const axiosRunningConfig = this._getRunningConfig(config, {
			url,
			method: 'put',
			data: normalizeRequestData(data, config),
		});

		return this._initiate(axiosRunningConfig);
	}

	delete(url, config = {}) {
		const axiosRunningConfig = this._getRunningConfig(config, {
			url,
			method: 'delete',
		});

		return this._initiate(axiosRunningConfig);
	}
}

export default AcApiAdapterAxios;
