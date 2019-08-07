/*
 * File Created: 2018-09-28 11:08:59 am
 * Author: xiawen
 * -----
 * Last Modified: 2018-09-29 1:45:43 pm
 * Modified By: xiawen
 * -----
 * Copyright (c) 2018 AC
 */


/* eslint-disable import/prefer-default-export */
import localforage from 'localforage';

function interceptRoute(router) {
	router.beforeEach((to, from, next) => {
		// Determine if you need to log in.
		if (to.matched.some(res => res.meta.requireAuth)) {
			// Judge whether or not to log in.
			localforage.getItem('loginInfo', (err, value) => {
				// TODO: Here are some logic.
				if (value) {
					next();
				} else {
					// If you don't log in, you jump to the login interface.
					next({
						path: '/login',
					});
				}
			});
		} else {
			next();
		}
	});
}

export {
	interceptRoute,
};
