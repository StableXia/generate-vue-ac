<template>
  <ac-nav
    theme="trans-dark"
    :accordion="false"
    :selected="selectedNavItemId"
    :collapsible="true"
    :controlledCollapse="true"
    :collapsed="navCollapsed"
    @select="onSelectNavItem"
  >
    <template v-for="menu in navData.children">
      <ac-nav-item v-if="!menu.children" :key="menu.navId" :navId="menu.navId" :offset-level="0" :tooltip="menu.text">
        <ac-icon slot="icon" :type="menu.icon"></ac-icon>
        <span>{{ menu.text }}</span>
      </ac-nav-item>
      <ac-nav-group v-else :key="menu.navId" :nav-id="menu.navId" :offset-level="0" :tooltip="menu.text">
        <ac-icon slot="title-icon" :type="menu.icon"></ac-icon>
        <span slot="title-content">{{ menu.text }}</span>
        <template v-for="firstSubMenu in menu.children">
          <ac-nav-item v-if="!firstSubMenu.children" :key="firstSubMenu.navId" :navId="firstSubMenu.navId" :offset-level="1" :tooltip="firstSubMenu.text">
            <ac-icon slot="icon" :type="firstSubMenu.icon"></ac-icon>
            <span>{{ firstSubMenu.text }}</span>
          </ac-nav-item>
          <ac-nav-group v-else :key="firstSubMenu.navId" :nav-id="firstSubMenu.navId" :offset-level="1" :tooltip="firstSubMenu.text">
            <ac-icon slot="title-icon" :type="firstSubMenu.icon"></ac-icon>
            <span slot="title-content">{{ firstSubMenu.text }}</span>
            <ac-nav-item v-for="secondSubMenu in firstSubMenu.children" :key="secondSubMenu.navId"
              :nav-id="secondSubMenu.navId"
              :offset-level="2"
              :tooltip="secondSubMenu.text"
            >
              <ac-icon slot="icon" :type="secondSubMenu.icon"></ac-icon>
              <span>{{ secondSubMenu.text }}</span>
            </ac-nav-item>
          </ac-nav-group>
        </template>
      </ac-nav-group>
    </template>
  </ac-nav>
</template>;

<style lang="scss">
.ac-app-nav {
  overflow: visible;
}
</style>

<script>
import { mapState, mapMutations } from 'vuex';
import navService from '../nav.service';
import { StoreNamespace } from '@/store/store-namespace.data';

export default {
  name: 'AcAppNav',

  data() {
    return {
      navData: navService.navData,
    };
  },

  computed: {
    ...mapState(StoreNamespace.CORE_STORE_MODULE, {
      navCollapsed: state => state.navCollapsed,
      selectedNavItemId: state => state.selectedNavItemId,
    }),
  },

  methods: {
    ...mapMutations(StoreNamespace.CORE_STORE_MODULE ,{
      selectNavItem: 'selectNavItem',
    }),

    onSelectNavItem(navId) {
      const navNode = navService.getNavNode(navId);

      this.selectNavItem({ navId });

      if (navNode && navNode.route) {
        this.$router.push(navNode.route);
      }
    },
  },
};
</script>
