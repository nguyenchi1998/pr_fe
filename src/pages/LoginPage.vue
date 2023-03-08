<script>
import { PAGE_PATH } from './../main';
import { signIn } from './../services/authAPI';
import { setAuthToken } from './../utils/storage';

export default {
  data() {
    return {
      credential: {
        email: 'Chi.NN1@sis.hust.edu.vn',
        password: '123456',
      },
      isLoading: false,
      errorMessage: '',
    };
  },
  methods: {
    async submitAuth() {
      this.isLoading = true;
      const {
        data: { data, success, message },
      } = await signIn(this.credential);
      console.log(success);
      if (success) {
        setAuthToken(data);
        const { returnUrl } = this.$route.query;
        this.$router.replace({
          path: returnUrl ?? PAGE_PATH.MY_CREDIT_CLASS_PAGE,
        });
      } else this.errorMessage = message;
      this.isLoading = false;
    },
    changeCredential({ target: { value, name }, keyCode }) {
      if (keyCode === 13) {
        this.submitAuth();
      } else
        this.credential = {
          ...this.credential,
          [name]: value,
        };
    },
  },
};
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-md-5 offset-md-3">
        <h2 class="text-center text-dark mt-5">Trang Đăng Nhập</h2>
        <div class="text-center mb-5 text-dark">
          Made by <b>Chi.NN@sis.hust.edu.vn</b>
        </div>
        <div class="card my-3">
          <div class="card-body p-lg-5">
            <div class="text-center mb-2">
              <img
                src="./../assets/logo.png"
                class="img-fluid profile-image-pic img-thumbnail rounded-circle my-3"
                alt="profile"
              />
            </div>

            <div class="mb-3">
              <input
                type="text"
                class="form-control"
                id="Email"
                name="email"
                :class="errorMessage !== '' ? ' border-danger' : ''"
                aria-describedby="emailHelp"
                :value="credential.email"
                placeholder="User Name"
                @keyup="changeCredential"
              />
            </div>
            <div class="mb-2">
              <input
                type="password"
                class="form-control"
                id="password"
                name="password"
                placeholder="Mật khẩu"
                :value="credential.password"
                @change="changeCredential"
              />
            </div>
            <div class="text-center text-danger error-message mb-2">
              {{ errorMessage }}
            </div>
            <div class="text-center">
              <button
                type="submit"
                class="btn btn-warning px-5 mb-1 w-100 btn-color"
                @click="submitAuth"
              >
                <template v-if="isLoading">
                  <span
                    class="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  <span class="sr-only">Loading...</span>
                </template>
                <span v-else>Đăng nhập</span>
              </button>
            </div>
            <div id="emailHelp" class="form-text text-center mb-1 text-dark">
              <a href="#" class="text-dark fw-bold">Quên mật khẩu?</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.btn-color {
  background-color: #0c2044;
  color: #fff;
  border-color: #0c2044;
}

.profile-image-pic {
  height: 150px;
  width: 150px;
  object-fit: cover;
}

.error-message {
  min-height: 25px;
}
</style>
