import axios from '../../../utils/request';
export function login(form) {
    return axios.post(`${window.BASE_URL}/user/userLogin`, form)
}