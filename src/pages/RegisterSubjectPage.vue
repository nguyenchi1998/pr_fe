<script>
import * as _ from 'lodash';
import { removeEmptyObjects } from '../utils/helper';
import {
  CREDIT_CLASS_STATUS,
  CREDIT_CLASS_TYPE,
  MY_CREDIT_CLASS_PAGE,
  WEEKDAYS,
  SUBJECT_RELATIONS,
} from '../config/constants.js';
import Paginate from 'vuejs-paginate-next';
import Swal from 'sweetalert2';
import creditAPI from '../services/creditAPI';

export default {
  components: {
    Paginate,
  },
  data() {
    return {
      isLoadingData: false,
      perPage: 10,
      page: 1,
      filter: {
        code: 'PE2026',
        name: '',
        time: '',
        credit: '',
        force: '',
        condition: '',
      },
      subjects: [],
      CREDIT_CLASS_STATUS: CREDIT_CLASS_STATUS,
      CREDIT_CLASS_TYPE: CREDIT_CLASS_TYPE,
      WEEKDAYS: WEEKDAYS,
    };
  },
  created() {
    this.fetchSubjects();
  },
  computed: {
    querySearch() {
      return removeEmptyObjects(this.filter);
    },
    hasQuerySearch() {
      return !_.isEmpty(this.querySearch);
    },
    paginateSubjects() {
      return this.subjects.slice(
        (this.page - 1) * this.perPage,
        this.page * this.perPage,
      );
    },
    totalPage() {
      return Math.ceil(this.subjects.length / this.perPage) ?? 0;
    },
    canRegisterClass() {
      return this.$store.getters.selectCanRegisterClass;
    },
    subjectRelations() {
      return SUBJECT_RELATIONS.map(({ label, value }) => ({ label, value }));
    },
  },
  watch: {
    filter(newData, _oldData) {
      this.fetchSubjects(newData);
    },
  },
  methods: {
    fetchSubjects: async function () {
      this.isLoadingData = true;
      const response = await creditAPI.fetchSubjects(this.querySearch);
      console.log(response);
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
        this.subjects = response.data;
      }
      this.isLoadingData = false;
    },
    search: _.debounce(function ({ target: { value, name } }) {
      this.filter = { ...this.filter, [name]: value };
    }, 500),
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
              <h4 class="text-capitalize">
                Danh sách học phần dành cho đăng ký học tập
              </h4>
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
                      <th>Mã học phần</th>
                      <th>Tên học phần</th>
                      <th>Thời lượng</th>
                      <th>Số tín chỉ</th>
                      <th>Bắt buộc</th>
                      <th>Điều kiện</th>
                      <th>Đăng ký</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="align-middle">
                      <td class="p-0" v-for="(value, key) in filter">
                        <div class="input-group">
                          <div class="input-group-prepend border-0">
                            <span
                              class="input-group-text rounded-0 border-0 px-1"
                            >
                              <i class="fa fa-filter"></i>
                            </span>
                          </div>
                          <input
                            class="form-control filter border-0"
                            type="text"
                            placeholder="Nhập từ khóa"
                            :name="key"
                            :value="value"
                            @keyup="search"
                          />
                        </div>
                      </td>
                      <td></td>
                    </tr>
                    <template v-if="!subjects.length">
                      <tr class="align-middle">
                        <td
                          class="text-center no-data-text"
                          v-if="hasQuerySearch"
                          colspan="8"
                        >
                          Không tìm thấy học phần phù hợp
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
                        name,
                        time1,
                        time2,
                        time3,
                        time4,
                        group_by_relation_subjects,
                        credit,
                      } in paginateSubjects"
                    >
                      <tr class="align-middle">
                        <td>
                          {{ code }}
                        </td>
                        <td>
                          {{ name }}
                        </td>
                        <td>
                          {{ `${time1} - ${time2} - ${time3} - ${time4}` }}
                        </td>
                        <td>
                          {{ credit }}
                        </td>
                        <td>Có</td>
                        <td>
                          <div
                            v-for="(
                              subjects, index
                            ) in group_by_relation_subjects"
                          >
                            {{
                              `${subjectRelations[index].label}: ${subjects
                                .map(({ parent_subject: { code } }) => code)
                                .join(', ')}`
                            }}
                          </div>
                        </td>
                        <td class="text-center">
                          <input
                            type="checkbox"
                            name=""
                            id=""
                            class="checkbox-custom"
                          />
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
              :page-range="5"
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
<style>
.loading-opacity {
  opacity: 0.5;
}
.loading {
  opacity: 1;
}
.page-item:not(.disabled, .active) {
  cursor: pointer;
}
</style>
