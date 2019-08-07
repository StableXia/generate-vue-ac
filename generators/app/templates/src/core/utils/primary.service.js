/* eslint no-param-reassign: 0 */

import Vue from 'vue';
import { Message } from 'iview';
import validateService from './validate.service';

/**
 * Change the state of loadingbar
 * @param { String } status State value, Three values of start、finish and error are optional.
 */
function changeLoadingBarStatus(status) {
	const actions = {
		start: () => Vue.prototype.$loadingBar.start(),
		finish: () => Vue.prototype.$loadingBar.finish(),
		error: () => Vue.prototype.$loadingBar.error(),
	};
	if (actions[status] || validateService.typeOf(actions[status]) === 'function') {
		actions[status]();
	} else {
		console.error('error in [changeLoadingBarStatus]: no corresponding status!');
		actions.error();
	}
}

/**
 * Change the element location.
 * @param { Object } el Element object,
 * @param { Number } from Start location.
 * @param { Number } to End location.
 * @param { Number } duration Animation time.
 */
function scrollTop(el, from = 0, to, duration = 500) {
	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = (
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			((cb) => { window.setTimeout(cb, 1000 / 60); })
		);
	}
	const _difference = Math.abs(from - to);
	const _step = Math.ceil((_difference / duration) * 50);

	function scroll(start, end, step) {
		if (start === end) return;

		let d = (start + step > end) ? end : start + step;
		if (start > end) {
			d = (start - step < end) ? end : start - step;
		}

		if (el === window) {
			window.scrollTo(d, d);
		} else {
			el.scrollTop = d;
		}
		window.requestAnimationFrame(() => scroll(d, end, step));
	}
	scroll(from, to, _step);
}

/**
 * Display prompt information.
 * @param { Boolean、String、Object } config Configuration parameter.
 */
function showMessage(config) {
	const configType = validateService.typeOf(config);

	if (configType === 'undefined') {
		console.error('error in [showMessage]: no config!');
		return;
	}

	const configActionMap = {
		boolean() {
			return {
				type: config ? 'success' : 'error',
				message: config ? '成功' : '失败',
			};
		},
		string() {
			return {
				type: 'info',
				message: config,
			};
		},
		object() {
			return Object.assign({
				type: 'success',
				message: '成功！',
			}, config);
		},
	};

	const newConfig = configActionMap[configType]();

	Message[newConfig.type](newConfig.message);
}

function downLoad(fileName, downLoadUrl) {
	const link = document.createElement('a');
	link.download = fileName;
	link.href = downLoadUrl;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

export default {
	changeLoadingBarStatus,
	scrollTop,
	showMessage,
	downLoad,
};
