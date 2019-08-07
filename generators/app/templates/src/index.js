import Vue from 'vue';
import router from './router';
import store from './store';
import { navService } from '@/core';

// Install iview
import iView from 'iview';
import 'iview/dist/styles/iview.css';
Vue.use(iView);

import '@/assets/scss/main.scss';

// Install ac-component
import acComponent from '@/assets/ac-component/ac-component.js';
import '@/assets/ac-component/styles/ac-component.css';
Vue.use(acComponent);

// Install shared component
import sharedComponent from '@/shared';
Vue.use(sharedComponent);

// Coverage finally of promise.
Promise.prototype.finally = function doFinally(callback) {
	const P = this.constructor;
	return this.then(
		value => P.resolve(callback(value)).then(() => value),
		reason => P.resolve(callback(reason)).then(() => { throw reason; })
	);
};


/** Setting route guard */
import { interceptRoute } from '@/router/router.service';
interceptRoute(router);

new Vue({
	el: '#app',
	router,
	store,
	template: '<router-view></router-view>',
});

/** init the nav id on startup and watch it for changes */
navService.initNavId(router, store);
