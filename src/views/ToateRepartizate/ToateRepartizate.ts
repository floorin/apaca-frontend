import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import iNomCateg from '@/types/iNomCateg';
import iNomTipDoc from '@/types/iNomTipDoc';
import nomenclatoare from '@/store/nomenclatoare';
import {getModule} from 'vuex-module-decorators';
import iNomRegistru from '@/types/iNomCateg';
import iLabelValue from '@/types/iLabelValue';
import TableDocuments from '@/components/TableDocuments/TableDocuments.vue';
import ComboDepartamente from '@/components/ComboDepartamente/ComboDepartamente.vue'
import {CONFIG_ENV} from '@/config';
import axios, {AxiosResponse} from 'axios';
import iOrganizatie from '@/types/iOrganizatie';
//const EditNomCateg = () => import('@/components/EditNomCateg/EditNomCateg.vue').then(m => m.default)

interface ISearchParams {
  id_registru:number|null,
  id_categ:number|null,
  id_tip_document:number|null,
  id_tip_inregistrare:string|null,
  expeditor_denumire:string|null,
  expeditor_cui:string|null,
  data_start:string|null,
  data_end:string|null,
  keywords:string|null,
  userid:string|null,
  repartizat_la:string|null,
  tip_organizatie_repartizata:string|null
}

// @ts-ignore
@Component({components: {TableDocuments,ComboDepartamente}
})
export default class ToateRepartizate extends Vue {
  public filter: string = '';
  public ajaxSearchingDocs: boolean = false;
  public visibleGetXlsBtn:boolean = false;
  public viewDialogSelectDepartament: boolean = false;
  public denRepartizatLa: string = '';
  public myLocale: any;
  public myPagination:any={
    rowsPerPage:10
  }
  public visibleColumns: string[] = [ 'id_tip_doc', 'den_lang_1', 'den_lang_2', 'den_categ'];
  public  columns: any = [
    { name: 'appid', label: 'appid', field: 'appid' },
    { name: 'id_tip_doc', label: 'Id', field: 'id_tip_doc', align: 'left', sortable: true },
    { name: 'den_lang_1', label: 'Denumnire romana', field: 'den_lang_1', sortable: true, align: 'left' },
    { name: 'den_lang_2', label: 'Denumire maghiara', field: 'den_lang_2', sortable: true, align: 'left' },
    { name: 'den_categ', label: 'Categorie', field: 'den_categ', sortable: true, align: 'left' }
  ];
  public searchParams:ISearchParams = {
    id_registru:null,
    id_categ:null,
    id_tip_document:null,
    id_tip_inregistrare:null,
    expeditor_denumire:null,
    expeditor_cui:null,
    data_start:null,
    data_end:null,
    keywords:null,
    userid:null,
    repartizat_la:null,
    tip_organizatie_repartizata:null
  }
  public $refs: any;
  public storeNomenclatoare = getModule(nomenclatoare);
  // private userStore=getModule(User);

  constructor() {
    super();
    this.myLocale=CONFIG_ENV.myLocale;
  }
  public get optionsTipInregistare(): iLabelValue[] {
    return this.storeNomenclatoare.NomTipInregistrare;
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
      return pregistru.activ=='y';
    })
  }

  public resetTipDoc(){
    this.searchParams.id_tip_document = null;
  }

  public get filteredOptionTipDoc(): iNomTipDoc[] {
    const vueInst = this;
    return JSON.parse(JSON.stringify(vueInst.storeNomenclatoare.NomTipDoc.filter((ptipdoc)=>{
      return ptipdoc.id_categ == vueInst.searchParams.id_categ && ptipdoc.activ=='y';
    })));
  }

  public selectDepartament(organizatie: iOrganizatie){
    this.denRepartizatLa=organizatie.departament;
    this.searchParams.tip_organizatie_repartizata='departament';
    this.searchParams.repartizat_la=organizatie.appid.toString();
    this.viewDialogSelectDepartament=false;
  }

  public selectDivizie(organizatie: iOrganizatie){
    this.denRepartizatLa=organizatie.divizie;
    this.searchParams.tip_organizatie_repartizata='divizie';
    this.searchParams.repartizat_la=organizatie.appid_divizie.toString();
    this.viewDialogSelectDepartament=false;
  }


 public getXls(){
	const vueInst = this;
	vueInst.ajaxSearchingDocs=true;
     axios.post(`${CONFIG_ENV.URL_REPORTS.getXlsByConditions}`,
       {
         reportType:'repartizatele',
         searchParams: vueInst.searchParams
       },
       {
         headers: {
           'Content-Type': 'application/json',
           'Accept': 'pplication/vnd.ms-excel'
         },
         responseType: 'blob'
       }).then((response: AxiosResponse) => {
       const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
       const objectUrl = window.URL.createObjectURL(blob)
       //window.open(objectUrl)
       const link = document.createElement('a');
       link.href = objectUrl;
       link.setAttribute('download', 'file.xlsx'); //or any other extension
       document.body.appendChild(link);
       link.click();
       link.remove();
       vueInst.ajaxSearchingDocs=false;
     }).catch((error: any) => { alert(error) })
 }

  public getPdf(){
    const vueInst = this;
    vueInst.ajaxSearchingDocs=true;
    axios.post(`${CONFIG_ENV.URL_REPORTS.getPdfByConditions}`,
      {
        reportType:'repartizatele',
        searchParams: vueInst.searchParams
      },
      {
        headers: {
          'Content-Type': 'application/pdf',
          'Accept': 'pplication/pdf'
        },
        responseType: 'blob'
      }).then((response: AxiosResponse) => {
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const objectUrl = window.URL.createObjectURL(blob)
      //window.open(objectUrl)
      const link = document.createElement('a');
      link.href = objectUrl;
      link.setAttribute('download', 'file.pdf'); //or any other extension
      document.body.appendChild(link);
      link.click();
      link.remove();
      vueInst.ajaxSearchingDocs=false;
    }).catch((error: any) => { alert(error) })
  }

  public onEventFromMyDocuments(params:any){
    const vueInst = this;
    //console.log('in Dashboards.ts onEventFromMyDocuments with params=%o',params)
    switch (params.action) {
      case 'updateNrOfMyDocuments' : if(params.value*1>0){vueInst.visibleGetXlsBtn=true;}else{vueInst.visibleGetXlsBtn=false;}
        break;
    }
  }

  public get visibleResetBtn(){
    return  this.searchParams.id_registru || this.searchParams.id_categ || this.searchParams.id_tip_document || this.searchParams.id_tip_inregistrare || this.searchParams.expeditor_denumire || this.searchParams.expeditor_cui || this.searchParams.data_start || this.searchParams.data_end || this.searchParams.keywords || this.searchParams.userid || this.searchParams.repartizat_la;
  }

  public resetSearchParams() {
    this.searchParams.id_registru=null;
    this.searchParams.id_categ=null;
    this.searchParams.id_tip_document=null;
    this.searchParams.id_tip_inregistrare=null;
    this.searchParams.expeditor_denumire=null;
    this.searchParams.expeditor_cui=null;
    this.searchParams.data_start=null;
    this.searchParams.data_end=null;
    this.searchParams.keywords=null;
    this.searchParams.userid=null;
    this.searchParams.repartizat_la=null;
    this.searchParams.tip_organizatie_repartizata=null;
    this.denRepartizatLa='';
  }

  public getDocuments(){
    const vueInst = this;
    vueInst.ajaxSearchingDocs=true;
  }

  public created() {
    const vueInst = this;
    this.storeNomenclatoare.set_currentpagetitle('Toate documentele repartizate');
  }


}
