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
import {ValidateEmail} from '@/modules/utils';
import ComboDepartamente from '@/components/ComboDepartamente/ComboDepartamente.vue'
import {extend} from 'quasar';
type OrNull<T> = { [K in keyof T]: T[K] | null }
type IDocumentIntrare = OrNull<iDocumentIntrare>;

interface IDocumentIntrareRepartizare extends IDocumentIntrare{
  den_org_init:string|null,
  email_solicitant:string|null
}

@Component({components: {ComboDepartamente}})
export default class Intrare extends Vue {
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
  public viewDialogSelectDepartament:boolean = false;
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
      email_solicitant:null,
      este_confidential: null,
      ref_nr_doc: null,
      ref_data_doc: null,
      ref_id_registru: null,
      track_creation_date: null,
      id_org_destinatar_init: null,
      id_org_destinatar_curent: null,
      den_org_init: null
    }
  }


public onSubmit() {
    const vueInst=this;
    vueInst.savingDocument=true;
    ServicesDocument.postDocumentIntrare(vueInst.docApp).then((presponse)=>{
      vueInst.savingDocument=false;
      if(presponse.status==='success'){
        vueInst.$q.notify({
          color: 'teal',
          textColor: 'white',
          type: 'positive',
          message: presponse.message,
          position: 'top-right',
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
    email_solicitant:null,
    este_confidential: false,
    ref_nr_doc: null,
    ref_data_doc: null,
    ref_id_registru: null,
    track_creation_date: null,
    id_org_destinatar_init: null,
    id_org_destinatar_curent:null,
    den_org_init: ''
  }
}

public doNothing(){}

public focusOnCui(){
  this.$refs.refCui.focus();
}

public focusOnTitlu(){
    this.$refs.refTitlu.focus();
}

public focusOnEmail(){
  this.$refs.refEmailSolicitant.focus();
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
      setTimeout(()=>{ vueInst.auTrecut2SecundeDeLaUltimulSearch=true; if(vueInst.optionsSolicitanti.length==0){vueInst.$refs.refOptionsNumePrenume.hide();}}, 1000);
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
      vueInst.$refs.refOptionsNumePrenume.hide();
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
/*    ServicesSearch.optionsOrganizatii(psearchText).then(presponse=>{
      if(presponse.status=='success'){
        vueInst.lastSearchTextForOption=psearchText;
        vueInst.optionsOrganizatii=presponse.rows;
        setTimeout(()=>{ vueInst.auTrecut2SecundeDeLaUltimulSearch=true; if(vueInst.optionsOrganizatii.length==0){vueInst.$refs.refOrgRepartizare.hide();}}, 2000);
      }
    });*/
    vueInst.optionsOrganizatii=vueInst.storeNomenclatoare.NomOrganizatii.filter(porg=>porg.departament.indexOf(psearchText.toUpperCase())!==-1);
    setTimeout(()=>{ vueInst.auTrecut2SecundeDeLaUltimulSearch=true;}, 300);
  }

  public inputOrgRepartizare(pval:string){
    this.viewDialogSelectDepartament=true;
  }

  public selectDepartament(organizatie: iOrganizatie){
    const vueInst = this;
    vueInst.docApp.id_org_destinatar_init=organizatie.appid;
    vueInst.docApp.den_org_init=organizatie.divizie+' / '+organizatie.departament;
    vueInst.viewDialogSelectDepartament=false;
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

  public ValidateEmail(pEmail:string):boolean{
    return ValidateEmail(pEmail);
  }

  public mounted() {
    const vueInst = this;
    vueInst.storeNomenclatoare.set_currentpagetitle('Inregistrare document corespondenta tip intrare');
  }
}


