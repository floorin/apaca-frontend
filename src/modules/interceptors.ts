import axios from 'axios';
import { Notify } from 'quasar';

export default function setup() {
  axios.interceptors.response.use((response) => {
    //console.log('interceptors axios response=%o',response)
    if(response.data && response.data.status && response.data.status==='error' && response.data.message){
      Notify.create({
        color: 'red',
        textColor: 'white',
        type: 'negative',
        message: response.data.message,
        position: 'top',
        timeout: 3500,
      })
    }
    return response;
  }, (error) => {
    const error_details = Object.values(error.response).toString();
    Notify.create({
      color: 'red',
      textColor: 'white',
      type: 'negative',
      message: error_details,
      position: 'top',
      timeout: 3500,
    })
    return Promise.reject(error);
  });
}
