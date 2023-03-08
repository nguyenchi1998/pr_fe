<script>
import { RouterView } from 'vue-router';
import './../assets/css/all.min.css';
import './../assets/plugins/fontawesome-free/css/all.min.css';
import './../assets/css/adminlte.css';
import './../assets/css/custom.css';
import NavBar from './Navbar.vue';
import * as authAPI from './../services/authAPI';
import { mapActions } from 'vuex';
import { REGISTER_CREDIT_CLASS_PAGE } from './../config/constants';
import { PAGE_PATH } from './../main';
import creditAPI from '../services/creditAPI';

export default {
  data() {
    return {
      PAGE_PATH: PAGE_PATH,
    };
  },
  components: {
    RouterView,
    NavBar,
  },
  computed: {
    auth() {
      return this.$store.getters.selectAuth;
    },
    isNotCreditClassPage() {
      return this.$route.name !== REGISTER_CREDIT_CLASS_PAGE;
    },
    currentSemester() {
      return this.$store.getters.selectCurrentSemester;
    },
  },
  created() {
    this.fetchAuth();
  },
  methods: {
    ...mapActions(['setAuth', 'setCurrentSemester']),
    async fetchAuth() {
      const response = await authAPI.fetchAuthUser();
      if (response.success) {
        await this.setAuth(response.data.auth);
        await this.setCurrentSemester(response.data.current_semester);
      }
    },
  },
};
</script>
<template>
  <aside class="main-sidebar">
    <div>
      <div class="py-3">
        <h4 class="text-center text-capitalize mb-0">Đăng kí tín chỉ</h4>
      </div>
      <div class="ml-2 h5" v-if="isNotCreditClassPage">Thông tin sinh viên</div>
      <ul class="pr-4">
        <template v-if="isNotCreditClassPage">
          <li>
            Mã SV:
            <b v-if="auth?.code">
              {{ auth.code }}
            </b>
          </li>
          <li>
            Tên SV:
            <b v-if="auth?.name">
              {{ auth.name }}
            </b>
          </li>
          <li>
            Ngành học:
            <b v-if="auth?.training_program">
              {{ auth?.training_program.name }}
            </b>
          </li>
          <li v-if="currentSemester">
            Học kỳ hiện tại:
            <b>
              {{ currentSemester }}
            </b>
          </li>
          <li class="text-capitalize pt-5">
            <router-link :to="PAGE_PATH.REGISTER_CREDIT_CLASS_PAGE">
              Đăng ký tín chỉ
            </router-link>
          </li>
        </template>
        <li v-else class="text-capitalize pt-5">
          <router-link :to="PAGE_PATH.MY_CREDIT_CLASS_PAGE">
            Quay lại trang đăng ký
          </router-link>
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

<style scoped>
li {
  font-size: 1.05rem;
  padding-top: 5px;
}

li > a {
  text-decoration: underline;
  font-size: 1.1rem;
}

.logo {
  width: 80px;
}
</style>
