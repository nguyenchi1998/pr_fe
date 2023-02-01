import { request } from '../utils/request';

const BASE_RESOURCE = '/subjects';

const fetchSubjects = async (filter) => {
  const { data } = await request().get(`${BASE_RESOURCE}`, {
    params: filter,
  });

  return data;
};
export default {
  fetchSubjects,
}
