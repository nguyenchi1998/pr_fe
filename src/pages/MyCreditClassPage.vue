<script>
import creditAPI from '../services/creditAPI';
import { removeEmptyObjects } from '../utils/helper';
const DELETE_ACTION = 'delete';
const INSERT_ACTION = 'insert';
const SUCCESS_ACTION_STATUS = 'Thành công';
const FAIL_ACTION_STATUS = 'Thất bại';
import { CREDIT_CLASS_STATUS, WEEKDAYS } from '../config/constants.js';
import Swal from 'sweetalert2';
import moment from 'moment';
import 'moment/locale/vi';

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
      creditClasses: [],
      classCodes: [],
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
    submitDisabled() {
      return !this.creditClasses.some((creditClass) => creditClass.action);
    },
    findCreditClassDisabled() {
      return !this.classCode;
    },
  },
  created() {
    this.fetchMyCreditClasses();
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
        // kiểm tra đã tồn tại trong danh sách hiện tại
        if (this.creditClasses.find(({ code }) => code == this.classCode)) {
          this.message = {
            success: false,
            content: `Lớp <b>${this.classCode}</b> đã đăng ký`,
          };
          return;
        }
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
            // kiểm tra thời khóa biểu trùng
            const conflictClass = this.creditClasses.find(
              ({ schedules, end_date }) =>
                schedules.some(({ time, weekday }) =>
                  data.schedules.some(
                    (schedule) =>
                      schedule.time == time && schedule.weekday == weekday,
                  ),
                ) && end_date > data.start_date,
            );
            if (conflictClass != undefined) {
              this.message = {
                success: false,
                content: `Thời khóa biểu lớp <b>${data.code}</b> >< <b>${conflictClass.code}</b> bị xung đột`,
              };
              return;
            }
            this.creditClasses = [
              ...this.creditClasses,
              { ...data, action: INSERT_ACTION, action_status: '' },
            ];
            this.classCode = '';
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
      if (code == '') {
        this.message = {
          success: false,
          message: '',
        };
      }
      this.classCode = code;
    },
    removeClass() {
      this.creditClasses = this.creditClasses.map((item) => ({
        ...item,
        ...(this.classCodes.includes(item.code)
          ? { action: DELETE_ACTION, action_status: '' }
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
        const { data, success, message } = await creditAPI.register({
          creditClasses: this.creditClasses.map(({ action, code }) => ({
            action,
            code,
          })),
        });
        this.classCodes = [];
        if (success) {
          this.message = {
            success: true,
            content: message,
          };
          this.creditClasses = data.map((item) => ({
            ...item,
            action: '',
            action_status: SUCCESS_ACTION_STATUS,
          }));
        } else {
          this.message = {
            success: false,
            content: message,
          };
          this.creditClasses = this.creditClasses.map((item) => ({
            ...item,
            action_status: item.action
              ? FAIL_ACTION_STATUS
              : SUCCESS_ACTION_STATUS,
            action: '',
          }));
        }
      }
    },
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY', { trim: false });
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
            <div style="position: relative; height: 100%">
              <div v-if="isLoadingData" class="wrapper-loading">
                <img src="./../assets/loading.gif" alt="" />
              </div>
              <div
                :class="isLoadingData ? 'opacity-50' : ''"
                style="overflow-y: auto; height: 100%"
              >
                <div class="form-inline">
                  <input
                    type="search"
                    class="form-control"
                    placeholder="Nhập mã lớp"
                    :value="classCode"
                    @change="changeClassCode"
                  />
                  <button
                    class="ml-2 btn btn-outline-info"
                    @click="fetchCreditClass"
                    :disabled="isFindLoading || findCreditClassDisabled"
                  >
                    Đăng ký
                  </button>
                </div>
                <div
                  :class="message.success ? 'text-success' : 'text-danger'"
                  class="mb-0 py-2 text-message"
                >
                  <span v-html="message.content"></span>
                </div>
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
                            <th>Tên lớp</th>
                            <th>Mã học phần</th>
                            <th>Trạng thái thực hiện</th>
                            <th>Thực hiện</th>
                            <th>Tín chỉ</th>
                            <th>Hành động</th>
                          </tr>
                        </thead>
                        <tbody class="table-bordered">
                          <template v-if="creditClasses.length">
                            <template
                              v-for="{
                                code,
                                subject,
                                action,
                                action_status,
                              } in creditClasses"
                              v-bind:key="code"
                            >
                              <tr class="align-middle">
                                <td>
                                  {{ code }}
                                </td>
                                <td>
                                  {{ subject.name }}
                                </td>
                                <td>
                                  <div v-if="subject">
                                    {{ subject.code }}
                                  </div>
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
                                <td class="text-center">
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
                            <tr>
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
                            <td colspan="7">
                              <div class="text-header-table mb-0 text-center">
                                Thời khóa biểu các lớp đăng ký
                              </div>
                            </td>
                          </tr>
                          <tr class="table-bordered">
                            <th>Lớp học</th>
                            <th>Phòng học</th>
                            <th>Thời gian bắt đầu</th>
                            <th>Thời gian kết thúc</th>
                            <th>Thứ học</th>
                            <th>Buổi học</th>
                          </tr>
                        </thead>
                        <tbody class="table-bordered">
                          <template v-if="creditClasses.length">
                            <template
                              v-for="{
                                code,
                                schedules,
                                start_date,
                                end_date,
                                study_room,
                              } in creditClasses"
                            >
                              <tr
                                v-for="(
                                  { id, weekday, time }, index
                                ) in schedules"
                                :key="id"
                              >
                                <td
                                  :rowspan="schedules.length"
                                  v-if="index == 0"
                                >
                                  {{ code }}
                                </td>
                                <td
                                  :rowspan="schedules.length"
                                  v-if="index == 0"
                                >
                                  {{ study_room ? study_room.name : '' }}
                                </td>
                                <td
                                  :rowspan="schedules.length"
                                  v-if="index == 0"
                                >
                                  {{ start_date ? formatDate(start_date) : '' }}
                                </td>
                                <td
                                  :rowspan="schedules.length"
                                  v-if="index == 0"
                                >
                                  {{ end_date ? formatDate(end_date) : '' }}
                                </td>
                                <td>
                                  {{
                                    WEEKDAYS.find(
                                      ({ value }) => value == weekday,
                                    )?.label
                                  }}
                                </td>
                                <td>
                                  <div v-if="time">
                                    {{ time == 1 ? 'Sáng' : 'Chiều' }}
                                  </div>
                                </td>
                              </tr>
                            </template>
                          </template>
                          <tr v-else>
                            <td
                              class="fw-light text-center no-data-text"
                              colspan="7"
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
            </div>
          </div>
          <div class="card-footer">
            <div class="col-12 text-center">
              <button
                class="btn btn-primary"
                @click="submit"
                :disabled="submitDisabled"
              >
                Gửi đăng ký
              </button>
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
