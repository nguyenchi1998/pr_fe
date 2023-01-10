<script>
import { RouterView } from "vue-router";
import "./../assets/dist/css/all.min.css";
import "./../assets/plugins/fontawesome-free/css/all.min.css";
import "./../assets/plugins/overlayScrollbars/css/OverlayScrollbars.min.css";
import "./../assets/dist/css/adminlte.css";
import NavBar from "./Navbar.vue";

export default {
  components: { RouterView, NavBar },
  computed: {
    auth() {
      return this.$store.getters.selectAuth;
    },
  },
};
</script>
<template>
  <aside class="main-sidebar">
    <div>
      <div class="d-flex justify-content-center align-items-center">
        <img
          src="{{ asset('dist/img/AdminLTELogo.png') }}"
          width="100px"
          height="100px"
          alt=""
          class="rounded"
        />
        <div class="h4 text-capitalize mb-0">Đăng kí tín chỉ</div>
      </div>
      <ul class="pr-3" >
        <li>
          Mã sinh viên: <b>{{ auth?.code }}</b>
        </li>
        <li>
          Tên sinh viên: <b>{{ auth?.name }}</b>
        </li>
        <li v-if="auth?.general_class">
          Lớp: <b>{{ auth.general_class.name }}</b>
        </li>
        <li v-if="auth?.major">
          Chuyên ngành: <b>{{ auth.major.name }}</b>
        </li>
        <li v-if="auth?.general_class">
          Ngành học:
          <b
            >{{ auth.general_class.training_program?.name ?? '' }}</b
          >
        </li>
        <li v-if="auth?.learning_alert">
          Số tín chỉ tối thiểu:
          <b
            >{{ auth.learning_alert.max_register_credit }}</b
          >
        </li>
        <li v-if="auth?.learning_alert">
          Số tín chỉ tối đa:
          <b
            >{{ auth.learning_alert.min_register_credit }}</b
          >
        </li>
        <li v-if="auth?.learning_alert"> 
          Cảnh báo học tập:
          <b>{{ auth.learning_alert.name }}</b>
        </li>
        <li class="text-capitalize pt-3">
          <a href="{{ route('credit-registers.index') }}">Đăng ký học phần</a>
        </li>
        <li class="text-capitalize pt-3">
          <a href="{{ route('credit-classes.index') }}"
            >Danh sách lớp tín chỉ</a
          >
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
