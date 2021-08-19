import moment, {Moment} from 'moment';
import nomenclatoare from '@/store/nomenclatoare';
import {getModule} from 'vuex-module-decorators';
const storeNomenclatoare = getModule(nomenclatoare);

export function dateToStringDDMonYYYY(pDate: Moment) {
  return moment(pDate).format('D MMM YYYY');
}

export function humanReadableBytes(bytes:number):string {
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  // @ts-ignore
  return (bytes / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + sizes[i];
}

export function denDepartamentFromOrg(pOrgId: number):string {
  const departament = storeNomenclatoare.NomOrganizatii.find(organizatie=>{
    return organizatie.appid==pOrgId;
  })
  if(departament){
    return departament.divizie+' / '+departament.departament;
  }else{
    return 'nedefinit';
  }
}

export function denPersoanaUtilizatorFromMarca(pMarca: number):string {
  const persoana = storeNomenclatoare.NomPersoaneUtilizatoare.find(ppersoana=>{
    return ppersoana.marca==pMarca;
  })
  if(persoana){
    return persoana.firstName+' '+persoana.lastName;
  }else{
    return 'nedefinit';
  }
}

export function ValidateEmail(mailString:string):boolean
{
  var result=false;
  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if (reg.test(mailString) == false)
  {
    result=false;
  }else{
    result=true;
  }
  return result;
}
