import { Vue } from 'vue-property-decorator';
import { getModule} from 'vuex-module-decorators';
import axios from 'axios';
import 'url-search-params-polyfill';
import {CONFIG_ENV} from '@/config';
import iScan from '@/types/iScan';


interface TAjaxResponseGetRepartizari{
  status: string;
  message: string;
  rows: iScan[];
}

interface TAjaxResponseGetInfoScan{
  status: string;
  message: string;
  scan: iScan;
}

export class ServicesRepartizari {
  public static async getRepartizari(appidDoc:number): Promise<TAjaxResponseGetRepartizari> {
    const response = await axios.get(`${CONFIG_ENV.URL_REPARTIZARE.getRepartizari}/${appidDoc}`);
    return response.data;
  }

  public static async getInfoRepartizare(appidd:number): Promise<TAjaxResponseGetInfoScan> {
    const response = await axios.get(`${CONFIG_ENV.URL_SCAN.getInfoScan}/${appidd}`);
    return response.data;
  }

}
