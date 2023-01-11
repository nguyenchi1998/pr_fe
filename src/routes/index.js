import RegisterClass from './../pages/RegisterClass.vue';
import LoginPage from './../pages/LoginPage.vue';
import MyCreditClass from './../pages/MyCreditClass.vue';
import NotFoundPage from './../pages/NotFoundPage.vue';
import StudentLayout from './../layout/StudentLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { isAuthenticated } from './../services/authAPI';

export const REGISTER_CREDIT_CLASS_PAGE = 'REGISTER_CREDIT_CLASS_PAGE';
export const MY_CREDIT_CLASS_PAGE = 'MY_CREDIT_CLASS_PAGE';

export const PAGE_PATH = {
  [REGISTER_CREDIT_CLASS_PAGE]: 'credit-class',
  [MY_CREDIT_CLASS_PAGE]: '',
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
          component: RegisterClass,
          name: REGISTER_CREDIT_CLASS_PAGE,
        },
        {
          path: PAGE_PATH.MY_CREDIT_CLASS_PAGE,
          component: MyCreditClass,
          name: MY_CREDIT_CLASS_PAGE,
        },
      ],
    },
    {
      path: '/login',
      component: LoginPage,
      name: 'login',
    },
    {
      path: '/:pathMatch(.*)*',
      component: NotFoundPage,
    },
  ],
});

router.beforeEach(({ matched, path }, _from, next) => {
  if (
    matched.some((record) => record.meta.requiredAuth) &&
    !isAuthenticated()
  ) {
    next({
      name: 'login',
      query: {
        returnUrl: path,
      },
    });
  } else next();
});

export default router;
