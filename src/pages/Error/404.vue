<script>
import { RouterView } from 'vue-router';

export default {
  components: {
    RouterView,
  },
};
</script>

<template>
  <div class="d-flex align-items-center justify-content-center vh-100">
    <div class="text-center">
      <h1 class="display-1 fw-bold">404</h1>
      <p class="fs-3"><span class="text-danger">Opps!</span> Page not found.</p>
      <p class="lead">Trang bạn truy cập không tồn tại.</p>
      <router-link to="/" class="medium-text">Quay lại trang chủ</router-link>
    </div>
  </div>
</template>
<style scoped>
.medium-text {
  font-size: 18px;
}
</style>
