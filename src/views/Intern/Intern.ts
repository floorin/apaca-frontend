import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import { getModule} from 'vuex-module-decorators';
import axios, {AxiosPromise} from 'axios';
import {CONFIG_ENV} from '@/config';
import nomenclatoare from '@/store/nomenclatoare';
import iDocumentIntrare from '@/types/iDocumentIntrare';
import iNomCateg from '@/types/iNomCateg';
import iNomTipDoc from '@/types/iNomTipDoc';
import iNomRegistru from '@/types/iNomRegistru';
import iSolicitant from '@/types/iSolicitant';
import iLabelValue from '@/types/iLabelValue';
import iOrganizatie from '@/types/iOrganizatie';
import {ServicesDocument} from '@/modules/ServicesDocument';
import {ServicesSearch} from '@/modules/ServicesSearch';
import ComboDepartamente from '@/components/ComboDepartamente/ComboDepartamente.vue'
import ComboUser from '@/components/ComboUser/ComboUser.vue'

import {extend} from 'quasar';
type OrNull<T> = { [K in keyof T]: T[K] | null }
type IDocumentIntrare = OrNull<iDocumentIntrare>;

interface IDocumentIntrareRepartizare extends IDocumentIntrare{
  den_org_initiator:string|null,
  den_org_destinatar:string|null,
  id_org_expeditor:number|null,
  marca_user_deponent:number|null,
  den_user_deponent:string|null
}

interface iPersoanaUtilizatoare{
  marca:number,
  firstName:string,
  lastName:string,
  functie:string
}

@Component({components: {ComboDepartamente,ComboUser}})
export default class Intern extends Vue {
  public docApp: IDocumentIntrareRepartizare;
  public myLocale: any;
  public existaReferinta: boolean=false;
  public lastSearchTextForOption:string = '';
  public savingDocument: boolean=false;
  public $refs: any;
  public auTrecut2SecundeDeLaUltimulSearch: boolean = false;
  public optionsSolicitanti: iSolicitant[] = [];
  public optionsOrganizatii: iOrganizatie[] = [];
  public storeNomenclatoare = getModule(nomenclatoare);
  public viewDialogSelectDepartamentInitiator:boolean = false;
  public viewDialogSelectDepartamentDestinatar:boolean = false;
  public viewDialogSelectUserDeponent:boolean = false;
  // private userStore=getModule(User);

  constructor() {
    super();
    this.myLocale=CONFIG_ENV.myLocale;
    this.docApp = {
      id_registru: null,
      id_categ: null,
      id_tip_document: null,
      id_doc: null,
      data_doc: null,
      categorie_solicitant: null,
      nume_denumire: null,
      cui: null,
      titlu: null,
      descriere: null,
      nr_inreg: null,
      data_inreg: null,
      nr_file: null,
      este_confidential: null,
      ref_nr_doc: null,
      ref_data_doc: null,
      ref_id_registru: null,
      track_creation_date: null,
      id_org_destinatar_init: null,
      id_org_destinatar_curent: null,
      den_org_initiator: null,
      den_org_destinatar: null,
      id_org_expeditor:null,
      marca_user_deponent:null,
      den_user_deponent:null
    }
  }

public onSubmit() {
    const vueInst=this;
    vueInst.savingDocument=true;
    ServicesDocument.postDocumentIntern(vueInst.docApp).then((presponse)=>{
      vueInst.savingDocument=false;
      if(presponse.status==='success'){
        vueInst.$q.notify({
          color: 'teal',
          textColor: 'white',
          type: 'positive',
          message: presponse.message,
          position: 'top',
          timeout: 1500,
        });
        vueInst.$router.push({name: 'SecondStepDocumentIntrare',params:{appid:presponse.appid.toString()}});
      }
    });
  }

public resetDoc() {
  this.docApp = {
    id_registru: null,
    id_categ: null,
    id_tip_document: null,
    id_doc: null,
    data_doc: null,
    categorie_solicitant: null,
    nume_denumire: null,
    cui: null,
    titlu:null,
    descriere:null,
    nr_inreg:null,
    data_inreg: null,
    nr_file: 0,
    este_confidential: false,
    ref_nr_doc: null,
    ref_data_doc: null,
    ref_id_registru: null,
    track_creation_date: null,
    id_org_destinatar_init: null,
    id_org_destinatar_curent:null,
    den_org_initiator: '',
    den_org_destinatar: '',
    id_org_expeditor:null,
    marca_user_deponent:null,
    den_user_deponent:null
  }
}

public doNothing(){}

public focusOnCui(){
  this.$refs.refCui.focus();
}

public focusOnTitlu(){
    this.$refs.refTitlu.focus();
}

public focusOnDescriere(){
  this.$refs.refDescriere.focus();
}

public selectSolicitantFromOption(solicitant: iSolicitant){
  const vueInst = this;
  vueInst.docApp.categorie_solicitant=solicitant.tip_solicitant;
  vueInst.docApp.cui=solicitant.cui;
  vueInst.docApp.nume_denumire=solicitant.nume_denumire;
  this.$refs.refOptionsNumePrenume.hide();
}

public getOptionsSolicitanti(psearchText:string){
  const vueInst = this;
  //console.log('getOptionsSolicitanti with psearchText=%o and lastSearchTextForOption=%o',psearchText, vueInst.lastSearchTextForOption)
  ServicesSearch.optionsSolicitanti(psearchText).then(presponse=>{
    if(presponse.status=='success'){
      vueInst.lastSearchTextForOption=psearchText;
      vueInst.optionsSolicitanti=presponse.rows.map(item=>{
        return {
          cui: ('nocui'===item.cui.substr(0,5)?'':item.cui),
          nume_denumire: item.nume_denumire,
          tip_solicitant: item.tip_solicitant
        }
      });
      setTimeout(()=>{ vueInst.auTrecut2SecundeDeLaUltimulSearch=true; if(vueInst.optionsSolicitanti.length==0){vueInst.$refs.refOptionsNumePrenume.hide();}}, 200);
    }
  });
}

  public inputNumePrenume(pval:string){
    const vueInst = this;
    const lungimeMinima=Math.min(vueInst.lastSearchTextForOption.length,pval.length);
    if(vueInst.optionsSolicitanti.length==0  &&
      vueInst.lastSearchTextForOption.substr(0,lungimeMinima)==pval.substr(0,lungimeMinima)
      && lungimeMinima>0
    ){
      // tslint:disable-next-line:no-unused-expression
      null;
    }
    else{
      vueInst.$refs.refOptionsNumePrenume.show();
      vueInst.auTrecut2SecundeDeLaUltimulSearch=false;
      vueInst.getOptionsSolicitanti(pval);
    }
  }

  public putFocusBackToNumePrenume(){
    this.$refs.refNumePrenume.focus();
  }

  public getOptionsOrganizatii(psearchText:string){
    const vueInst = this;
    ServicesSearch.optionsOrganizatii(psearchText).then(presponse=>{
      if(presponse.status=='success'){
        vueInst.lastSearchTextForOption=psearchText;
        vueInst.optionsOrganizatii=presponse.rows;
        setTimeout(()=>{ vueInst.auTrecut2SecundeDeLaUltimulSearch=true; if(vueInst.optionsOrganizatii.length==0){vueInst.$refs.refOrgRepartizare.hide();}}, 2000);
      }
    });
  }

  public inputOrgInitiator(pval:string){
    this.viewDialogSelectDepartamentInitiator=true;
  }

  public inputUserDeponent(pval:string){
    this.viewDialogSelectUserDeponent=true;
  }

  public inputOrgDestinatar(pval:string){
    this.viewDialogSelectDepartamentDestinatar=true;
  }

  public putFocusBackToOrgInitiator(){
    this.$refs.refOrgInitiator.focus();
  }

  public putFocusBackToOrgDestinatar(){
    this.$refs.refOrgDestinatar.focus();
  }

  public selectDepartamentInitiator(organizatie: iOrganizatie){
    const vueInst = this;
    vueInst.docApp.id_org_expeditor=organizatie.appid;
    vueInst.docApp.den_org_initiator=organizatie.divizie+' / '+organizatie.departament;
    vueInst.viewDialogSelectDepartamentInitiator=false;
  }

  public selectUserDeponent(persoanaUtilizatoare: iPersoanaUtilizatoare){
    const vueInst = this;
    vueInst.docApp.marca_user_deponent=persoanaUtilizatoare.marca;
    vueInst.docApp.den_user_deponent=persoanaUtilizatoare.firstName+' '+persoanaUtilizatoare.lastName;
    vueInst.viewDialogSelectUserDeponent=false;
  }


  public selectDepartamentDestinatar(organizatie: iOrganizatie){
    const vueInst = this;
    vueInst.docApp.id_org_destinatar_init=organizatie.appid;
    vueInst.docApp.den_org_destinatar=organizatie.divizie+' / '+organizatie.departament;
    vueInst.viewDialogSelectDepartamentDestinatar=false;
  }

  public resetTipDoc(){
    this.docApp.id_tip_document = null;
  }

  public get optionsCategorii(): iNomCateg[] {
    const categoriiActive=this.storeNomenclatoare.NomCategorii.filter(pcategorie=>{
      return pcategorie.activ=='y'
    })
    return categoriiActive;
  }

  public get optionsTipDoc(): iNomTipDoc[] {
    const onlyActiveTipDoc=this.storeNomenclatoare.NomTipDoc.filter(
      pTipDoc=>{
        return pTipDoc.activ=='y';
      }
    );
    return onlyActiveTipDoc;
  }

  public get optionsRegistre(): iNomRegistru[] {
    // @ts-ignore
    return this.storeNomenclatoare.NomRegistre.filter((pregistru:iNomRegistru)=>{
      return pregistru.activ=='y' && pregistru.grantedForUser=='y' ;
    })
  }

  public get filteredOptionTipDoc(): iNomTipDoc[] {
    const vueInst = this;
    return JSON.parse(JSON.stringify(vueInst.storeNomenclatoare.NomTipDoc.filter((ptipdoc)=>{
      // tslint:disable-next-line:triple-equals
      return ptipdoc.id_categ == vueInst.docApp.id_categ && ptipdoc.activ=='y';
    })));
  }

  public get optionsTipSolicitant(): iLabelValue[] {
    return JSON.parse(JSON.stringify(this.storeNomenclatoare.NomCategSolicitant));
  }

public onReset() {
  this.resetDoc();
  }

  public mounted() {
    const vueInst = this;
    vueInst.storeNomenclatoare.set_currentpagetitle('Inregistrare document corespondenta interna');
  }
}
