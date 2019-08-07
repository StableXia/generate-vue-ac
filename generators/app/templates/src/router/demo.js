import Vue from 'vue';
import VueRouter from 'vue-router';

import { AcAppMain } from '@/core/ac-app-main';
import { modulesDemoRoute } from '@/modules-demo';

Vue.use(VueRouter);

const router = new VueRouter({
	mode: 'history',
	routes: [
		{
			path: '/M',
			component: AcAppMain,
			redirect: '/test',
			children: [
				...modulesDemoRoute,
			]
		},
		{
			/** for any unmatched routes */
			path: '/(.*)',
			redirect: '/M',
		},
	],
});

export default router;
