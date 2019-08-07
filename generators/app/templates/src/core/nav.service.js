/* eslint-disable no-undef */

const navData = process.env.NODE_ENV === 'development-demo' ? require('./nav-demo.data').default : require('./nav.data').default;

function searchNavNode(predicate) {
	function getNode(children) {
		if (!children || children.length <= 0) {
			return null;
		}
		let oNode = null;
		children.every((node) => {
			if (predicate(node)) {
				oNode = node;
				return false;
			} else if (Array.isArray(node.children)) {
				oNode = getNode(node.children);
				if (oNode) { return false; }
			}
			return true;
		});
		return oNode;
	}
	return getNode(navData.children);
}

function getNavNode(navId) {
	if (!navId) {
		return null;
	}
	return searchNavNode(node => (node.navId === navId));
}

function initNavId(router, store) {
	let initialized = false;

	router.onReady(() => {
		const route = router.currentRoute;
		const navNode = searchNavNode(node => (route.path.indexOf(node.route) === 0));
		if (navNode) {
			store.commit({
				type: 'CoreStoreModule/selectNavItem',
				navId: navNode.navId,
			});
		}
		initialized = true;
	});

	router.beforeResolve((to, from, next) => {
		if (initialized) {
			/** watch for changes of route */
			const navNode = searchNavNode(node => (to.path.indexOf(node.route) === 0));
			if (navNode && navNode.navId !== store.state.CoreStoreModule.selectedNavItemId) {
				store.commit({
					type: 'CoreStoreModule/selectNavItem',
					navId: navNode.navId,
				});
			}
		}
		next();
	});
}

export default {
	getNavNode,
	initNavId,
	navData,
};

