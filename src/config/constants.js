export const ACCESS_TOKEN = 'access_token';
export const REFRESH_TOKEN = 'refresh_token';
export const CREDIT_CLASS_STATUS = [
  {
    label: 'Mở đăng ký',
    value: 1,
  },
  {
    label: 'Đang xếp TKB',
    value: 2,
  },
  {
    label: 'Điều chỉnh ĐK',
    value: 3,
  },
  {
    label: 'Chốt lớp',
    value: 4,
  },
  {
    label: 'Đang học',
    value: 5,
  },
  {
    label: 'Vào điểm',
    value: 6,
  },
  {
    label: 'Đã kết thúc',
    value: 7,
  },
];
export const CREDIT_CLASS_TYPE = [
  {
    label: 'Lý thuyết',
    short: 'LT',
    value: 1,
  },
  {
    label: 'Bài tập',
    short: 'BT',
    value: 2,
  },
  {
    label: 'Bài tập + lý thuyết',
    short: 'LT + BT',
    value: 3,
  },
  {
    label: 'Thí nghiệm',
    short: 'TN',
    value: 4,
  },
  {
    label: 'Đồ án',
    short: 'DA',
    value: 5,
  },
  {
    label: 'Thực tập',
    short: 'TT',
    value: 6,
  },
  {
    label: 'Thực tập kỹ thuật',
    short: 'TTKT',
    value: 7,
  },
  {
    label: 'Thực tập tốt nghiệp',
    short: 'TTTN',
    value: 8,
  },
];
export const WEEKDAYS = [
  {
    label: 'Thứ 2',
    value: 1,
  },
  {
    label: 'Thứ 3',
    value: 2,
  },
  {
    label: 'Thứ 4',
    value: 3,
  },
  {
    label: 'Thứ 5',
    value: 4,
  },
  {
    label: 'Thứ 6',
    value: 5,
  },
  {
    label: 'Thứ 7',
    value: 6,
  },
  {
    label: 'Chủ nhật',
    value: 7,
  },
];

export const SUBJECT_RELATIONS = [
  {
    label: 'tương đương',
    value: 0,
    short: 'a'
  }, {
    label: 'tiên quyết',
    value: 1,
    short: 'b'
  }, {
    label: 'thay thế',
    value: 2,
    short: 'c'
  }, {
    label: 'song hành',
    value: 3,
    short: 'd'
  }
];


export const REGISTER_CREDIT_CLASS_PAGE = 'REGISTER_CREDIT_CLASS_PAGE';
export const MY_CREDIT_CLASS_PAGE = 'MY_CREDIT_CLASS_PAGE';
export const LOGIN_PAGE = 'LOGIN_PAGE';
export const REGISTER_SUBJECT_PAGE = 'REGISTER_SUBJECT_PAGE';
