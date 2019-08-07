import Vue from 'vue';
import VueRouter from 'vue-router';

import { AcFtrLoginRoute } from '@/modules/ac-ftr-login';
import { AcAppMain } from '@/core/ac-app-main';
import { modulesRoute } from '@/modules';

Vue.use(VueRouter);

const router = new VueRouter({
	mode: 'history',
	routes: [
		{
			path: '/M',
			component: AcAppMain,
			redirect: '/test',
			meta: { requireAuth: true },
			children: [
				...modulesRoute,
			]
		},
		AcFtrLoginRoute,
		{
			/** for any unmatched routes */
			path: '/(.*)',
			redirect: '/login',
		},
	],
});

export default router;
