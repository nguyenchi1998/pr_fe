<script>
import { signIn } from './../services/authAPI';
import { setAuthToken } from './../utils/storage';
export default {
  data() {
    return {
      credential: {
        email: 'Chi.NN1@sis.hust.edu.vn',
        password: 'password',
      },
      isLoading: false,
    };
  },
  methods: {
    submitAuth() {
      this.isLoading = true;
      signIn(this.credential)
        .then(({ data }) => {
          setAuthToken(data);
          this.$router.push({ path: '/', replace: true });
        })
        .catch(() => {})
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
};
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-md-4 offset-md-4">
        <h2 class="text-center text-dark mt-5">Trang Đăng Nhập</h2>
        <div class="card my-1">
          <div class="card-body cardbody-color p-lg-4">
            <div class="text-center">
              <img
                src="https://cdn.pixabay.com/photo/2016/03/31/19/56/avatar-1295397__340.png"
                class="img-fluid profile-image-pic img-thumbnail rounded-circle my-3"
                width="150"
                alt="profile"
              />
            </div>
            <div class="mb-3">
              <input
                type="text"
                class="form-control"
                id="Username"
                aria-describedby="emailHelp"
                :value="credential.email"
                placeholder="User Name"
              />
            </div>
            <div class="mb-3">
              <input
                type="password"
                class="form-control"
                id="password"
                placeholder="password"
                :value="credential.password"
              />
            </div>
            <div class="text-center">
              <button
                type="submit"
                class="btn btn-primary px-5 mb-1 w-100"
                @click="submitAuth"
              >
                Login
              </button>
            </div>
            <div id="emailHelp" class="form-text text-center mb-1 text-dark">
              <a href="#" class="text-dark fw-bold">Forget password?</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
