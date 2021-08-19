import { Vue } from 'vue-property-decorator';
import { getModule} from 'vuex-module-decorators';
import axios from 'axios';
import 'url-search-params-polyfill';
import {CONFIG_ENV} from '@/config';
import iOrganizatie from '@/types/iOrganizatie';
import nomenclatoare from '@/store/nomenclatoare';

interface TAjaxResponseSimple {
  status: string;
  message: string;
}

interface TAjaxResponseGetNomOrg {
  status: string;
  message: string;
  rows:iOrganizatie[];
}

interface TAjaxResponseNomHrOrg {
  status: string;
  message: string;
  hr_org: any;
  //rows: iNomCateg[];
}

interface iDepartament{
  appid:number,
  appid_divizie:number,
  departament:string
}

interface iDivizie{
  appid:number,
  denumire:string
}

interface TAjaxResponseAllOrgForTree{
  status: string;
  message: string;
  departamente:iDepartament[];
  divizii:iDivizie[];
}

export class ServicesHrOrg {
  public static async getHrOrg(): Promise<TAjaxResponseNomHrOrg> {
    // tslint:disable-next-line:no-console
    const response = await axios.get(`${CONFIG_ENV.URL_NOM.hr_nom_org}`);
    return response.data;
  }

  public static async searchNomOrganizatii(): Promise<TAjaxResponseGetNomOrg> {
    // tslint:disable-next-line:no-console
    const params = new URLSearchParams();
    params.set('search_text', '%');
    const response = await axios.post(`${CONFIG_ENV.URL_SEARCH.optionsOrganizatii}`, params);
    return response.data;
  }

  public static async updateDivision(id_org:number,division_name:string): Promise<TAjaxResponseSimple> {
    // tslint:disable-next-line:no-console
    const params = new URLSearchParams();
    params.set('division_name', division_name);
    const response = await axios.post(`${CONFIG_ENV.URL_NOM.updateDivision}/${id_org}`, params);
    return response.data;
  }

  public static async updateDepartament(parent_id_org:number,id_org:number,departament_name:string): Promise<TAjaxResponseSimple> {
    // tslint:disable-next-line:no-console
    const params = new URLSearchParams();
    params.set('division_appid', parent_id_org.toString());
    params.set('departament_name', departament_name);
    const response = await axios.post(`${CONFIG_ENV.URL_NOM.updateDepartament}/${id_org}`, params);
    return response.data;
  }

  public static async deleteDivision(id_org:number): Promise<TAjaxResponseSimple> {
    const response = await axios.delete(`${CONFIG_ENV.URL_NOM.deleteDivision}/${id_org}`);
    return response.data;
  }

  public static async deleteDepartament(id_org:number): Promise<TAjaxResponseSimple> {
    const response = await axios.delete(`${CONFIG_ENV.URL_NOM.deleteDepartament}/${id_org}`);
    return response.data;
  }

  public static async getNomOrganizatiiForTree(): Promise<TAjaxResponseAllOrgForTree> {
    const response = await axios.get(`${CONFIG_ENV.URL_NOM.allOrgForTree}`);
    return response.data;
  }

  public static async getNomOrganizatii(): Promise<TAjaxResponseGetNomOrg> {
    const response = await axios.get(`${CONFIG_ENV.URL_NOM.toateDepartamentele}`);
    return response.data;
  }

  public static async updateStoreNomOrganizatiiFromDB() {
    const storeNomenclatoare = getModule(nomenclatoare);
    this.getNomOrganizatii().then((presponse) => {
      if (presponse.status === 'success') {
        storeNomenclatoare.set_nomorganizatii(presponse.rows);
      }
    })
  }
}
