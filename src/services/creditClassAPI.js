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

const find = async (id) => {
  const { data } = await request().get(`${BASE_RESOURCE}/find/${id}`);

  return data;
};

export default {
  fetchCreditClass,
  fetchMyCreditClass,
  find,
};
