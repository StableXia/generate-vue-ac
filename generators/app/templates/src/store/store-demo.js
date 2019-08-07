import Vue from 'vue';
import Vuex from 'vuex';

import { CoreStoreModule } from '@/core';

Vue.use(Vuex);

const demoStore = new Vuex.Store({
	modules: {
		CoreStoreModule,
	},
});

export default demoStore;
