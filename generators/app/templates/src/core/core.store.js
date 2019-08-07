export default {
	namespaced: true,

	state: {
		navCollapsed: false,
		selectedNavItemId: '',
	},

	mutations: {
		selectNavItem(state, payload) {
			state.selectedNavItemId = payload.navId;
		},
		
		toggleNav(state, payload) {
			state.navCollapsed = payload ? payload.collapse : !state.navCollapsed;
		},
	},
};
