<script>
import creditAPI from '../services/creditAPI';
import { removeEmptyObjects } from '../utils/helper';
const DELETE_ACTION = 'delete';
const INSERT_ACTION = 'insert';
const SUCCESS_ACTION_STATUS = 'Thành công';
const FAIL_ACTION_STATUS = 'Thất bại';
import {
  CREDIT_CLASS_STATUS,
  CREDIT_CLASS_TYPE,
  WEEKDAYS,
} from '../config/constants.js';
import Swal from 'sweetalert2';

const ACTION_LABEL = {
  [INSERT_ACTION]: 'Đăng ký',
  [DELETE_ACTION]: 'Hủy đăng ký',
};

export default {
  data() {
    return {
      isLoadingData: false,
      isFindLoading: false,
      message: {
        success: false,
        content: '',
      },
      classCode: '',
      filter: {
        class_code: '',
        subject_code: '',
        subject_name: '',
        note: '',
        type: '',
        status: '',
        max_register: '',
        registered_student: '',
      },
      creditSubjects: [],
      subjectCodes: [],
      CREDIT_CLASS_TYPE: CREDIT_CLASS_TYPE,
      CREDIT_CLASS_STATUS: CREDIT_CLASS_STATUS,
      WEEKDAYS: WEEKDAYS,
      INSERT_ACTION: INSERT_ACTION,
      ACTION_LABEL: ACTION_LABEL,
    };
  },
  computed: {
    totalCredit() {
      return this.creditSubjects.reduce(
        (total, item) => total + item?.subject?.credit,
        0,
      );
    },
    querySearch() {
      return removeEmptyObjects(this.filter);
    },
    canRegisterClass() {
      return this.$store.getters.selectCanRegisterClass;
    },
  },
  created() {
    this.fetchMyCreditSubjects();
  },
  methods: {
    fetchMyCreditSubjects: async function () {
      this.isLoadingData = true;
      const { data, success, message } = await creditAPI.fetchMyCreditSubjects(
        this.querySearch,
      );
      if (success) {
        this.creditSubjects = data.map((item) => ({
          ...item,
          action: '',
          action_status: SUCCESS_ACTION_STATUS,
        }));
      } else {
        this.message = {
          content: message,
          success: success,
        };
      }
      this.isLoadingData = false;
    },
    fetchCreditClass: function () {
      if (this.classCode) {
        this.isFindLoading = true;
        creditAPI
          .fetchCreditClass(this.classCode)
          .then(({ message, success, data }) => {
            this.isFindLoading = false;
            if (!success) {
              this.message = {
                success,
                content: message,
              };
              return;
            }
            this.message = { success: false, content: '' };

            if (this.creditSubjects.find(({ code }) => code === data.code)) {
              this.message = {
                success: false,
                content: 'Lớp đã tồn tại trong danh sách',
              };
            } else {
              this.creditSubjects = [
                { ...data, action: INSERT_ACTION },
                ...this.creditSubjects,
              ];
              this.classCode = '';
            }
          })
          .catch(({ message, response, status }) => {
            this.isFindLoading = false;
            if (status)
              this.message = {
                success: false,
                content: response?.data?.message,
              };
            Swal.fire({
              title: message,
              icon: 'error',
              confirmButtonText: 'OK',
            });
          });
      }
    },
    changeClassCode({ target: { value } }) {
      const code = value.trim();
      if (code === '') {
        this.message = {
          success: false,
          message: '',
        };
      }
      this.classCode = code;
    },
    removeClass() {
      this.creditSubjects = this.creditSubjects.map((item) => ({
        ...item,
        ...(this.subjectCodes.includes(item.code)
          ? { action: DELETE_ACTION }
          : {}),
      }));
    },
    triggerCheck({ target: { checked } }, code) {
      if (checked) {
        this.subjectCodes = [...this.subjectCodes, code];
      } else {
        this.subjectCodes = this.subjectCodes.filter((item) => item !== code);
      }
    },
    async submit() {
      if (confirm('Bạn có muốn gửi đăng ký về hệ thống không?')) {
        creditAPI
          .register({
            creditSubjects: this.creditSubjects.map(({ action, code }) => ({
              action,
              code,
            })),
          })
          .then(({ data, success, message }) => {
            if (success) {
              this.subjectCodes = [];
              this.message = {
                success: true,
                content: message,
              };
              this.creditSubjects = data.map((item) => ({
                ...item,
                action: '',
                action_status: SUCCESS_ACTION_STATUS,
              }));
            } else {
              this.message = {
                success: false,
                content: message,
              };
              this.creditSubjects = this.creditSubjects.map((item) => ({
                ...item,
                action: '',
                action_status: FAIL_ACTION_STATUS,
              }));
            }
          })
          .catch();
      }
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
                Trang đăng ký sinh viên
              </h5>
            </div>
          </div>
          <div class="card-body">
            <div style="position: relative">
              <div v-if="isLoadingData" class="wrapper-loading">
                <img src="./../assets/loading.gif" alt="" />
              </div>
              <div :class="isLoadingData ? 'opacity-50' : ''">
                <div class="form-inline" v-if="canRegisterClass">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Nhập mã lớp"
                    :value="classCode"
                    @change="changeClassCode"
                  />
                  <button
                    class="ml-2 btn btn-outline-info"
                    @click="fetchCreditClass"
                    :disabled="isFindLoading"
                  >
                    ĐK lớp
                  </button>
                </div>
                <div
                  :class="message.success ? 'text-success' : 'text-danger'"
                  class="h5 mb-0 py-2 text-message"
                >
                  {{ message.content }}
                </div>
                <div class="mt-2 table-responsive">
                  <div class="text-header-table mb-0 text-center">
                    Bảng đăng ký học phần kỳ 1234 của sinh viên 20200322P
                  </div>
                  <table class="table table-bordered">
                    <thead>
                      <tr class="table-bordered align-middle">
                        <th>Mã học phần</th>
                        <th>Tên học phần</th>
                        <th>Tín chỉ</th>
                        <th>Trạng thái ĐK</th>
                        <th>Thực hiện</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody class="table-bordered">
                      <tr v-if="!creditSubjects.length">
                        <td
                          class="fw-light text-center no-data-text"
                          colspan="10"
                        >
                          Sinh viên chưa đăng ký HP nào trong kỳ này
                        </td>
                      </tr>
                      <template v-else v-for="{ subject } in creditSubjects">
                        <tr class="align-middle">
                          <td>
                            {{ subject.code }}
                          </td>
                          <td>
                            {{ subject.name }}
                          </td>
                          <td>
                            {{ subject.credit }}
                          </td>
                          <td>
                            {{ ACTION_LABEL[action] }}
                          </td>
                          <td>
                            <div v-if="subject">
                              {{ subject.credit }}
                            </div>
                          </td>
                          <td class="text-center" v-if="canRegisterClass">
                            <input
                              type="checkbox"
                              class="checkbox-custom"
                              :checked="subjectCodes.includes(code)"
                              @change="triggerCheck($event, code)"
                            />
                          </td>
                        </tr>
                      </template>
                      <tr>
                        <td class="text-right" colspan="10">
                          <span class="pr-5">
                            Tổng số TC đăng ký: {{ totalCredit }}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td class="text-right" colspan="10">
                          <button
                            type="submit"
                            class="btn"
                            :class="
                              creditSubjects.length
                                ? 'btn-danger'
                                : 'btn-secondary'
                            "
                            form="delete-class"
                            @click="removeClass"
                            :disabled="!subjectCodes.length"
                          >
                            Xóa các HP chọn
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="row" v-if="canRegisterClass">
                  <div class="col-12 text-center">
                    <button
                      class="btn"
                      :class="
                        creditSubjects.length ? 'btn-primary' : 'btn-secondary'
                      "
                      :disabled="!creditSubjects.length"
                      @click="submit"
                    >
                      Gửi đăng ký
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.checkbox-custom {
  width: 18px;
  height: 18px;
}
</style>
