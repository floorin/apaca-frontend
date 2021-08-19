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
import iOrganizatie from '@/types/iOrganizatie';
import {ServicesNomUsers} from '@/modules/ServicesNomUsers';
import user from '@/store/user';

//const EditNomCateg = () => import('@/components/EditNomCateg/EditNomCateg.vue').then(m => m.default)
interface iOptionUser{
  userid:string,
  name: string,
}
interface iOptTipDoc{
  id_tip_document: string,
  den_lang_1: string
}
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
  deponent_userid:string|null,
  repartizat_la:string|null,
  tip_organizatie_repartizata:string|null
}

// @ts-ignore
@Component({components: {TableDocuments, ComboDepartamente}
})
export default class Search extends Vue {
  public filter: string = '';
  public ajaxSearchingDocs: boolean = false;
  public viewDialogSelectDepartament:boolean = false;
  public denRepartizatLa:string='';
  public optionsUsers:iOptionUser[]=[];
  public allUsers:iOptionUser[]=[];
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
    deponent_userid:null,
    repartizat_la:null,
    tip_organizatie_repartizata:null
  }
  public $refs: any;
  public storeNomenclatoare = getModule(nomenclatoare);
  public userStore=getModule(user);

  constructor() {
    super();
    this.myLocale=CONFIG_ENV.myLocale;
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
    this.searchParams.deponent_userid=null;
    this.searchParams.repartizat_la=null;
    this.searchParams.tip_organizatie_repartizata=null;
    this.denRepartizatLa='';
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

  public filterFnUsers(val:any, update:any) {
    if (val === '') {
      update(() => {
        this.optionsUsers = this.allUsers
      })
      return
    }

    update(() => {
      const needle = val.toLowerCase()
      this.optionsUsers = this.allUsers.filter(v => v.name.toLowerCase().indexOf(needle) > -1)
    })
  }

  public resetTipDoc(){
    this.searchParams.id_tip_document = null;
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
  public get visibleResetBtn(){
    return  this.searchParams.id_registru || this.searchParams.id_categ || this.searchParams.id_tip_document || this.searchParams.id_tip_inregistrare || this.searchParams.expeditor_denumire || this.searchParams.expeditor_cui || this.searchParams.data_start || this.searchParams.data_end || this.searchParams.keywords || this.searchParams.userid || this.searchParams.deponent_userid || this.searchParams.repartizat_la;
  }

  public get filteredOptionTipDoc(): { id_tip_document: number; den_lang_1: string }[] {
    const vueInst = this;
    const filtered=vueInst.storeNomenclatoare.NomTipDoc.filter((ptipdoc)=>{
      return ptipdoc.id_categ == vueInst.searchParams.id_categ && ptipdoc.activ=='y';
    });
    const  result = filtered.map((ptipDoc:iNomTipDoc)=>{
      return {
        id_tip_document:ptipDoc.id_tip_doc,
        den_lang_1:ptipDoc.den_lang_1
      }
    } );
    return result;
  }

  public getDocuments(){
    const vueInst = this;
    vueInst.ajaxSearchingDocs=true;
  }

  public mounted() {
    const vueInst = this;
    vueInst.storeNomenclatoare.set_currentpagetitle('Cautare');
  }

  public created() {
    const vueInst = this;

    ServicesNomUsers.getNomUsers().then((presponse) => {
      if (presponse.status === 'success') {
        presponse.rows.forEach(puser => {
          vueInst.allUsers.push({
            userid: puser.userid,
            name: puser.last_name + ' ' + puser.first_name
          });
        })
      }
    });
  }
}
