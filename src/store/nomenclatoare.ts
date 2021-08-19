import {store} from './index';
import {Module, VuexModule, Mutation, Action} from 'vuex-module-decorators';
import iNomCateg from '@/types/iNomCateg';
import iNomTipDoc from '@/types/iNomTipDoc';
import iNomRegistru from '@/types/iNomRegistru';
import iLabelValue from '@/types/iLabelValue';
import iOrganizatie from '@/types/iOrganizatie';

interface iPersoanaUtilizatoare{
  marca:number,
  firstName:string,
  lastName:string,
  functie:string
}

@Module({ namespaced: true, dynamic: true, store, name: 'storeNomenclatoare'})
export default class User extends VuexModule {
  public currentPageTitle:string='';
  public NomCategorii: iNomCateg[] =[];
  public nomCategIsOK:boolean = false;
  public NomTipDoc: iNomTipDoc[] =[];
  public nomTipDocIsOK:boolean = false;
  public NomRegistre: iNomRegistru[] =[];
  public nomRegistreIsOK:boolean = false;
  public NomOrganizatii: iOrganizatie[] =[];
  public nomOrgIsOK:boolean = false;

  public NomPersoaneUtilizatoare: iPersoanaUtilizatoare[] =[];
  public nomUseriIsOK:boolean = false;

  public NomCategSolicitant : iLabelValue[]=[
    {label:'Institutie Publica', value: 'pu'},
    {label:'Persoana Fizica', value: 'pf'},
    {label:'Persoana Juridica', value: 'pj'}
  ]
  public NomTipInregistrare : iLabelValue[]=[
    {label:'intrare', value: 'intrare'},
    {label:'iesire', value: 'iesire'},
    {label:'intern', value: 'intern'}
  ]

  public MyImgProfileString64: string = '';


  @Mutation
  public SET_NOMPERSOANE_UTILIZATOARE(puseri: iPersoanaUtilizatoare[]) {
    this.NomPersoaneUtilizatoare = JSON.parse(JSON.stringify(puseri));
    this.nomUseriIsOK=true;
  }
  @Action
  public set_nompersoane_utilizatoare(puseri: iPersoanaUtilizatoare[]) {
    this.context.commit('SET_NOMPERSOANE_UTILIZATOARE', puseri);
  }

  @Mutation
  public SET_CURRENTPAGETITLE(ptitle: string) {
    this.currentPageTitle = JSON.parse(JSON.stringify(ptitle));
  }
  @Action
  public set_currentpagetitle(ptitle: string) {
    this.context.commit('SET_CURRENTPAGETITLE', ptitle);
  }

  @Mutation
  public SET_NOMCATEGORII(pcategorii: iNomCateg[]) {
    this.NomCategorii = JSON.parse(JSON.stringify(pcategorii));
    this.nomCategIsOK=true;
  }
  @Action
  public set_nomcategorii(pcategorii: iNomCateg[]) {
    this.context.commit('SET_NOMCATEGORII', pcategorii);
  }


  @Mutation
  public SET_NOMTIPDOC(ptipdoc: iNomTipDoc[]) {
    this.NomTipDoc = JSON.parse(JSON.stringify(ptipdoc));
    this.nomTipDocIsOK=true;
  }
  @Action
  public set_nomtipdoc(ptipdoc: iNomTipDoc[]) {
    this.context.commit('SET_NOMTIPDOC', ptipdoc);
  }


  @Mutation
  public SET_NOMREGISTRE(pregistre: iNomRegistru[]) {
    this.NomRegistre = JSON.parse(JSON.stringify(pregistre));
    this.nomRegistreIsOK=true;
  }
  @Action
  public set_nomregistre(pregistre: iNomRegistru[]) {
    this.context.commit('SET_NOMREGISTRE', pregistre);
  }

  @Mutation
  public SET_NOMORGANIZATII(porganizatii: iOrganizatie[]) {
    this.NomOrganizatii = JSON.parse(JSON.stringify(porganizatii));
    this.nomOrgIsOK=true;
  }
  @Action
  public set_nomorganizatii(porganizatii: iOrganizatie[]) {
    this.context.commit('SET_NOMORGANIZATII', porganizatii);
  }
}
