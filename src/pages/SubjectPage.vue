<script>
import subjectAPI from '../services/subjectAPI';
import { removeEmptyObjects } from '../utils/helper';
import Paginate from 'vuejs-paginate-next';
import Swal from 'sweetalert2';

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
        semester: '',
        force: '',
        credit: '',
        study_credit: '',
        study_code: '',
        type: '',
        note: '',
        number_mark: '',
        text_mark: '',
        academy: '',
      },
      subjects: [],
    };
  },
  computed: {
    auth() {
      return this.$store.getters.selectAuth;
    },
    querySearch() {
      return removeEmptyObjects(this.filter);
    },
    subjectPaginate() {
      return this.subjects.slice(
        (this.page - 1) * this.perPage,
        this.page * this.perPage,
      );
    },
    totalPage() {
      return Math.ceil(this.subjects.length / this.perPage) ?? 0;
    },
  },
  created() {
    this.fetchSubjects();
  },
  beforeRouteLeave(_to, _from, next) {
    if (this.progress) {
      if (confirm('Dữ liệu chưa được gửi!. Vẫn xác nhận rời trang?')) {
        next();
      }
    } else {
      next();
    }
  },
  methods: {
    fetchSubjects: function () {
      this.isLoadingData = true;
      subjectAPI
        .fetchSubjects(this.querySearch)
        .then(({ data }) => {
          this.isLoadingData = false;
          this.subjects = data;
        })
        .catch(({ message }) => {
          this.isLoadingData = false;
          Swal.fire({
            title: message,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        });
    },
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
              <h5 class="text-capitalize flex-grow-1">
                Chương trình đào tạo ngành
                {{ auth?.general_class?.training_program?.name }}
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
                <table class="table table-bordered">
                  <thead>
                    <tr class="table-bordered align-middle">
                      <th>Mã HP</th>
                      <th>Tên HP</th>
                      <th>Kỳ học</th>
                      <th>Bắt buộc</th>
                      <th>TC ĐT</th>
                      <th>TC học</th>
                      <th>Mã HP học</th>
                      <th>Loại HP</th>
                      <th>Ghi chú loại HP</th>
                      <th>Điểm chữ</th>
                      <th>Điểm số</th>
                      <th>Viện/Khoa</th>
                    </tr>
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
                    </tr>
                  </thead>
                  <tbody class="table-bordered">
                    <template v-if="subjects.length">
                      <template
                        v-for="{
                          code,
                          name,
                          credit,
                          academy,
                          register_study_semester,
                          study_program_detail,
                        } in subjectPaginate"
                      >
                        <tr class="align-middle">
                          <td>
                            {{ code }}
                          </td>
                          <td>
                            {{ name }}
                          </td>
                          <td align="center">
                            {{ register_study_semester }}
                          </td>
                          <td align="center">
                            <i
                              v-if="study_program_detail?.force"
                              class="fa fa-check-square"
                            ></i>
                            <i v-else class="fa fa-square"></i>
                          </td>
                          <td align="center">{{ credit }}</td>
                          <td align="center">{{ credit }}</td>
                          <td>{{ code }}</td>
                          <td>
                            {{ study_program_detail?.study_program.name }}
                          </td>
                          <td>{{ study_program_detail?.note }}</td>
                          <td></td>
                          <td></td>
                          <td>{{ academy.code }}</td>
                        </tr>
                      </template>
                    </template>
                    <tr v-else>
                      <td
                        class="fw-light text-center no-data-text"
                        colspan="10"
                      >
                        Không có học phần nào
                      </td>
                    </tr>
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
<style scoped>
.checkbox-custom {
  width: 15px;
  height: 15px;
}
.checkbox-custom:disabled {
  color: red !important;
}
</style>
