import axios from 'axios';
import 'url-search-params-polyfill';
import {CONFIG_ENV} from '@/config';
import iNomCateg from '@/types/iNomCateg';
import {getModule} from 'vuex-module-decorators';
import nomenclatoare from '@/store/nomenclatoare';

interface TAjaxResponseNomTipDoc {
  status: string;
  message: string;
  rows: string;
  //rows: iNomCateg[];
}

interface TAjaxResponseEditTipDoc {
  status: string;
  message: string;
}

export class ServicesNomTipDoc {
  public static async getNomTipDoc(): Promise<TAjaxResponseNomTipDoc> {
    // tslint:disable-next-line:no-console
    const response = await axios.get(`${CONFIG_ENV.URL_NOM.tip_docs}`);
    return response.data;
  }

  public static async putNewStatusNomTipDoc(appid:number,pNewStatus:string): Promise<TAjaxResponseEditTipDoc> {
    // tslint:disable-next-line:no-console
    const response = await axios.put(`${CONFIG_ENV.URL_NOM.tip_doc}/status/${appid}/${pNewStatus}`);
    return response.data;
  }

  public static async putNewStatusConfidentalityNomTipDoc(appid:number,pNewStatus:string): Promise<TAjaxResponseEditTipDoc> {
    // tslint:disable-next-line:no-console
    const response = await axios.put(`${CONFIG_ENV.URL_NOM.tip_doc}/confidentiality/${appid}/${pNewStatus}`);
    return response.data;
  }

  public static async deleteNomTipDoc(pappid: number): Promise<TAjaxResponseEditTipDoc> {
    // tslint:disable-next-line:no-console
    const response = await axios.delete(`${CONFIG_ENV.URL_NOM.tip_doc}/${pappid}`);
    return response.data;
  }

  // tslint:disable-next-line:max-line-length
  public static async postNomTipDoc(appid: number, id_categ: number, den_lang_1: string, den_lang_2: string): Promise<TAjaxResponseEditTipDoc> {
    const params = new URLSearchParams();
    params.set('appid', appid.toString());
    params.set('id_categ', id_categ.toString());
    params.set('den_lang_1', den_lang_1);
    params.set('den_lang_2', den_lang_2);
    const response = await axios.post(`${CONFIG_ENV.URL_NOM.tip_doc}`, params);
    return response.data;
  }

  public static async updateStoreNomTipDocsFromDB() {
    const storeNomenclatoare = getModule(nomenclatoare);
    this.getNomTipDoc().then((presponse) => {
      if (presponse.status === 'success') {
        storeNomenclatoare.set_nomtipdoc(JSON.parse(presponse.rows));
      }
    })
  }
}
