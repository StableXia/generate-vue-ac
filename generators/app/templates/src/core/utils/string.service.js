function trim(string) {
	return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
}

function camelcaseToHyphen(str) {
	return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export default {
	trim,
	camelcaseToHyphen,
};
