<script>
import creditClassAPI from './../services/creditClassAPI';
import * as _ from 'lodash';
import { removeEmptyObjects } from './../utils/helper';
import {
  CREDIT_CLASS_STATUS,
  CREDIT_CLASS_TYPE,
  WEEKDAYS,
} from '../config/constants.js';
export default {
  data() {
    return {
      isLoadingData: false,
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
      CREDIT_CLASS_STATUS: CREDIT_CLASS_STATUS,
      CREDIT_CLASS_TYPE: CREDIT_CLASS_TYPE,
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
  },
  watch: {
    filter(newData, _oldData) {
      this.fetchCreditClasses(newData);
    },
  },
  methods: {
    fetchCreditClasses: async function () {
      this.isLoadingData = true;
      const { data } = await creditClassAPI.fetchCreditClass(this.querySearch);
      this.creditClasses = data;
      this.isLoadingData = false;
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
              <h4 class="text-capitalize">
                Danh sách lớp dành cho đăng ký học tập
              </h4>
            </div>
          </div>
          <div class="card-body">
            <div style="position: relative">
              <div v-if="isLoadingData" class="wrapper-loading">
                <img src="./../assets/loading.gif" alt="" />
              </div>
              <div
                class="table-responsive"
                :class="isLoadingData ? 'opacity-50' : ''"
              >
                <table class="table-bordered table-sm-custom table">
                  <thead>
                    <tr class="align-middle">
                      <td>Mã lớp</td>
                      <td>Mã học phần</td>
                      <td>Tên học phần</td>
                      <td>Ghi chú</td>
                      <td>Loại lớp</td>
                      <td>Trạng thái</td>
                      <td>Max ĐK</td>
                      <td>Đã ĐK</td>
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
                            class="form-control filter-input border-0"
                            type="text"
                            placeholder="Nhập từ khóa"
                            :name="key"
                            :value="value"
                            @keyup="search"
                          />
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
                        id,
                        code,
                        subject,
                        note,
                        type,
                        status,
                        max_register,
                        name,
                        students,
                        relation_credit_class,
                        weekday,
                        weeks,
                        study_room,
                        time_frame,
                      } in creditClasses"
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
                          {{
                            CREDIT_CLASS_TYPE.find(
                              ({ value }) => value === type,
                            )?.label
                          }}
                        </th>
                        <th>
                          {{
                            CREDIT_CLASS_STATUS.find(
                              ({ value }) => value === status,
                            )?.label
                          }}
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
                              Tên lớp: <b>{{ name }}</b>
                            </div>
                            <div>
                              Khoa/viện:
                              <b v-if="subject && subject.academy">
                                {{ subject.academy.code }}
                              </b>
                            </div>
                            <div>
                              Mã lớp kèm:
                              <b v-if="relation_credit_class">
                                {{ relation_credit_class.code ?? '' }}
                              </b>
                            </div>
                          </div>
                          <div>
                            <table class="table-sm mb-0 table">
                              <tbody>
                                <tr>
                                  <td>Thứ</td>
                                  <td>Thời gian</td>
                                  <td>Tuần học</td>
                                  <td>Phòng học</td>
                                </tr>
                                <tr>
                                  <td>
                                    {{
                                      ` ${
                                        WEEKDAYS.find(
                                          ({ value }) => value === weekday,
                                        )?.label
                                      }`
                                    }}
                                  </td>
                                  <td>
                                    {{
                                      `${time_frame.start_time}  - ${time_frame.end_time}`
                                    }}
                                  </td>
                                  <td>
                                    {{ weeks }}
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
                <paginate
                  :page-count="20"
                  :prev-text="'Prev'"
                  :next-text="'Next'"
                  :container-class="'className'"
                >
                </paginate>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
