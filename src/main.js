import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.css';
import { createStore } from 'vuex';
import 'mosha-vue-toastify/dist/style.css';

import 'sweetalert2/src/sweetalert2.scss';
import RegisterClassPage from './pages/RegisterClassPage.vue';
import LoginPage from './pages/LoginPage.vue';
import MyCreditClassPage from './pages/MyCreditClassPage.vue';
import NotFoundPage from './pages/Error/404.vue';
import InternalServerErrorPage from './pages/Error/500.vue';
import StudentLayout from './layout/StudentLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { isAuthenticated } from './services/authAPI';
import 'bootstrap/dist/js/bootstrap.js';
import {
  MY_CREDIT_CLASS_PAGE,
  REGISTER_CREDIT_CLASS_PAGE,
  LOGIN_PAGE,
  STUDY_PROGRAM_PAGE,
  INTERNAL_SERVER_ERROR_PAGE,
  NOT_FOUND_PAGE
} from './config/constants';
import Paginate from 'vuejs-paginate-next';
import MyStudyProgramPage from './pages/MyStudyProgramPage.vue';

export const PAGE_PATH = {
  [REGISTER_CREDIT_CLASS_PAGE]: '/credit-class',
  [LOGIN_PAGE]: '/login',
  [MY_CREDIT_CLASS_PAGE]: '/',
  [STUDY_PROGRAM_PAGE]: '/study-program',
  [INTERNAL_SERVER_ERROR_PAGE]: '/500',
  [NOT_FOUND_PAGE]: '/404',
};
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: StudentLayout,
      meta: {
        requiredAuth: true,
      },
      children: [
        {
          path: PAGE_PATH.REGISTER_CREDIT_CLASS_PAGE,
          component: RegisterClassPage,
          name: REGISTER_CREDIT_CLASS_PAGE,
        },
        {
          path: PAGE_PATH.MY_CREDIT_CLASS_PAGE,
          component: MyCreditClassPage,
          name: MY_CREDIT_CLASS_PAGE,
        },
        {
          path: PAGE_PATH.STUDY_PROGRAM_PAGE,
          component: MyStudyProgramPage,
          name: STUDY_PROGRAM_PAGE,
        },
      ],
    },
    {
      path: PAGE_PATH.LOGIN_PAGE,
      component: LoginPage,
      name: LOGIN_PAGE,
    },
    {
      path: PAGE_PATH.NOT_FOUND_PAGE,
      component: NotFoundPage,
      name: NOT_FOUND_PAGE,
    }, {
      path: PAGE_PATH.INTERNAL_SERVER_ERROR_PAGE,
      component: InternalServerErrorPage,
      name: INTERNAL_SERVER_ERROR_PAGE,
    },
    {
      path: '/:pathMatch(.*)*',
      component: NotFoundPage,
    },
  ],
});
router.beforeEach(({ matched, path }, _from, next) => {
  if (matched.some((record) => record.meta.requiredAuth))
    if (!isAuthenticated())
      next({
        name: LOGIN_PAGE,
        query: {
          returnUrl: path,
        },
      });
    else next();
  else next();
});
const store = createStore({
  state() {
    return {
      auth: null,
      can_register: {
        subject: false,
        class: false,
      },
      current_semester: null,
    };
  },
  mutations: {
    setAuth(state, payload) {
      state.auth = payload;
    },
    setCurrentSemester(state, payload) {
      state.current_semester = payload;
    },
  },
  actions: {
    setAuth(context, payload) {
      context.commit('setAuth', payload);
    },
    setCurrentSemester(context, payload) {
      context.commit('setCurrentSemester', payload);
    },
  },
  getters: {
    selectAuth(state) {
      return state.auth;
    },
    selectCurrentSemester(state) {
      return state.current_semester;
    },
  },
});

const app = createApp(App);
app.use(router);
app.use(store);
app.use(Paginate);
app.mount('#app');
