import { request } from '../utils/request';

const BASE_RESOURCE = '/study-programs';

const fetchMyStudyPrograms = async (filter) => {
  const { data } = await request().get(`${BASE_RESOURCE}`, {
    params: filter,
  });

  return data;
};
export default {
  fetchMyStudyPrograms,
};
