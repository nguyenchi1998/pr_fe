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
      studyPrograms: [],
    };
  },
  computed: {
    auth() {
      return this.$store.getters.selectAuth;
    },
    mapStudyPrograms() {
      return this.studyPrograms.map(
        ({ study_program_details, ...studyProgram }) => ({
          ...studyProgram,
          study_program_details: study_program_details.map(
            ({
              largest_mark_credit_class_student,
              ...study_program_detail
            }) => ({
              ...study_program_detail,
              number_mark: largest_mark_credit_class_student?.number_mark ?? '',
              text_mark: largest_mark_credit_class_student?.text_mark ?? '',
            }),
          ),
          totalPassCredit: study_program_details.reduce(
            (total, study_program_detail) =>
              total +
              (study_program_detail.largest_mark_credit_class_student
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
        .fetchMyStudyPrograms()
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
                      <th>Mã học phần</th>
                      <th>Tên học phần</th>
                      <!-- <th>Bắt buộc</th> -->
                      <th>Tín chỉ</th>
                      <th>Điểm chữ</th>
                      <th>Điểm số</th>
                      <th>Viện quản lý</th>
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
                        :key="id"
                      >
                        <tr class="bg-gradient-lightblue">
                          <th colspan="11" class="p-2">
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
                          v-for="(
                            {
                              subject: { code, name, credit, department },
                              // force,
                              number_mark,
                              text_mark,
                            },
                            index
                          ) in study_program_details"
                          :key="index"
                        >
                          <td>
                            {{ code }}
                          </td>
                          <td>
                            {{ name }}
                          </td>
                          <!-- <td class="text-center">
                            <i v-if="force" class="fa fa-check-square"></i>
                            <i v-else class="fa fa-square"></i>
                          </td> -->
                          <td>{{ credit }}</td>
                          <td>{{ text_mark }}</td>
                          <td>{{ number_mark }}</td>
                          <td>{{ department.academy.name }}</td>
                        </tr>
                      </template>
                    </template>
                    <tr v-else>
                      <td
                        class="fw-light text-center no-data-text"
                        colspan="11"
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
