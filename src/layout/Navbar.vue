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
          <li class="nav-item dropdown">
            <a class="nav-link" data-toggle="dropdown" href="#">
              <i class="far fa-comments"></i>
              <span class="badge badge-danger navbar-badge">3</span>
            </a>
            <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
              <a href="#" class="dropdown-item">
                <div class="media">
                  <img
                    src="#"
                    alt="User Avatar"
                    class="img-size-50 img-circle mr-3"
                  />
                  <div class="media-body">
                    <h3 class="dropdown-item-title">
                      Brad Diesel
                      <span class="text-danger float-right text-sm"
                        ><i class="fas fa-star"></i
                      ></span>
                    </h3>
                    <p class="text-sm">Call me whenever you can...</p>
                    <p class="text-muted text-sm">
                      <i class="far fa-clock mr-1"></i> 4 Hours Ago
                    </p>
                  </div>
                </div>
              </a>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item">
                <div class="media">
                  <img
                    src="#"
                    alt="User Avatar"
                    class="img-size-50 img-circle mr-3"
                  />
                  <div class="media-body">
                    <h3 class="dropdown-item-title">
                      John Pierce
                      <span class="text-muted float-right text-sm"
                        ><i class="fas fa-star"></i
                      ></span>
                    </h3>
                    <p class="text-sm">I got your message bro</p>
                    <p class="text-muted text-sm">
                      <i class="far fa-clock mr-1"></i> 4 Hours Ago
                    </p>
                  </div>
                </div>
              </a>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item">
                <div class="media">
                  <img
                    src="#"
                    alt="User Avatar"
                    class="img-size-50 img-circle mr-3"
                  />
                  <div class="media-body">
                    <h3 class="dropdown-item-title">
                      Nora Silvester
                      <span class="text-warning float-right text-sm"
                        ><i class="fas fa-star"></i
                      ></span>
                    </h3>
                    <p class="text-sm">The subject goes here</p>
                    <p class="text-muted text-sm">
                      <i class="far fa-clock mr-1"></i> 4 Hours Ago
                    </p>
                  </div>
                </div>
              </a>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item dropdown-footer"
                >See All Messages</a
              >
            </div>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link" data-toggle="dropdown" href="#">
              <i class="far fa-bell"></i>
              <span class="badge badge-warning navbar-badge">15</span>
            </a>
            <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
              <span class="dropdown-item dropdown-header">
                15 Notifications
              </span>
              <div class="dropdown-divider"></div>
              <a href="#" class="dropdown-item">
                <i class="fas fa-envelope mr-2"></i> 4 new messages
                <span class="text-muted float-right text-sm">3 mins</span>
              </a>
            </div>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" id="reset-data">
              <i class="fa fa-refresh" aria-hidden="true"></i>
            </a>
          </li>
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
