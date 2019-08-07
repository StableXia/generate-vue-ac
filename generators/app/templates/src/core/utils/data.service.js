import validateService from './validate.service';

function evil(fn) {
	const Fn = Function;
	return new Fn(`return ${fn}`)();
}

function deepCopy(data) {
	const t = validateService.typeOf(data);
	let o;

	if (t === 'array') {
		o = [];
	} else if (t === 'object') {
		o = {};
	} else {
		return data;
	}

	if (t === 'array') {
		for (let i = 0; i < data.length; i++) {
			o.push(deepCopy(data[i]));
		}
	} else if (t === 'object') {
		for (const i in data) {
			o[i] = deepCopy(data[i]);
		}
	}
	return o;
}

function numberToIp(ipNumber) {
	let ip = '';
	if (ipNumber || ipNumber > 0) {
		ip = `${((ipNumber << 0) >>> 24)}.${((ipNumber << 8) >>> 24)}.${((ipNumber << 16) >>> 24)}.${((ipNumber << 24) >>> 24)}`;
	}
	return ip;
}

function ipToNumber(ip) {
	let num = 0;
	ip = ip.split('.');
	num = (Number(ip[0]) * 256 * 256 * 256) + (Number(ip[1]) * 256 * 256) + (Number(ip[2]) * 256) + Number(ip[3]);
	[num] = [num >>> 0];
	return num;
}

export default {
	deepCopy,
	evil,
	numberToIp,
	ipToNumber,
};
