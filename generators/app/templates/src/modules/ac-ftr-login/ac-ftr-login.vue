<template>
  <div class="ac-ftr-login">
    <div class="ac-ftr-login__bg">
      <ac-ftr-login-bg />
    </div>
    <div class="ac-ftr-login__form">
      <ac-ftr-login-form @on-success="loginSuccess"/>
    </div>
  </div>
</template>

<style lang="scss">
  .ac-ftr-login{
    width:100wh;
    height:100vh;
    overflow: hidden;
    position: relative;

    &__bg {
      width: 100%;
      height: 100%;
    }

    &__form {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
</style>

<script>
import { AcFtrLoginBg, AcFtrLoginForm } from './components-private';

export default {
  name: 'AcFtrLogin',

  components: {
    AcFtrLoginBg,
    AcFtrLoginForm,
  },

  methods: {
    loginSuccess() {
      this.$router.push('/M');
    },
  },
};
</script>
