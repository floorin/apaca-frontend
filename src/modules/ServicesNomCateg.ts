import { Vue } from 'vue-property-decorator';
import { getModule} from 'vuex-module-decorators';
import axios from 'axios';
import 'url-search-params-polyfill';
import {CONFIG_ENV} from '@/config';
import iNomCateg from '@/types/iNomCateg';
import nomenclatoare from '@/store/nomenclatoare';

interface TAjaxResponseNomCateg {
  status: string;
  message: string;
  rows: string;
  //rows: iNomCateg[];
}

interface TAjaxResponseEditCateg {
  status: string;
  message: string;
}

export class ServicesNomCateg {
  public static async getNomCateg(): Promise<TAjaxResponseNomCateg> {
    // tslint:disable-next-line:no-console
    const response = await axios.get(`${CONFIG_ENV.URL_NOM.categorii}`);
    return response.data;
  }

  public static async deleteNomCateg(pappid: number): Promise<TAjaxResponseEditCateg> {
    // tslint:disable-next-line:no-console
    const response = await axios.delete(`${CONFIG_ENV.URL_NOM.categorie}/${pappid}`);
    return response.data;
  }

  public static async putNewStatusNomTipDoc(appid:number,pNewStatus:string): Promise<TAjaxResponseEditCateg> {
    // tslint:disable-next-line:no-console
    const response = await axios.put(`${CONFIG_ENV.URL_NOM.categorie}/${appid}/${pNewStatus}`);
    return response.data;
  }

  // tslint:disable-next-line:max-line-length
  public static async postNomCateg(appid: number, den_lang_1: string, den_lang_2: string): Promise<TAjaxResponseEditCateg> {
    const params = new URLSearchParams();
    params.set('appid', appid.toString());
    params.set('den_lang_1', den_lang_1);
    params.set('den_lang_2', den_lang_2);
    const response = await axios.post(`${CONFIG_ENV.URL_NOM.categorie}`, params);
    return response.data;
  }


  public static async updateStoreNomCategFromDB() {
    console.log('%cServicesNomCateg running updateStoreNomCategFromDB<-------------------------', "color: red;font-size:16px;")
    const storeNomenclatoare = getModule(nomenclatoare);
    this.getNomCateg().then((presponse) => {
      if (presponse.status === 'success') {
        storeNomenclatoare.set_nomcategorii(JSON.parse(presponse.rows));
      }
    })
  }

}
