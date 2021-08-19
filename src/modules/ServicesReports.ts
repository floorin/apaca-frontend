import { Vue } from 'vue-property-decorator';
import { getModule} from 'vuex-module-decorators';
import axios from 'axios';
import 'url-search-params-polyfill';
import {CONFIG_ENV} from '@/config';
import iDocument from '@/types/iDocument';


interface TAjaxResponseXls {
  data: string;
}

export class ServicesReports {
  public static async getXlsByConditions(reportType:string,searchParams:any): Promise<TAjaxResponseXls> {
    const response = await axios.post(`${CONFIG_ENV.URL_REPORTS.getXlsByConditions}`,{reportType,searchParams});
    return response;
  }

}
