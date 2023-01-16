import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.css';
import { createStore } from 'vuex';
import 'mosha-vue-toastify/dist/style.css';
import 'sweetalert2/src/sweetalert2.scss';
import RegisterClassPage from './pages/RegisterClassPage.vue';
import RegisterSubjectPage from './pages/RegisterSubjectPage.vue';
import LoginPage from './pages/LoginPage.vue';
import MyCreditClassPage from './pages/MyCreditClassPage.vue';
import NotFoundPage from './pages/NotFoundPage.vue';
import StudentLayout from './layout/StudentLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { isAuthenticated } from './services/authAPI';
import 'bootstrap/dist/js/bootstrap.js';
import {
  MY_CREDIT_CLASS_PAGE,
  REGISTER_CREDIT_CLASS_PAGE,
  LOGIN_PAGE,
  REGISTER_SUBJECT_PAGE
} from './config/constants';
import Paginate from 'vuejs-paginate-next';

export const PAGE_PATH = {
  [REGISTER_CREDIT_CLASS_PAGE]: '/credit-class',
  [LOGIN_PAGE]: '/login',
  [MY_CREDIT_CLASS_PAGE]: '/',
  [REGISTER_SUBJECT_PAGE]: '/subject'
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
      children: [{
        path: PAGE_PATH.REGISTER_CREDIT_CLASS_PAGE,
        component: RegisterClassPage,
        name: REGISTER_CREDIT_CLASS_PAGE,
      }, {
        path: PAGE_PATH.REGISTER_SUBJECT_PAGE,
        component: RegisterSubjectPage,
        name: REGISTER_SUBJECT_PAGE,
      }, {
        path: PAGE_PATH.MY_CREDIT_CLASS_PAGE,
        component: MyCreditClassPage,
        name: MY_CREDIT_CLASS_PAGE,
      },
      ],
    }, {
      path: PAGE_PATH.LOGIN_PAGE,
      component: LoginPage,
      name: LOGIN_PAGE,
    }, {
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
        class: false
      }
    };
  },
  mutations: {
    setAuth(state, payload) {
      state.auth = payload;
    },
    setCanRegister(state, payload) {
      state.can_register = {
        ...state.can_register,
        ...payload
      }
    },
  },
  actions: {
    setAuth(context, payload) {
      context.commit('setAuth', payload);
    },
    setCanRegister(context, payload) {
      context.commit('setCanRegister', payload);
    },

  },
  getters: {
    selectAuth(state) {
      return state.auth;
    },
    selectCanRegisterSubject(state) {
      return state.can_register.subject;
    },
    selectCanRegisterClass(state) {
      return state.can_register.class;
    },
  },
});

const app = createApp(App);
app.use(router);
app.use(store);
app.use(Paginate);
app.mount('#app');
