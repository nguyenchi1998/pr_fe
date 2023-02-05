<script>
import * as _ from 'lodash';
import { removeEmptyObjects } from '../utils/helper';
import {
  CREDIT_CLASS_STATUS,
  CREDIT_CLASS_TYPE,
  MY_CREDIT_CLASS_PAGE,
  SUBJECT_RELATIONS,
  WEEKDAYS,
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
        code: '',
        name: '',
        time: '',
        credit: '',
        condition: '',
      },
      subjects: [],
      subjectCodes: [],
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
      const response = await creditAPI.fetchCreditSubjects(this.querySearch);
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
    triggerCheck({ target: { checked } }, code) {
      if (checked) {
        this.subjectCodes = [...this.subjectCodes, code];
      } else {
        this.subjectCodes = this.subjectCodes.filter((item) => item !== code);
      }
    },
    clearFilter() {
      for (const key in this.filter) this.filter[key] = '';
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
                Danh sách học phần dành cho đăng ký học tập
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
                      <th>Mã học phần</th>
                      <th>Tên học phần</th>
                      <th>Thời lượng</th>
                      <th>TC</th>
                      <th>Điều kiện</th>
                      <th>Đăng ký</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="align-middle">
                      <td class="p-0" v-for="(value, key) in filter">
                        <div class="input-group">
                          <input
                            class="form-control filter border-0"
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
                      <td class="p-0">
                        <button
                          class="btn btn-sm clear-filter"
                          @click="clearFilter"
                        >
                          Xóa lọc
                        </button>
                      </td>
                    </tr>
                    <template v-if="!subjects.length">
                      <tr class="align-middle">
                        <td class="text-center no-data-text" colspan="6">
                          <span v-if="hasQuerySearch">
                            Không tìm thấy học phần phù hợp
                          </span>
                          <span v-else>Nhập từ khóa để tìm kiếm</span>
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
                        <td>
                          <div
                            v-for="(
                              subjects, index
                            ) in group_by_relation_subjects"
                          >
                            {{
                              `${subjectRelations[index].label}: ${subjects
                                .map(
                                  ({ parent_subject }) => parent_subject.code,
                                )
                                .join(', ')}`
                            }}
                          </div>
                        </td>
                        <td class="text-center">
                          <input
                            type="checkbox"
                            :checked="subjectCodes.includes(code)"
                            @change="triggerCheck($event, code)"
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
<style scoped>
.clear-filter {
  font-size: 15px;
}
</style>
