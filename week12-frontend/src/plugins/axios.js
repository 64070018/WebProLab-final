import axios from 'axios'

// always build instance axios when you shoot .axios
const instance = axios.create({
    baseURL: 'http://localhost:3000', // กำหนด baseURl
})

instance.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export default instance
