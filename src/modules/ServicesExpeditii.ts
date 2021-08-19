import { Vue } from 'vue-property-decorator';
import { getModule} from 'vuex-module-decorators';
import axios from 'axios';
import 'url-search-params-polyfill';
import {CONFIG_ENV} from '@/config';
import iExpeditie from '@/types/iExpeditie';

interface TAjaxSimpleResponse{
  status: string;
  message: string;
}


interface TAjaxResponseGetExpeditii{
  status: string;
  message: string;
  rows: iExpeditie[];
}

interface TAjaxResponseSaveExpeditie{
  status: string;
  message: string;
  expeditie: iExpeditie;
}

export class ServicesExpeditii {
  public static async getExpeditii(appidDoc:string): Promise<TAjaxResponseGetExpeditii> {
    const response = await axios.get(`${CONFIG_ENV.URL_DOCUMENT.Expeditie}/${appidDoc}`);
    return response.data;
  }

  public static async addNewExpeditie(appidDoc:string,pExpeditie:iExpeditie): Promise<TAjaxResponseSaveExpeditie> {
    const response = await axios.post(`${CONFIG_ENV.URL_DOCUMENT.Expeditie}/${appidDoc}`,pExpeditie);
    return response.data;
  }

  public static async removeExpeditie(appid: number): Promise<TAjaxSimpleResponse> {
    const response = await axios.delete(`${CONFIG_ENV.URL_DOCUMENT.Expeditie}/${appid}`);
    return response.data;
  }
}
