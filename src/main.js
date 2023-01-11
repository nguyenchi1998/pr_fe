import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.css';
import { createStore } from 'vuex';
import router from './routes'; import Paginate from 'vuejs-paginate'


const store = createStore({
  state() {
    return {
      auth: null,
    };
  },
  mutations: {
    setAuth(state, payload) {
      state.auth = payload;
    },
  },
  actions: {
    setAuth(context, payload) {
      context.commit('setAuth', payload);
    },
  },
  getters: {
    selectAuth(state) {
      return state.auth;
    },
  },
});

const app = createApp(App);

app.use(router);
app.use(store);
app.component('paginate', Paginate)

app.mount('#app');

import 'bootstrap/dist/js/bootstrap.js';
