import Vue from 'vue';
import Vuex from 'vuex';

import { CoreStoreModule } from '@/core';
import { modulesStoreModule } from '@/modules';

Vue.use(Vuex);

const store = new Vuex.Store({
	modules: {
		CoreStoreModule,
		...modulesStoreModule,
	},
});

export default store;
