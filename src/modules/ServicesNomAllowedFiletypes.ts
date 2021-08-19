import { Vue } from 'vue-property-decorator';
import { getModule} from 'vuex-module-decorators';
import axios from 'axios';
import 'url-search-params-polyfill';
import {CONFIG_ENV} from '@/config';
import iNomAllowedFiletypes from '@/types/iNomAllowedFiletypes';
import nomenclatoare from '@/store/nomenclatoare';

interface TAjaxResponseNomAllowedFiletypes {
  status: string;
  message: string;
  rows: iNomAllowedFiletypes[];
}

interface TAjaxResponseEditCateg {
  status: string;
  message: string;
}

export class ServicesNomAllowedFiletypes {
  public static async getNomAllowedFiletypes(): Promise<TAjaxResponseNomAllowedFiletypes> {
    // tslint:disable-next-line:no-console
    const response = await axios.get(`${CONFIG_ENV.URL_NOM.NomAllowedFiletypes}`);
    return response.data;
  }

  public static async deleteNomAllowedFiletypes(pappid: number): Promise<TAjaxResponseEditCateg> {
    // tslint:disable-next-line:no-console
    const response = await axios.delete(`${CONFIG_ENV.URL_NOM.NomAllowedFiletypes}/${pappid}`);
    return response.data;
  }

  // tslint:disable-next-line:max-line-length
  public static async postNomAllowedFiletypes(appid: number, file_extension: string, file_max_size: number): Promise<TAjaxResponseEditCateg> {
    const params = new URLSearchParams();
    params.set('appid', appid.toString());
    params.set('file_extension', file_extension);
    params.set('file_max_size', file_max_size.toString());
    const response = await axios.post(`${CONFIG_ENV.URL_NOM.NomAllowedFiletypes}`, params);
    return response.data;
  }

}
