import { Vue } from 'vue-property-decorator';
import { getModule} from 'vuex-module-decorators';
import axios from 'axios';
import 'url-search-params-polyfill';
import {CONFIG_ENV} from '@/config';
import iScan from '@/types/iScan';


interface TAjaxResponseGetScans{
  status: string;
  message: string;
  nr_of_records: number,
  rows: iScan[];
}

interface TAjaxResponseGetInfoScan{
  status: string;
  message: string;
  scan: iScan;
}

interface TAjaxSimpleResponse{
  status: string;
  message: string;
}

export class ServicesScans {
  public static async getScans(appidDoc:number): Promise<TAjaxResponseGetScans> {
    const response = await axios.get(`${CONFIG_ENV.URL_SCAN.getScans}/${appidDoc}`);
    return response.data;
  }

  public static async getInfoScan(appidd:number): Promise<TAjaxResponseGetInfoScan> {
    const response = await axios.get(`${CONFIG_ENV.URL_SCAN.getInfoScan}/${appidd}`);
    return response.data;
  }

  public static async deleteScan(appidd:number): Promise<TAjaxSimpleResponse> {
    const response = await axios.delete(`${CONFIG_ENV.URL_SCAN.getInfoScan}/${appidd}`);
    return response.data;
  }
}
