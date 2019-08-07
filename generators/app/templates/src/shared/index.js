const acComponents = {};

const install = function (Vue) {
	Object.keys(acComponents).forEach(key => {
		Vue.component(key, acComponents[key]);
	});
};

const api = {
	install,
};

export default api;
