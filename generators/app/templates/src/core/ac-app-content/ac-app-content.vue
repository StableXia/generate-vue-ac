<template>
  <main :class="['ac-app-content', 'ac-layout']">
    <ac-scroll-view :class="['ac-layout__flex']" ref="lcScrollView">
      <section :class="['ac-app-content__inner']">
        <!-- for the feature route -->
        <router-view></router-view>
      </section>
    </ac-scroll-view>
  </main>
</template>

<style lang="scss">
@import '../../assets/scss/vars';

.ac-app-content {
  overflow: hidden;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  &__inner {
    min-width: $app-content-min-width;
    overflow: visible;
    padding: $padding-primary;
  }
}
</style>

<script>
export default {
  name: 'AcAppContent',
};
</script>
