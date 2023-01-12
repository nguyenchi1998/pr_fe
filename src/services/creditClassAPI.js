import { request } from './../utils/request';

const BASE_RESOURCE = '/credit-classes';

const fetchCreditClass = async (filter) => {
  const { data } = await request().get(`${BASE_RESOURCE}`, {
    params: filter,
  });

  return data;
};

const fetchMyCreditClass = async (filter) => {
  const { data } = await request().get(`${BASE_RESOURCE}/mine`, {
    params: filter,
  });

  return data;
};

const find = async (code) => {
  const { data } = await request().post(`${BASE_RESOURCE}/find`, {
    code: code,
  });

  return data;
};

const register = async (creditClasses) => {
  const { data } = await request().post(`${BASE_RESOURCE}/register`, {
    ...creditClasses,
  });

  return data;
};

export default {
  fetchCreditClass,
  fetchMyCreditClass,
  find,
  register,
};
