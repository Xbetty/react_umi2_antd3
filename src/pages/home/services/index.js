import axios from '../../../utils/request';
export function GetList() {
  return axios.post(`${window.BASE_URL}/user/getInfos`, { page: 1, limit: 10 });
}
