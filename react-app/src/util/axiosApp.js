import axios from 'axios'

let url
if (process.env.NODE_ENV === 'production') {
    url = 'https://europe-west2-catalogdom.cloudfunctions.net/'

} else {
    // url = "http://localhost:5000/catalogdom/europe-west2/"
    url = 'https://europe-west2-catalogdom.cloudfunctions.net/'
}

export const axiosApp = axios.create({
    baseURL: url,
    //timeout: 1000,
    // headers: { 'X-Custom-Header': 'foobar' }
});
