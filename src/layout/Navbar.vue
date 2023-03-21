<script>
import { PAGE_PATH } from './../main';
import { signOut } from '../services/authAPI';

export default {
  data() {
    return {
      PAGE_PATH: PAGE_PATH,
    };
  },
  methods: {
    logout: function () {
      if (confirm('Logout?')) signOut();
    },
  },
};
</script>

<template>
  <div class="container-fluid">
    <div class="card">
      <nav class="navbar navbar-expand">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link :to="PAGE_PATH.MY_CREDIT_CLASS_PAGE" class="nav-link">
              Trang chủ
            </router-link>
          </li>
          <li class="nav-item">
            <router-link :to="PAGE_PATH.STUDY_PROGRAM_PAGE" class="nav-link">
              Chương trình đào tạo
            </router-link>
          </li>
        </ul>
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <a class="nav-link" href="#" @click="logout">
              <i class="fa fa-right-to-bracket"></i>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>
