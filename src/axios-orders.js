import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-52acc.firebaseio.com/'
});

export default instance;