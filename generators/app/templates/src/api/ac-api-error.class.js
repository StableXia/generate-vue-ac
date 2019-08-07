
export const AcApiErrorCode = {
	GENERAL: 0,
	PROT_RESP_STATUS_CODE: 1, // Response error
	PROT_RESP_MALFORMAT_DATA: 2, // Data error
	PROT_RESP_NO_RESP: 3, // Request error
	PROT_REQ_NOT_SENT: 4, // Sent error
	MALFORMAT_DATA: 5, // Foreground data error
	SERVER_ERROR: 6, // Server response error
};

class AcApiError {
	/**
   * Unified API error type.
   * @param {{code: AcApiErrorCode, serverCode: number|null, message: string|null, source: Error|null }} prop properties for this error.
   */
	constructor(prop = {}) {
		Object.assign(this, {
			code: AcApiErrorCode.GENERAL,
			serverCode: null, // valid only if code === SERVER_ERROR
			message: null,
			source: null, // Error from which this AcApiError originates
		}, prop);
	}
}

export default AcApiError;
