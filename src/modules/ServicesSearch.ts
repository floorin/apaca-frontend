import { Vue } from 'vue-property-decorator';
import { getModule} from 'vuex-module-decorators';
import axios from 'axios';
import 'url-search-params-polyfill';
import {CONFIG_ENV} from '@/config';
import iSolicitant from '@/types/iSolicitant';
import iOrganizatie from '@/types/iOrganizatie';
import iLogDoc from '@/types/iLogDoc';


interface TAjaxResponseOptionsSolicitanti{
  status: string;
  message: string;
  nr_of_records: number,
  rows: iSolicitant[];
}

interface TAjaxResponseOptionsOrganizatii{
  status: string;
  message: string;
  nr_of_records: number,
  rows: iOrganizatie[];
}

interface TStatusNumar{
  den_registru:string,
  nr_de_start:string,
  nr_curent:string
}
interface TAjaxResponseStatusNumere{
  status: string;
  message: string;
  rows: TStatusNumar[];
}

interface TAjaxResponseLogsDoc{
  status: string;
  message: string;
  id_doc:string;
  data_doc:string;
  create_de:string;
  tip_document:string;
  rows:iLogDoc[];
}

export class ServicesSearch {
  public static async optionsSolicitanti(ptext:string): Promise<TAjaxResponseOptionsSolicitanti> {
    const params = new URLSearchParams();
    params.set('search_text', ptext);
    const response = await axios.post(`${CONFIG_ENV.URL_SEARCH.optionsSolicitanti}`, params);
    return response.data;
  }

  public static async optionsOrganizatii(ptext:string): Promise<TAjaxResponseOptionsOrganizatii> {
    const params = new URLSearchParams();
    params.set('search_text', ptext);
    const response = await axios.post(`${CONFIG_ENV.URL_SEARCH.optionsOrganizatii}`, params);
    return response.data;
  }

  public static async getStatusNumere(): Promise<TAjaxResponseStatusNumere> {
    const response = await axios.get(`${CONFIG_ENV.URL_SEARCH.getStatusNumere}`);
    return response.data;
  }

  public static async getActionLogForDoc(log_for_doc_id_registru:number,log_for_doc_id_doc:number): Promise<TAjaxResponseLogsDoc> {
    const params = new URLSearchParams();
    const response = await axios.get(`${CONFIG_ENV.URL_SEARCH.getLogForDoc}/${log_for_doc_id_registru}/${log_for_doc_id_doc}`);
    return response.data;
  }
}
