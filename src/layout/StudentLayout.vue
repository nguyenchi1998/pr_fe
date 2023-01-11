<script>
import { RouterView } from 'vue-router';
import './../assets/dist/css/all.min.css';
import './../assets/plugins/fontawesome-free/css/all.min.css';
import './../assets/plugins/overlayScrollbars/css/OverlayScrollbars.min.css';
import './../assets/dist/css/adminlte.css';
import './../assets/dist/css/custom.css';
import NavBar from './Navbar.vue';
import * as authAPI from './../services/authAPI';
import { mapActions } from 'vuex';
import { MY_CREDIT_CLASS_PAGE } from '../routes';

export default {
  components: {
    RouterView,
    NavBar,
  },
  computed: {
    auth() {
      return this.$store.getters.selectAuth;
    },
    isCreditClassPage() {
      return this.$route.name === MY_CREDIT_CLASS_PAGE;
    },
  },
  created() {
    this.fetchAuth();
  },
  methods: {
    ...mapActions(['setAuth']),
    async fetchAuth() {
      this.setAuth(await authAPI.fetchAuthUser());
    },
  },
};
</script>
<template>
  <aside class="main-sidebar">
    <div>
      <div class="d-flex justify-content-center align-items-center">
        <img
          src="./../assets/dist/img/logo.png"
          width="100"
          height="100"
          alt=""
          class="rounded"
        />
        <div class="h4 text-capitalize mb-0">Đăng kí tín chỉ</div>
      </div>
      <ul class="pr-3">
        <template v-if="isCreditClassPage">
          <li>
            Mã sinh viên:
            <b>
              {{ auth?.code }}
            </b>
          </li>
          <li>
            Tên sinh viên:
            <b>
              {{ auth?.name }}
            </b>
          </li>
          <li>
            Lớp:
            <b v-if="auth?.general_class">
              {{ auth.general_class.name }}
            </b>
          </li>
          <li>
            Chuyên ngành:
            <b v-if="auth?.major">
              {{ auth.major.name }}
            </b>
          </li>
          <li>
            Ngành học:
            <b
              v-if="auth?.general_class && auth.general_class?.training_program"
            >
              {{ auth.general_class.training_program.name }}
            </b>
          </li>
          <li>
            Số tín chỉ tối thiểu:
            <b v-if="auth?.learning_alert">{{
              auth.learning_alert.min_register_credit
            }}</b>
          </li>
          <li>
            Số tín chỉ tối đa:
            <b v-if="auth?.learning_alert">
              {{ auth.learning_alert.max_register_credit }}
            </b>
          </li>
          <li>
            Cảnh báo học tập:
            <b v-if="auth?.learning_alert">
              {{ auth.learning_alert.name }}
            </b>
          </li>
          <li class="text-capitalize pt-3">
            <router-link to="/credit-class">Đăng ký tín chỉ </router-link>
          </li></template
        >
        <li v-else class="text-capitalize pt-3">
          <router-link to="/">Quay lại trang đăng ký sinh viên</router-link>
        </li>
      </ul>
    </div>
  </aside>
  <main>
    <div class="content-wrapper">
      <NavBar />

      <router-view></router-view>
    </div>
  </main>
</template>
