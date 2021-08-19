import { Vue } from 'vue-property-decorator';
import { getModule} from 'vuex-module-decorators';
import axios from 'axios';
import 'url-search-params-polyfill';
import {CONFIG_ENV} from '@/config';
import iNomRegistru from '@/types/iNomRegistru';
import nomenclatoare from '@/store/nomenclatoare';

interface TAjaxResponseNomRegistru {
  status: string;
  message: string;
  rows: iNomRegistru[];
}

interface TAjaxResponseEditRegistru {
  status: string;
  message: string;
}

export class ServicesRegistre {
  public static async getNomRegistre(): Promise<TAjaxResponseNomRegistru> {
    // tslint:disable-next-line:no-console
    const response = await axios.get(`${CONFIG_ENV.URL_NOM.registre}`);
    return response.data;
  }

  public static async deleteNomRegistru(pappid: number): Promise<TAjaxResponseEditRegistru> {
    // tslint:disable-next-line:no-console
    const response = await axios.delete(`${CONFIG_ENV.URL_NOM.registru}/${pappid}`);
    return response.data;
  }

  public static async putNewStatusNomTipDoc(appid:number,pNewStatus:string): Promise<TAjaxResponseEditRegistru> {
    // tslint:disable-next-line:no-console
    const response = await axios.put(`${CONFIG_ENV.URL_NOM.registru}/${appid}/${pNewStatus}`);
    return response.data;
  }

  // tslint:disable-next-line:max-line-length
  public static async postNomRegistru(appid: number, den_registru_lang_1: string, den_registru_lang_2: string, an_permis_pt_inreg:number, nr_de_start: number): Promise<TAjaxResponseEditRegistru> {
    const params = new URLSearchParams();
    params.set('appid', appid.toString());
    params.set('den_registru_lang_1', den_registru_lang_1);
    params.set('den_registru_lang_2', den_registru_lang_2);
    params.set('an_permis_pt_inreg', an_permis_pt_inreg.toString());
    params.set('nr_de_start', nr_de_start.toString());
    const response = await axios.post(`${CONFIG_ENV.URL_NOM.registru}`, params);
    return response.data;
  }


  public static async updateStoreNomRegistreFromDB() {
    const storeNomenclatoare = getModule(nomenclatoare);
    this.getNomRegistre().then((presponse) => {
      if (presponse.status === 'success') {
        storeNomenclatoare.set_nomregistre(JSON.parse(JSON.stringify(presponse.rows)));
      }
    })
  }

}
