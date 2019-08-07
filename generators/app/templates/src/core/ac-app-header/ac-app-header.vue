<template>
  <ac-toolbar :class="['ac-app-header']" :height="48" :withShadow="true" :forApp="true">
    <ac-toolbar-title :width="titleWidth" :class="{'ac-layout--center-justify': navCollapsed, 'ac-layout--around-justify': !navCollapsed}">
      <ac-tooltip :content="title" placement="right" :disabled="!navCollapsed">
        <div class="ac-layout ac-layout--center-items">
          <div  class="ac-app-header__logo ac-layout ac-layout--center-items ac-layout--center-justify">
            <ac-icon type="QQ" size="large"></ac-icon>
          </div>
          <span v-show="!navCollapsed" class="ac-app-header__title">{{ title }}</span>
        </div>
      </ac-tooltip>
    </ac-toolbar-title>
    <ac-toolbar-block>
      <span :class="['ac-app-header__nav-trigger']" @click="onClickNavTrigger">
        <ac-icon type="apps" size="medium" asBlock></ac-icon>
      </span>
    </ac-toolbar-block>
  </ac-toolbar>
</template>

<style lang="scss">
@import '../../assets/scss/vars';

.ac-app-header {
  overflow: visible;

  &__nav-trigger {
    cursor: pointer;
  }

  &__logo {
    height: 48px;
    width: 48px;
  }

  &__title {
    margin-left: -$margin-primary-small;
  }
}
</style>

<script>
import { mapState, mapMutations } from 'vuex';
import { StoreNamespace } from '@/store/store-namespace.data';
import configJson from '../../../project.config.json';

const NODE_ENV = process.env.NODE_ENV;

export default {
  name: 'AcAppHeader',

  data() {
    return {
      title: NODE_ENV === 'development-demo' ? configJson.demo.appTitle : configJson.app.appTitle,
    };
  },

  computed: {
    titleWidth() {
      return this.navCollapsed ? 48 : undefined;
    },
    ...mapState(StoreNamespace.CORE_STORE_MODULE, {
      navCollapsed: state => state.navCollapsed,
    }),
  },
  
  methods: {
    onClickNavTrigger() {
      this.toggleNav();
    },
    ...mapMutations(StoreNamespace.CORE_STORE_MODULE, {
      toggleNav: 'toggleNav',
    }),
  },
};
</script>
