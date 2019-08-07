/**
 * Upwards, cross level
 * @param  {String} componentName
 * @param  {String} eventName
 * @param  {Object} params
 */
function dispatch(componentName, eventName, params) {
	let parent = this.$parent || this.$root;
	let [name] = [parent.$options.name];
	while (parent && (!name || name !== componentName)) {
		parent = parent.$parent;

		if (parent) {
			[name] = [parent.$options.name];
		}
	}
	if (parent) {
		parent.$emit.apply(parent, [eventName].concat(params));
	}
}

/**
 * Downcast, cross level
 * @param  {String} componentName
 * @param  {String} eventName
 * @param  {Object} params
 */
function broadcast(componentName, eventName, params) {
	this.$children.forEach((child) => {
		const [name] = [child.$options.name];

		if (name === componentName) {
			child.$emit.apply(child, [eventName].concat(params));
		} else {
			broadcast.apply(child, [componentName, eventName].concat([params]));
		}
	});
}

/**
 * Distribution to brotherhood nodes
 * @param  {String} componentName
 * @param  {String} eventName
 * @param  {Object} params
 */
function dispense(componentName, eventName, params) {
	const brothers = (this.$parent || this.$root) && this.$parent.$children;
	const _this = this;
	brothers.forEach((brother) => {
		const [name] = [brother.$options.name];

		if (name === componentName && _this !== brother) {
			brother.$emit.apply(brother, [eventName].concat(params));
		}
	});
}

export default {
	methods: {
		// Upwards, cross level
		dispatch(componentName, eventName, params) {
			dispatch.call(this, componentName, eventName, params);
		},
		// Downcast, cross level
		broadcast(componentName, eventName, params) {
			broadcast.call(this, componentName, eventName, params);
		},
		// Distribution to brotherhood nodes
		dispense(componentName, eventName, params) {
			dispense.call(this, componentName, eventName, params);
		},
	},
};
