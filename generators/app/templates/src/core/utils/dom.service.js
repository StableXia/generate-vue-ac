import stringService from './string.service';

const addEvent = (() => {
	let fn = null;
	if (document.addEventListener) {
		fn = (element, event, handler) => {
			if (element && event && handler) {
				element.addEventListener(event, handler, false);
			}
		};
	} else {
		fn = (element, event, handler) => {
			if (element && event && handler) {
				element.attachEvent(`on${event}`, handler);
			}
		};
	}
	return fn;
})();

const removeEvent = (() => {
	let fn = null;
	if (document.removeEventListener) {
		fn = (element, event, handler) => {
			if (element && event) {
				element.removeEventListener(event, handler, false);
			}
		};
	} else {
		fn = (element, event, handler) => {
			if (element && event) {
				element.detachEvent(`on${event}`, handler);
			}
		};
	}
	return fn;
})();

const eleResize = {
	_handleResize(e) {
		const ele = e.target || e.srcElement;
		const trigger = ele.__resizeTrigger__;
		if (trigger) {
			const handlers = trigger.__z_resizeListeners;
			if (handlers) {
				const size = handlers.length;
				for (let i = 0; i < size; i += 1) {
					const h = handlers[i];
					const [handler, context] = [h.handler, h.context];
					handler.apply(context, [e]);
				}
			}
		}
	},
	_removeHandler(ele, handler, context) {
		const handlers = ele.__z_resizeListeners;
		if (handlers) {
			const size = handlers.length;
			for (let i = 0; i < size; i += 1) {
				const h = handlers[i];
				if (h.handler === handler && h.context === context) {
					handlers.splice(i, 1);
					return;
				}
			}
		}
	},
	_createResizeTrigger(ele) {
		const obj = document.createElement('object');
		obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden;opacity: 0; pointer-events: none; z-index: -1;');
		obj.onload = eleResize._handleObjectLoad;
		obj.type = 'text/html';
		ele.appendChild(obj);
		obj.data = 'about:blank';
		return obj;
	},
	_handleObjectLoad() {
		this.contentDocument.defaultView.__resizeTrigger__ = this.__resizeElement__;
		this.contentDocument.defaultView.addEventListener('resize', eleResize._handleResize);
	},
};

const onResize = {
	on(resEle, handler, context) {
		const ele = resEle;
		let handlers = ele.__z_resizeListeners;
		if (!handlers) {
			handlers = [];
			ele.__z_resizeListeners = handlers;

			if (getComputedStyle(ele, null).position === 'static') {
				ele.style.position = 'relative';
			}
			const obj = eleResize._createResizeTrigger(ele);
			ele.__resizeTrigger__ = obj;
			obj.__resizeElement__ = ele;
		}
		handlers.push({
			handler,
			context,
		});
	},
	off(resEle, handler, context) {
		const ele = resEle;
		const handlers = ele.__z_resizeListeners;
		if (handlers) {
			eleResize._removeHandler(ele, handler, context);
			if (handlers.length === 0) {
				const trigger = ele.__resizeTrigger__;
				if (trigger) {
					if (trigger.contentDocument) {
						trigger.contentDocument.defaultView.removeEventListener('resize', eleResize._handleResize);
					}
					ele.removeChild(trigger);
					delete ele.__resizeTrigger__;
				}
				delete ele.__z_resizeListeners;
			}
		}
	},
};

function hasClass(el, cls) {
	if (!el || !cls) return false;
	if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
	if (el.classList) {
		return el.classList.contains(cls);
	}
	return (`' '${el.className}' '`).indexOf(`' '${cls}' '`) > -1;
}

function addClass(el, cls) {
	if (!el) return;
	let curClass = el.className;
	const classes = (cls || '').split(' ');

	for (let i = 0, j = classes.length; i < j; i++) {
		const clsName = classes[i];
		if (!clsName) continue;

		if (el.classList) {
			el.classList.add(clsName);
		} else {
			if (!hasClass(el, clsName)) {
				curClass += `' '${clsName}`;
			}
		}
	}
	if (!el.classList) {
		el.className = curClass;
	}
}

function removeClass(el, cls) {
	if (!el || !cls) return;
	const classes = cls.split(' ');
	let curClass = `' '${el.className}' '`;

	for (let i = 0, j = classes.length; i < j; i++) {
		const clsName = classes[i];
		if (!clsName) continue;

		if (el.classList) {
			el.classList.remove(clsName);
		} else {
			if (hasClass(el, clsName)) {
				curClass = curClass.replace(`' '${clsName}' '`, ' ');
			}
		}
	}
	if (!el.classList) {
		el.className = stringService.trim(curClass);
	}
}

// For Modal scrollBar hidden
let cached;

function getScrollBarSize(fresh) {
	if (fresh || cached === undefined) {
		const inner = document.createElement('div');
		inner.style.width = '100%';
		inner.style.height = '200px';

		const outer = document.createElement('div');
		const outerStyle = outer.style;

		outerStyle.position = 'absolute';
		outerStyle.top = 0;
		outerStyle.left = 0;
		outerStyle.pointerEvents = 'none';
		outerStyle.visibility = 'hidden';
		outerStyle.width = '200px';
		outerStyle.height = '150px';
		outerStyle.overflow = 'hidden';

		outer.appendChild(inner);

		document.body.appendChild(outer);

		const widthContained = inner.offsetWidth;
		outer.style.overflow = 'scroll';
		let widthScroll = inner.offsetWidth;

		if (widthContained === widthScroll) {
			widthScroll = outer.clientWidth;
		}

		document.body.removeChild(outer);

		cached = widthContained - widthScroll;
	}
	return cached;
}

const SPECIAL_CHARS_REGEXP = /([:\-_]+(.))/g;
const MOZ_HACK_REGEXP = /^moz([A-Z])/;

function camelCase(name) {
	return name
		.replace(SPECIAL_CHARS_REGEXP, (_, separator, letter, offset) => {
			const str = offset ? letter.toUpperCase() : letter;
			return str;
		})
		.replace(MOZ_HACK_REGEXP, 'Moz$1');
}

function getStyle(element, styleName) {
	if (!element || !styleName) return null;
	styleName = camelCase(styleName);
	if (styleName === 'float') {
		styleName = 'cssFloat';
	}
	try {
		const computed = document.defaultView.getComputedStyle(element, '');
		return element.style[styleName] || computed ? computed[styleName] : null;
	} catch (e) {
		return element.style[styleName];
	}
}

// Find components upward
function findComponentUpward(context, componentName, componentNames) {
	if (typeof componentName === 'string') {
		componentNames = [componentName];
	} else {
		componentNames = componentName;
	}

	let parent = context.$parent;
	let [name] = [parent.$options.name];
	while (parent && (!name || componentNames.indexOf(name) < 0)) {
		parent = parent.$parent;
		if (parent) [name] = [parent.$options.name];
	}
	return parent;
}

// Find component downward
function findComponentDownward(context, componentName) {
	const childrens = context.$children;
	let children = null;

	if (childrens.length) {
		childrens.forEach((child) => {
			const [name] = [child.$options.name];
			if (name === componentName) {
				children = child;
			}
		});

		for (let i = 0; i < childrens.length; i++) {
			const child = childrens[i];
			const [name] = [child.$options.name];
			if (name === componentName) {
				children = child;
				break;
			} else {
				children = findComponentDownward(child, componentName);
				if (children) break;
			}
		}
	}
	return children;
}

// Find components downward
function findComponentsDownward(context, componentName, components = []) {
	const childrens = context.$children;

	if (childrens.length) {
		childrens.forEach((child) => {
			const [name] = [child.$options.name];
			const childs = child.$children;

			if (name === componentName) components.push(child);
			if (childs.length) {
				const findChilds = findComponentsDownward(child, componentName, components);
				if (findChilds) components.concat(findChilds);
			}
		});
	}
	return components;
}

function setupMutationObserver(targetEl, options, callback) {
	if (!typeof MutationObserver || !targetEl) { return null; }

	const eOpts = Object.assign({
		childList: true,
		attributes: true,
		characterData: true,
		subtree: true,
	}, options);
	const observer = new MutationObserver(callback);

	observer.observe(targetEl, eOpts);

	return observer;
}

function getScrollParent(element, includeHidden) {
	let style = getComputedStyle(element);
	const excludeStaticParent = style.position === 'absolute';
	const overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;

	if (style.position === 'fixed') { return document.body; }
	let parent = element.parentElement;
	for (; parent; parent = parent.parentElement) {
		style = getComputedStyle(parent);
		if (excludeStaticParent && style.position === 'static') {
			continue;
		}
		if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) {
			return parent;
		}
	}

	return document.body;
}

export default {
	addEvent,
	removeEvent,
	onResize,
	hasClass,
	addClass,
	removeClass,
	getScrollBarSize,
	getStyle,
	findComponentUpward,
	findComponentDownward,
	findComponentsDownward,
	setupMutationObserver,
	getScrollParent,
};
