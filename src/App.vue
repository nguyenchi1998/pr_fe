<script>
import HelloWorld from "./components/HelloWorld.vue";
import { RouterView } from "vue-router";
import { mapActions } from "vuex";
import * as authAPI from "./services/authAPI";

export default {
  components: {
    RouterView,
  },
  created() {
    this.fetchAuth();
  },
  methods: {
    ...mapActions(["setAuth"]),
    async fetchAuth() {
      this.setAuth(await authAPI.fetchAuthUser());
    },
  },
};
</script>

<template>
  <router-view></router-view>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
