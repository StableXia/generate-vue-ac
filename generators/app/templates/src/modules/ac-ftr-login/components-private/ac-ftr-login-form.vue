<template>
  <div class="ac-ftr-login-form ac-layout ac-layout--center-justify ac-layout--center-items">
    <Form
      ref="formInline"
      :model="formInline"
      :rules="ruleInline"
      class="ac-layout ac-layout--column ac-layout--center-items"
    >
      <Form-item>
        <span class="ac-ftr-login-form__title ac-typo-display2">SSP后台管理系统</span>
      </Form-item>
      <Form-item prop="username">
        <Input
          class="ac-form-width-primary-large"
          type="text"
          v-model="formInline.username"
          placeholder="请输入用户名..."
        >
          <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </Form-item>

      <Form-item prop="password">
        <Input
          class="ac-form-width-primary-large"
          type="password"
          v-model="formInline.password"
          placeholder="请输入密码..."
        >
          <Icon type="ios-locked-outline" slot="prepend"></Icon>
        </Input>
      </Form-item>

      <Form-item>
        <Button
          class="ac-ftr-login-form__btn"
          type="primary"
          :loading="loading"
          @click="handleSubmit('formInline')"
        >登 录</Button>
      </Form-item>
    </Form>
  </div>
</template>

<style lang="scss">
.ac-ftr-login-form {
  height: 100%;
  width: 100%;

  &__title {
    color: darken(#fff, 5%);
  }

  &__btn {
    width: 200px;
    &:hover {
      animation: change-width-btn 0.5 forwards;
    }
  }
}

@keyframes change-width-btn {
  0% {
    width: 200px;
  }
  100% {
    width: 240px;
  }
}
</style>

<script>
import localforage from "localforage";
import { mapActions } from "vuex";
import { StoreNamespace } from "@/store/store-namespace.data";

export default {
  name: "AcFtrLoginForm",

  data() {
    return {
      formInline: {
        username: "",
        password: ""
      },
      ruleInline: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      },
      loading: false
    };
  },

  methods: {
    ...mapActions(StoreNamespace.AC_FTR_LOGIN_STORE_MODULE, {
      getLoginInfoAction: "getLoginInfo"
    }),

    handleSubmit(name) {
      this.loading = true;
      this.$refs[name].validate(valid => {
        if (valid) {
          this.getLoginInfoAction({
            LoginName: this.formInline.username,
            Password: btoa(this.formInline.password)
          }).finally(res => {
            if (res.success) {
              localforage.setItem("loginInfo", res.loginInfo, () => {
                this.$emit("on-success");
              });
            } else {
              this.$Message.error("请核对用户名、密码是否正确");
            }

            this.loading = false;
          });
        }
      });
    },

    handleKeyup(e) {
      if (e.keyCode === 13) this.handleSubmit("formInline");
    }
  },

  mounted() {
    document.addEventListener("keyup", this.handleKeyup);
  },

  beforeDestroy() {
    document.removeEventListener("keyup", this.handleKeyup);
  }
};
</script>
