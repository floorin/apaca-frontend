import axios from 'axios';
import 'url-search-params-polyfill';
import {CONFIG_ENV} from '@/config';
import iUser from '@/types/iUser';
import iLogUser from '@/types/iLogUser';

import {getModule} from 'vuex-module-decorators';
import nomenclatoare from '@/store/nomenclatoare';

interface iPersoanaUtilizatoare extends iUser{
  den_org:string
}

interface TAjaxResponseSimple {
  status: string;
  message: string;
}

interface TAjaxResponseNomUsers {
  status: string;
  message: string;
  rows: iUser[];
}

interface TAjaxResponsePersoaneUtilizatoare {
  status: string;
  message: string;
  rows: iPersoanaUtilizatoare[];
}

interface TAjaxResponseGetUser {
  status: string;
  message: string;
  user:iUser
}

interface TAjaxResponseGetGrantedRegistre {
  status: string;
  message: string;
  user_name:string;
  rows:any[number];//appid granted registre
}

interface TAjaxResponseLogsUser{
  status: string;
  message: string;
  user_name:string;
  data_start:string;
  data_end:string;
  rows:iLogUser[];
}

export class ServicesNomUsers {
  public static async getNomPersoaneUtilizatoare(): Promise<TAjaxResponsePersoaneUtilizatoare> {
    // tslint:disable-next-line:no-console
    const response = await axios.get(`${CONFIG_ENV.URL_NOM.persoane_utilizatoare}`);
    return response.data;
  }

  public static async getNomUsers(): Promise<TAjaxResponseNomUsers> {
    // tslint:disable-next-line:no-console
    const response = await axios.get(`${CONFIG_ENV.URL_NOM.nom_users}`);
    return response.data;
  }

  public static async deleteNomUser(userid: string): Promise<TAjaxResponseSimple> {
    // tslint:disable-next-line:no-console
    const response = await axios.delete(`${CONFIG_ENV.URL_NOM.nom_users}/${userid}`);
    return response.data;
  }

  public static async getCurrentUserFromAD(puserid: string): Promise<TAjaxResponseGetUser> {
    const params = new URLSearchParams();
    params.set('bf', puserid.toString());
    const response = await axios.post(`${CONFIG_ENV.URL_USER.getCurrentUserFromAD}`,params);
    return response.data;
  }

  public static async getUserByMarca(puserid: string): Promise<TAjaxResponseGetUser> {
    const response = await axios.get(`${CONFIG_ENV.URL_USER.getUserByMarca}/${puserid}`);
    return response.data;
  }

  public static async putStatusAuth(authName:string,pNewStatus:string,puserid:string): Promise<TAjaxResponseSimple> {
    // tslint:disable-next-line:no-console
    const response = await axios.put(`${CONFIG_ENV.URL_NOM.nom_users}/change_auth/${authName}/${pNewStatus}`,puserid);
    return response.data;
  }

  public static async chgDepartamentForUser(puserid:number,p_org_id:number): Promise<TAjaxResponseSimple> {
    // tslint:disable-next-line:no-console
    const response = await axios.put(`${CONFIG_ENV.URL_NOM.chg_user_departament}/${puserid}/${p_org_id}`,puserid);
    return response.data;
  }

  public static async chgEmailForUser(puserid:string,pemail:string): Promise<TAjaxResponseSimple> {
    const params = new URLSearchParams();
    params.set('new_email', pemail);
    const response = await axios.post(`${CONFIG_ENV.URL_NOM.chg_user_email}/${puserid}`,params);
    return response.data;
  }

  public static async chgUserWanForUser(puserid:string,puserwan:string): Promise<TAjaxResponseSimple> {
    const params = new URLSearchParams();
    params.set('user_wan', puserwan);
    const response = await axios.post(`${CONFIG_ENV.URL_NOM.chg_user_wan}/${puserid}`,params);
    return response.data;
  }

  public static async chgNumeForUser(userid:number, new_first_name:string,new_last_name:string): Promise<TAjaxResponseSimple> {
    const params = new URLSearchParams();
    params.set('new_first_name', new_first_name);
    params.set('new_last_name', new_last_name);
    const response = await axios.post(`${CONFIG_ENV.URL_NOM.chg_user_name}/${userid}`,params);
    return response.data;
  }

  public static async deleteUser(puserid:string): Promise<TAjaxResponseSimple> {
    const response = await axios.delete(`${CONFIG_ENV.URL_NOM.delete_user}/${puserid}`);
    return response.data;
  }

  public static async getInfoGrantedRegistreForUser(puserid:string): Promise<TAjaxResponseGetGrantedRegistre> {
    const response = await axios.get(`${CONFIG_ENV.URL_USER.granted_registre_marca}/${puserid}`);
    return response.data;
  }

  public static async deleteGrantRegistruUser(puserid:number,pRegistruId:number): Promise<TAjaxResponseSimple> {
    const response = await axios.delete(`${CONFIG_ENV.URL_USER.granted_registre_marca}/${puserid}/${pRegistruId}`);
    return response.data;
  }

  public static async putGrantRegistruUser(puserid:number,pRegistruId:number): Promise<TAjaxResponseSimple> {
    const response = await axios.put(`${CONFIG_ENV.URL_USER.granted_registre_marca}/${puserid}/${pRegistruId}`);
    return response.data;
  }

  // tslint:disable-next-line:max-line-length
  public static async postUser(puser:iUser): Promise<TAjaxResponseSimple> {
    const response = await axios.post(`${CONFIG_ENV.URL_NOM.nom_users}`, puser);
    return response.data;
  }

  public static async getActionLogForUser(userid:string,data_start:string,data_end:string): Promise<TAjaxResponseLogsUser> {
    const params = new URLSearchParams();
    params.set('data_start', data_start);
    params.set('data_end', data_end);
    const response = await axios.post(`${CONFIG_ENV.URL_USER.getLogForuser}/${userid}`,params);
    return response.data;
  }
}
