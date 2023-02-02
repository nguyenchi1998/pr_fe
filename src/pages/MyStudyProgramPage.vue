<script>
import studyProgramAPI from '../services/studyProgramAPI';
import { removeEmptyObjects } from '../utils/helper';
import Paginate from 'vuejs-paginate-next';
import Swal from 'sweetalert2';
import * as _ from 'lodash';

export default {
  components: {
    Paginate,
  },
  data() {
    return {
      isLoadingData: false,
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
      studyPrograms: [],
    };
  },
  computed: {
    auth() {
      return this.$store.getters.selectAuth;
    },
    querySearch() {
      return removeEmptyObjects(this.filter);
    },
    mapStudyPrograms() {
      return this.studyPrograms.map(
        ({ study_program_details, ...studyProgram }) => ({
          ...studyProgram,
          study_program_details: study_program_details.map(
            ({ students, ...study_program_detail }) => ({
              ...study_program_detail,
              number_mark: students[0]?.pivot?.number_mark ?? '',
              text_mark: students[0]?.pivot?.text_mark ?? '',
              isLearn: students.length
            }),
          ),
          totalPassCredit: study_program_details.reduce(
            (total, study_program_detail) =>
              total +
              (study_program_detail.students.length
                ? study_program_detail.subject.credit
                : 0),
            0,
          ),
        }),
      );
    },
  },
  created() {
    this.fetchSubjects();
  },
  watch: {
    filter(_oldData, newData) {
      this.fetchSubjects(newData);
    },
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
      studyProgramAPI
        .fetchMyStudyPrograms(this.querySearch)
        .then(({ data }) => {
          this.isLoadingData = false;
          this.studyPrograms = data;
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
    search: _.debounce(function ({ target: { value, name } }) {
      this.filter = { ...this.filter, [name]: value };
    }, 500),
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
                <table class="table table-sm table-bordered">
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
                    <template v-if="studyPrograms.length">
                      <template
                        v-for="{
                          name,
                          id,
                          study_program_details,
                          required_credit,
                          totalPassCredit,
                        } in mapStudyPrograms"
                      >
                        <tr class="bg-gradient-lightblue">
                          <th colspan="12" class="p-2">
                            <div>
                              Mã loại HP: {{ id }} (Số HP:
                              {{ study_program_details.length }}, Tổng TC:
                              {{ required_credit }}, Tổng đạt:
                              {{ totalPassCredit }})
                            </div>
                            <div>Loại HP: {{ name }}</div>
                          </th>
                        </tr>
                        <tr
                          v-for="{
                            subject: {
                              code,
                              name,
                              credit,
                              academy,
                              register_study_semester,
                            },
                            force,
                            number_mark,
                            text_mark,isLearn
                          } in study_program_details"
                        >
                          <td>
                            {{ code }}
                          </td>
                          <td>
                            {{ name }}
                          </td>
                          <td class="text-center">
                            {{ register_study_semester }}
                          </td>
                          <td class="text-center">
                            <i v-if="force" class="fa fa-check-square"></i>
                            <i v-else class="fa fa-square"></i>
                          </td>
                          <td class="text-center">{{ credit }}</td>
                          <td class="text-center">{{ credit }}</td>
                          <td>{{ isLearn ? code : '' }}</td>
                          <td>
                            {{ study_program_detail?.study_program.name }}
                          </td>
                          <td>{{ study_program_detail?.note }}</td>
                          <td>{{ text_mark }}</td>
                          <td>{{ number_mark }}</td>
                          <td>{{ academy.code }}</td>
                        </tr>
                      </template>
                    </template>
                    <tr v-else>
                      <td
                        class="fw-light text-center no-data-text"
                        colspan="12"
                      >
                        Không có học phần nào
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
