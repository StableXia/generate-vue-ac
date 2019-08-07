<template>
  <ac-app :class="['ac-app-main']">
    <ac-app-header slot="header"></ac-app-header>
    <ac-app-nav slot="nav"></ac-app-nav>
    <ac-app-content></ac-app-content>
  </ac-app>
</template>

<script>
import { AcAppHeader } from '../ac-app-header';
import { AcAppNav } from '../ac-app-nav';
import { AcAppContent } from '../ac-app-content';

export default {
  name: 'AcAppMain',
  components: {
    AcAppHeader,
    AcAppNav,
    AcAppContent,
  },
};
</script>
