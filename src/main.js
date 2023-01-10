import { createApp } from 'vue'
import App from './App.vue'
import "bootstrap/dist/css/bootstrap.css";
import RegisterClass from './pages/RegisterClass.vue'
import LoginPage from './pages/LoginPage.vue'
import StudentLayout from './layout/StudentLayout.vue'


import { createRouter, createWebHistory } from 'vue-router'


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
                    path: '/',
                    component: RegisterClass,
                    name: 'register-class',
                }
            ]
        }, {
            path: '/login',
            component: LoginPage,
            name: 'login'
        },
    ],
})

router.beforeEach((to, from, next) => {

    if (to.matched.some((record) => record.meta.requiredAuth) && !isAuthenticated())
        next({ name: 'login' })
    else next()
})

const store = createStore({
    state() {
        return {
            auth: null
        }
    },
    mutations: {
        setAuth(state, payload) {
            state.auth = payload
        }
    },
    actions: {
        setAuth(context, payload) {
            context.commit('setAuth', payload)
        },
    },
    getters: {
        selectAuth(state) { return state.auth }
    }
})


const app = createApp(App);

app.use(router);
app.use(store)

app.mount('#app')

import "bootstrap/dist/js/bootstrap.js";
import { createStore } from 'vuex'; import { isAuthenticated } from './services/authAPI';

