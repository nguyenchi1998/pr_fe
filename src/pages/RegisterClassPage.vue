<script>
import creditAPI from '../services/creditAPI';
import * as _ from 'lodash';
import { removeEmptyObjects } from '../utils/helper';
import {
  CREDIT_CLASS_STATUS,
  MY_CREDIT_CLASS_PAGE,
  WEEKDAYS,
} from '../config/constants.js';
import Paginate from 'vuejs-paginate-next';
import Swal from 'sweetalert2';

export default {
  components: {
    Paginate,
  },
  data() {
    return {
      isLoadingData: false,
      perPage: 3,
      page: 1,
      filter: {
        class_code: '',
        subject_code: '',
        subject_name: '',
        note: '',
        max_register: '',
        registered_student: '',
      },
      creditClasses: [],
      CREDIT_CLASS_STATUS: CREDIT_CLASS_STATUS,
      WEEKDAYS: WEEKDAYS,
    };
  },
  created() {
    this.fetchCreditClasses();
  },
  computed: {
    querySearch() {
      return removeEmptyObjects(this.filter);
    },
    hasQuerySearch() {
      return !_.isEmpty(this.querySearch);
    },
    creditClassPaginate() {
      return this.creditClasses.slice(
        (this.page - 1) * this.perPage,
        this.page * this.perPage,
      );
    },
    totalPage() {
      return Math.ceil(this.creditClasses.length / this.perPage) ?? 0;
    },
  },
  watch: {
    filter(newData, _oldData) {
      this.fetchCreditClasses(newData);
    },
  },
  methods: {
    fetchCreditClasses: async function () {
      this.isLoadingData = true;
      const response = await creditAPI.fetchCreditClasses(this.querySearch);
      if (!response.success) {
        Swal.fire({
          text: 'Quay lại Trang Đăng Ký Sinh Viên',
          title: response.message,
          icon: 'error',
          confirmButtonText: 'OK',
        }).then(({ isConfirmed }) => {
          if (isConfirmed) {
            this.$router.replace({ name: MY_CREDIT_CLASS_PAGE });
          }
        });
      } else {
        this.creditClasses = response.data;
      }
      this.isLoadingData = false;
    },
    search: _.debounce(function ({ target: { value, name } }) {
      this.filter = { ...this.filter, [name]: value };
    }, 800),
    changePage(page) {
      this.page = page;
    },
  },
};
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="card card-main">
          <div class="card-header">
            <div class="d-flex justify-content-between">
              <h5 class="text-capitalize">
                Danh sách lớp dành cho đăng ký học tập
              </h5>
            </div>
          </div>
          <div
            class="card-body overflow-auto"
            :class="isLoadingData ? 'loading-opacity' : ''"
          >
            <div style="position: relative">
              <div v-if="isLoadingData" class="wrapper-loading loading">
                <img src="./../assets/loading.gif" alt="" />
              </div>
              <div
                class="table-responsive"
                :class="isLoadingData ? 'opacity-50' : ''"
              >
                <table class="table-bordered table">
                  <thead>
                    <tr class="align-middle">
                      <td>Mã lớp</td>
                      <td>Mã học phần</td>
                      <td>Tên học phần</td>
                      <td>Ghi chú</td>
                      <td>Đăng ký tối đa</td>
                      <td>Đã đăng ký</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="align-middle">
                      <td
                        class="p-0"
                        v-for="(value, key) in filter"
                        v-bind:key="key"
                      >
                        <div class="input-group">
                          <input
                            class="form-control border-0"
                            type="text"
                            :name="key"
                            :value="value"
                            @keyup="search"
                          />
                          <div class="input-group-prepend border-0">
                            <span
                              class="input-group-text rounded-0 border-0 px-1"
                            >
                              <i class="fa fa-filter"></i>
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <template v-if="!creditClasses.length">
                      <tr class="align-middle">
                        <td
                          class="text-center no-data-text"
                          v-if="hasQuerySearch"
                          colspan="8"
                        >
                          Không tìm thấy lớp tín chỉ phù hợp
                        </td>
                        <td class="text-center no-data-text" v-else colspan="8">
                          Nhập từ khóa để tìm kiếm
                        </td>
                      </tr>
                    </template>
                    <template
                      v-else
                      v-for="{
                        code,
                        subject,
                        note,
                        max_register,
                        students,
                        study_room,
                        schedules,
                      } in creditClassPaginate"
                      v-bind:key="code"
                    >
                      <tr class="table-secondary align-middle">
                        <th>
                          {{ code }}
                        </th>
                        <th>
                          {{ subject.code }}
                        </th>
                        <th>
                          {{ subject.name }}
                        </th>
                        <th>
                          {{ note }}
                        </th>
                        <th>
                          {{ max_register }}
                        </th>
                        <th>
                          {{ students.length }}
                        </th>
                      </tr>
                      <tr>
                        <td colspan="9" class="p-0">
                          <div class="px-3 py-2">
                            <div>
                              Tên lớp: <b>{{ subject.name }}</b>
                            </div>
                            <div>
                              Viện quản lý:
                              <b v-if="subject && subject?.department?.academy">
                                {{ subject.department.academy.name }}
                              </b>
                            </div>
                          </div>
                          <div>
                            <table class="table-sm mb-0 table">
                              <tbody>
                                <tr>
                                  <td>Buổi học</td>
                                  <td>Thời gian</td>
                                  <td>Phòng học</td>
                                </tr>
                                <tr
                                  v-for="(
                                    { weekday, time }, index
                                  ) in schedules"
                                  :key="index"
                                >
                                  <td>
                                    <div v-if="weekday">
                                      {{
                                        WEEKDAYS.find(
                                          ({ value }) => value == weekday,
                                        )?.label
                                      }}
                                    </div>
                                  </td>
                                  <td>
                                    <div v-if="time">
                                      {{ time == 1 ? 'Sáng' : 'Chiều' }}
                                    </div>
                                  </td>
                                  <td>
                                    <div v-if="study_room">
                                      {{ study_room.name ?? '' }}
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div
            v-if="totalPage > 1"
            class="card-footer"
            :class="isLoadingData ? 'loading-opacity' : ''"
          >
            <paginate
              :page-count="totalPage"
              :clickHandler="changePage"
              :prev-text="'Prev'"
              :next-text="'Next'"
              :page-class="'page-item'"
            >
            </paginate>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
