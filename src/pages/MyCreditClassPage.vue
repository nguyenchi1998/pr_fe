<script>
import creditAPI from '../services/creditAPI';
import { removeEmptyObjects } from '../utils/helper';
const DELETE_ACTION = 'delete';
const INSERT_ACTION = 'insert';
const SUCCESS_ACTION_STATUS = 'Thành công';
import {
  CREDIT_CLASS_STATUS,
  CREDIT_CLASS_TYPE,
  WEEKDAYS,
} from '../config/constants.js';
import { createToast } from 'mosha-vue-toastify';
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
        success: '',
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
      creditClasses: [],
      classCodes: [],
      progress: false,
      CREDIT_CLASS_TYPE: CREDIT_CLASS_TYPE,
      CREDIT_CLASS_STATUS: CREDIT_CLASS_STATUS,
      WEEKDAYS: WEEKDAYS,
      INSERT_ACTION: INSERT_ACTION,
      ACTION_LABEL: ACTION_LABEL,
    };
  },
  computed: {
    totalCredit() {
      return this.creditClasses.reduce(
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
    this.fetchMyCreditClasses();
  },
  beforeRouteLeave(_to, _from, next) {
    if (this.progress) {
      if (confirm('Dữ liệu chưa được gửi!. Vẫn xác nhận rời trang?')) next();
    } else {
      next();
    }
  },
  methods: {
    fetchMyCreditClasses: function () {
      this.isLoadingData = true;
      creditAPI
        .fetchMyCreditClass(this.querySearch)
        .then(({ data }) => {
          this.creditClasses = data.map((item) => ({
            ...item,
            action: '',
            action_status: SUCCESS_ACTION_STATUS,
          }));
          this.isLoadingData = false;
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
    fetchCreditClass: function () {
      if (this.classCode) {
        this.isFindLoading = true;
        creditAPI
          .find(this.classCode)
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
            this.progress = true;

            if (this.creditClasses.find(({ code }) => code === data.code)) {
              this.message = {
                success: false,
                content: 'Lớp đã tồn tại trong danh sách',
              };
            } else {
              this.creditClasses = [
                { ...data, action: INSERT_ACTION },
                ...this.creditClasses,
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
      this.progress = true;
      this.creditClasses = this.creditClasses.map((item) => ({
        ...item,
        ...(this.classCodes.includes(item.code)
          ? { action: DELETE_ACTION }
          : {}),
      }));
    },
    triggerCheck({ target: { checked } }, code) {
      if (checked) {
        this.classCodes = [...this.classCodes, code];
      } else {
        this.classCodes = this.classCodes.filter((item) => item !== code);
      }
    },
    async submit() {
      if (confirm('Bạn có muốn gửi đăng ký về hệ thống không?')) {
        creditAPI
          .register({
            creditClasses: this.creditClasses.map(({ action, code }) => ({
              action,
              code,
            })),
          })
          .then(({ data }) => {
            this.classCodes = [];
            this.message = {
              success: true,
              content: 'Đã gửi đăng ký. Xem kết quả trên giao diện',
            };
            this.creditClasses = data.map((item) => ({
              ...item,
              action: '',
              action_status: SUCCESS_ACTION_STATUS,
            }));
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
              <div class="h4 text-capitalize flex-grow-1">
                Trang đăng ký sinh viên
              </div>
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
                  v-if="message.content"
                  :class="message.success ? 'text-success' : 'text-danger'"
                  class="h5 mb-0 mt-2"
                >
                  {{ message.content }}
                </div>
                <div class="mt-5 table-responsive">
                  <table class="table table-bordered">
                    <tr>
                      <td class="p-0">
                        <table class="table mb-0">
                          <thead>
                            <tr class="table-borderless">
                              <td colspan="10" class="border-0">
                                <div class="text-header-table mb-0 text-center">
                                  Danh sách lớp đăng ký
                                </div>
                              </td>
                            </tr>
                            <tr class="table-bordered align-middle">
                              <th>Mã lớp</th>
                              <th>Mã lớp kèm</th>
                              <th>Tên lớp</th>
                              <th>Mã học phần</th>
                              <th>Loại lớp</th>
                              <th>TT lớp</th>
                              <th>Trạng thái ĐK</th>
                              <th>Thực hiện</th>
                              <th>Tín chỉ</th>
                              <th v-if="canRegisterClass">Hành động</th>
                            </tr>
                          </thead>
                          <tbody class="table-bordered">
                            <template v-if="creditClasses.length">
                              <template
                                v-for="{
                                  code,
                                  subject,
                                  type,
                                  status,
                                  name,
                                  relation_credit_class,
                                  action,
                                  action_status,
                                } in creditClasses"
                              >
                                <tr class="align-middle">
                                  <td>
                                    {{ code }}
                                  </td>
                                  <td>
                                    <div v-if="relation_credit_class">
                                      {{ relation_credit_class.code }}
                                    </div>
                                  </td>
                                  <td>
                                    {{ name }}
                                  </td>
                                  <td>
                                    <div v-if="subject">
                                      {{ subject.code }}
                                    </div>
                                  </td>
                                  <td>
                                    {{
                                      CREDIT_CLASS_TYPE.find(
                                        ({ value }) => value === type,
                                      )?.label
                                    }}
                                  </td>
                                  <td>
                                    {{
                                      CREDIT_CLASS_STATUS.find(
                                        ({ value }) => value === status,
                                      )?.label
                                    }}
                                  </td>
                                  <td>{{ action_status }}</td>
                                  <td>
                                    {{ ACTION_LABEL[action] }}
                                  </td>
                                  <td>
                                    <div v-if="subject">
                                      {{ subject.credit }}
                                    </div>
                                  </td>
                                  <td
                                    class="text-center"
                                    v-if="canRegisterClass"
                                  >
                                    <input
                                      type="checkbox"
                                      class="checkbox-custom"
                                      :checked="classCodes.includes(code)"
                                      @change="triggerCheck($event, code)"
                                    />
                                  </td>
                                </tr>
                              </template>
                              <tr>
                                <td class="text-right" colspan="10">
                                  <span class="pr-5" style="font-size: 19px">
                                    Tổng số TC đăng ký: {{ totalCredit }}
                                  </span>
                                </td>
                              </tr>
                              <tr v-if="canRegisterClass">
                                <td class="text-right" colspan="10">
                                  <div class="py-1">
                                    <button
                                      type="submit"
                                      class="btn btn-outline-danger"
                                      form="delete-class"
                                      @click="removeClass"
                                      :disabled="!classCodes.length"
                                    >
                                      Xóa các lớp đã chọn
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            </template>
                            <tr v-else>
                              <td
                                class="fw-light text-center no-data-text"
                                colspan="10"
                              >
                                Không có lớp tín chỉ nào
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <table class="mb-0 table">
                          <thead>
                            <tr class="table-borderless">
                              <td colspan="5">
                                <div class="text-header-table mb-0 text-center">
                                  Thời khóa biểu các lớp đăng ký
                                </div>
                              </td>
                            </tr>
                            <tr class="table-bordered">
                              <th>Thứ</th>
                              <th>Thời gian</th>
                              <th>Tuần học</th>
                              <th>Phòng học</th>
                              <th>Lớp học</th>
                            </tr>
                          </thead>
                          <tbody class="table-bordered">
                            <tr
                              v-if="creditClasses.length"
                              v-for="{
                                code,
                                weekday,
                                weeks,
                                study_room,
                                time_frame,
                              } in creditClasses"
                            >
                              <td>
                                {{
                                  `Thứ ${
                                    WEEKDAYS.find(
                                      ({ value }) => value === weekday,
                                    )?.label
                                  }`
                                }}
                              </td>
                              <td>
                                <div v-if="time_frame">
                                  {{
                                    `${time_frame.start_time}  - ${time_frame.end_time}`
                                  }}
                                </div>
                              </td>
                              <td>
                                {{ weeks }}
                              </td>
                              <td>
                                <div v-if="study_room">
                                  {{ study_room.name ?? '' }}
                                </div>
                              </td>
                              <td>
                                {{ code }}
                              </td>
                            </tr>
                            <tr v-else>
                              <td
                                class="fw-light text-center no-data-text"
                                colspan="5"
                              >
                                Không có thời khóa biểu các lớp đăng ký
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </table>
                </div>
                <div class="row" v-if="canRegisterClass">
                  <div class="col-12 text-center">
                    <button
                      :disabled="!progress"
                      class="btn btn-primary"
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
