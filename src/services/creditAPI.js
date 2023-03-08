import { request } from '../utils/request';

const BASE_RESOURCE = '/credit';
const CLASS_RESOURCE = `${BASE_RESOURCE}/classes`;


const fetchCreditClasses = async (filter) => {
  const { data } = await request().get(`${CLASS_RESOURCE}`, {
    params: filter,
  });

  return data;
};

const fetchMyCreditClass = async (filter) => {
  const { data } = await request().get(`${CLASS_RESOURCE}/mine`, {
    params: filter,
  });

  return data;
};

const fetchCreditClass = async (code) => {
  const { data } = await request().post(`${CLASS_RESOURCE}/find`, {
    code: code,
  });

  return data;
};

const register = async (creditClasses) => {
  const { data } = await request().post(`${CLASS_RESOURCE}/register`, {
    ...creditClasses,
  });

  return data;
};


export default {
  fetchCreditClasses,
  fetchMyCreditClass,
  fetchCreditClass,
  register,
};
