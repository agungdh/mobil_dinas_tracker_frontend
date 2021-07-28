import axios from 'axios';

axios.defaults.baseURL = 'http://10.5.51.16:83/laravel-mobil-api/public/api';
axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

export default axios;