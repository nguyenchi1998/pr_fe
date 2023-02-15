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
    canRegisterClass() {
      return this.$store.getters.selectCanRegisterClass;
    },
    canRegisterSubject() {
      return this.$store.getters.selectCanRegisterSubject;
    },
  },
  created() {
    this.fetchAuth();
    this.fetchCanRegister();
  },
  methods: {
    ...mapActions(['setAuth', 'setCanRegister']),
    async fetchAuth() {
      const response = await authAPI.fetchAuthUser();
      if (response.success) {
        await this.setAuth(response.data);
      }
    },
    async fetchCanRegister() {
      const response = await creditAPI.fetchCheckCanRegister();
      if (response.success) {
        await this.setCanRegister(response.data);
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
            <b>
              {{ auth?.code }}
            </b>
          </li>
          <li>
            Tên SV:
            <b>
              {{ auth?.name }}
            </b>
          </li>
          <template v-if="auth?.general_class">
            <li>
              Lớp:
              <b>
                {{ auth.general_class.name }}
              </b>
            </li>
            <li>
              Hệ đào tạo:
              <b
                v-if="
                  auth.general_class?.education_training_program
                    ?.education_program
                "
              >
                {{
                  auth.general_class.education_training_program
                    .education_program.name
                }}
              </b>
            </li>
            <li>
              Ngành học:
              <b
                v-if="
                  auth.general_class?.education_training_program
                    ?.training_program
                "
              >
                {{
                  auth.general_class.education_training_program.training_program
                    .name
                }}
              </b>
            </li>
            <li>
              Niên khóa:
              <b>
                {{ `Khóa ${auth.general_class.school_year}` }}
              </b>
            </li>
          </template>
          <template v-if="auth?.learning_alert">
            <li>
              Đăng ký tối thiểu:
              <b>
                {{ `${auth.learning_alert.min_register_credit} TC` }}
              </b>
            </li>
            <li>
              Đăng ký tối đa:
              <b>
                {{ `${auth.learning_alert.max_register_credit} TC` }}
              </b>
            </li>
            <li v-if="auth.learning_alert.type">
              <div class="text-danger">
                Cảnh báo học tập:
                <b>
                  {{ auth.learning_alert.name }}
                </b>
              </div>
            </li>
          </template>
          <li v-if="canRegisterClass" class="text-capitalize pt-5">
            <router-link :to="PAGE_PATH.REGISTER_CREDIT_CLASS_PAGE">
              Danh sách lớp tín chỉ
            </router-link>
          </li>
          <li
            v-if="canRegisterSubject"
            class="text-capitalize"
            :class="!canRegisterClass ? 'pt-5' : 'pt-2'"
          >
            <router-link :to="PAGE_PATH.REGISTER_SUBJECT_PAGE">
              Danh sách học phần
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
