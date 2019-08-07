// The real environment can be released
// import { acLoginService } from '@/api';

export default {
	namespaced: true,

	state: {
		loginInfo: null,
	},

	mutations: {
		setLoginInfo(state, payload) {
			state.loginInfo = payload;
		},
	},

	actions: {
		getLoginInfo({ commit }, payload = {}) {
			// Simulation of the request.
			return new Promise((reslove) => {
				setTimeout(() => {
					commit('setLoginInfo', payload);
					reslove({ success: true, loginInfo: 'login-success' });
				}, 3000);
			});

			// The real request
			// return acLoginService.login(payload)
			// 	.then(res => {
			// 		commit('setLoginInfo', res);
			// 		return res;
			// 	});
		}
	},
};
