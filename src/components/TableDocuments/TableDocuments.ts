import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import { getModule} from 'vuex-module-decorators';
import moment from 'moment';
import DialogOpenScan from '@/components/DialogOpenScan/DialogOpenScan.vue';
import nomenclatoare from '@/store/nomenclatoare';
import user from '@/store/user';
import iDocument from '@/types/iDocument';
import {dateToStringDDMonYYYY} from '@/modules/utils';
import {humanReadableBytes} from '@/modules/utils';
import {ServicesDocument} from '@/modules/ServicesDocument';
type OrNull<T> = { [K in keyof T]: T[K] | null }
type IDocument = OrNull<iDocument>;
import {debounce} from 'quasar';
interface IDocumentComplet extends IDocument{
  den_registru:string
}

@Component({components: {DialogOpenScan}})
export default class TableDocuments extends Vue {
  @Prop({default: 'my_documents'}) public readonly accesFrom!: string;
  @Prop({default: {}}) public readonly searchParams!: any;
  @Prop({default: false}) public readonly withSearchInput!: boolean;

  public filter: string = '';
  public $refs: any;
  public loadingData: boolean = false;
  public tableDataMyDocuments: IDocumentComplet[] = [];
  public storeNomenclatoare = getModule(nomenclatoare);
  public userStore=getModule(user);
  public currentPage:number=1;
  public totalNumberOfPages:number=1;
  //public myPagination:any={rowsPerPage:10}
  public visibleColumns: string[] = [ 'id_doc', 'data_doc', 'den_registru', 'id_tip_document', 'tip_request', 'nume_denumire', 'repartizari', 'titlu', 'scans', 'appid'];
  public  columns: any = [
    { name: 'appid', label: '', field: 'appid', align: 'center',  classes: 'bg-grey-1', style: 'max-width: 30px',headerStyle: 'max-width: 30px' },
    { name: 'id_doc', label: 'Numar', field: 'id_doc', align: 'center', sortable: true, sort: (a: string, b: string) => parseInt(a, 10) - parseInt(b, 10) , style: 'max-width: 50px',headerStyle: 'max-width: 50px',classes: 'bg-grey-1'},
    { name: 'data_doc', label: 'Data document', field: 'data_doc', align: 'left', sortable: true , classes: 'bg-grey-1', style: 'max-width: 90px',headerStyle: 'max-width: 90px' },
    { name: 'den_registru', label: 'Registru', field: 'den_registru', align: 'center', sortable: true },
    { name: 'id_tip_document', label: 'Tip document', field: 'id_tip_document', align: 'left', sortable: true },
    { name: 'tip_request', label: 'Tip corespondenta', field: 'tip_request', align: 'left', sortable: true },
    { name: 'nume_denumire', label: 'Denumire solicitant', field: 'nume_denumire', align: 'left', sortable: true },
    { name: 'repartizari', label: 'Repartizari', field: 'scans', align: 'left' },
    { name: 'titlu', label: 'Titlu', field: 'titlu', align: 'left' },
    { name: 'scans', label: 'Documente atasate', field: 'scans', align: 'left' }
  ];

  public getDocuments=debounce(function(){
    // @ts-ignore
    const vueInst = this;
    vueInst.tableDataMyDocuments=[];
    ServicesDocument.getDocuments(vueInst.accesFrom,vueInst.searchParams).then(presponse =>{
      vueInst.loadingData=false;
      if(presponse.status == 'success'){
        presponse.rows.forEach(pdocument=>{
          vueInst.tableDataMyDocuments.push(
            {
              appid: pdocument.appid,
              id_registru: pdocument.id_registru,
              id_categ: pdocument.id_categ,
              id_tip_document: pdocument.id_tip_document,
              id_doc: pdocument.id_doc,
              data_doc: pdocument.data_doc,
              tip_request: pdocument.tip_request,
              categorie_solicitant: pdocument.categorie_solicitant,
              nume_denumire: pdocument.nume_denumire,
              cui: pdocument.cui,
              titlu: pdocument.titlu,
              descriere: '',
              nr_inreg: '',
              data_inreg: '',
              nr_file: null,
              este_confidential: null,
              ref_nr_doc: '',
              ref_data_doc: '',
              ref_id_registru: '',
              id_org_destinatar_init: null,
              id_org_destinatar_curent: null,
              track_creation_date: pdocument.track_creation_date,
              den_registru:vueInst.getDenRegistru(pdocument.id_registru),
              scans:pdocument.scans,
              repartizari:pdocument.repartizari
            }
          )
        });
        vueInst.$emit('MyDocuments', {action:'updateNrOfMyDocuments',value:vueInst.tableDataMyDocuments.length})
      }
    })
  },1000)

  constructor() {
    super();
  }

  public getPageWithDocuments(pageNumberToGet:number){
    const vueInst = this;
    const nrRanduriTabel=Number(localStorage.getItem("nrRanduriTabel"));
    vueInst.loadingData=true;
    ServicesDocument.getPageWithDocuments(nrRanduriTabel,pageNumberToGet,vueInst.accesFrom,vueInst.searchParams).then(presponse =>{
      vueInst.loadingData=false;
      vueInst.tableDataMyDocuments=[];
      if(presponse.status == 'success'){
        vueInst.totalNumberOfPages=presponse.totalNrOfPages;
        presponse.rows.forEach(pdocument=>{
          vueInst.tableDataMyDocuments.push(
            {
              appid: pdocument.appid,
              id_registru: pdocument.id_registru,
              id_categ: pdocument.id_categ,
              id_tip_document: pdocument.id_tip_document,
              id_doc: pdocument.id_doc,
              data_doc: pdocument.data_doc,
              tip_request: pdocument.tip_request,
              categorie_solicitant: pdocument.categorie_solicitant,
              nume_denumire: pdocument.nume_denumire,
              cui: pdocument.cui,
              titlu: pdocument.titlu,
              descriere: '',
              nr_inreg: '',
              data_inreg: '',
              nr_file: null,
              este_confidential: null,
              ref_nr_doc: '',
              ref_data_doc: '',
              ref_id_registru: '',
              id_org_destinatar_init: null,
              id_org_destinatar_curent: null,
              track_creation_date: pdocument.track_creation_date,
              den_registru:vueInst.getDenRegistru(pdocument.id_registru),
              scans:pdocument.scans,
              repartizari:pdocument.repartizari
            }
          )
        });
        vueInst.$emit('MyDocuments', {action:'updateNrOfMyDocuments',value:vueInst.tableDataMyDocuments.length})
      }
    })
  }

  public tryToGetPageWithDocument(pageNumberToGet:number){
      // @ts-ignore
      this.getPageWithDocuments(pageNumberToGet);
  }

  public openWorkOnDocument(pdocument: iDocument){
    const vueInst = this;
    // @ts-ignore
    vueInst.$eventHub.$emit('eventToOpenDocument', {action:'openDocument',appid:pdocument.appid,with_finalize_register_document:'no', with_repartizare_buton:'no'})
  }

  public humanReadableBytes(nrPfBytes:number): string{
    return humanReadableBytes(nrPfBytes);
  }

  public displayDataDoc(pdata:string) :string{
    const vueInst=this;
    if(pdata){
      const day =moment(pdata.substr(0,10), 'YYYY-MM-DD');
      return dateToStringDDMonYYYY(day);
    }else { return '';}
  }

  public getDenTipDocument(pIdTipDoc: number): string{
    const vueInst=this;
    let result='';
    const TipDoc = vueInst.storeNomenclatoare.NomTipDoc.find( tipdoc =>{
      return tipdoc.id_tip_doc == pIdTipDoc;
    });
    if(TipDoc){
      result=TipDoc.den_lang_1;
    }
    return result;
  }

  public getDenRegistru(pIdRegistru: number): string{
    const vueInst=this;
    let result='';
    const Registru = vueInst.storeNomenclatoare.NomRegistre.find( registru =>{
      return registru.id_registru == pIdRegistru;
    });
    if(Registru){
      result=Registru.den_registru_lang_1;
    }
    return result;
  }

  @Watch('searchParams', { immediate: true, deep: true})
  public onSearchParamsChanged(newSearchParams:any, oldSearchParams:any ){
    this.getPageWithDocuments(1);
    //this.getDocuments()
    //this.tryToGetPageWithDocument(1);
    // @ts-ignore
    //debounce(this.getPageWithDocuments(1), 1000);
    //debounce(this.getDocuments(), 1000);
  }

  public created() {
    const vueInst = this;
    this.getPageWithDocuments = debounce(this.getPageWithDocuments, 500)
    if(vueInst.accesFrom=='toateRepartizatele') {
// @ts-ignore
      vueInst.$eventHub.$on('eventStergereRepartizareDocument', (params: any) => {
         //console.log('in TableDocuments.ts eventStergereRepartizareDocument with params=%o', params);
        if (params.appid && params.appid.toString().length > 0) {
          vueInst.tableDataMyDocuments.find((pdocument, pindex) => {
            if (pdocument.appid == params.appid) {
              vueInst.tableDataMyDocuments.splice(pindex, 1);
            }
          })
        }
      });
    }

/*    if(1*vueInst.userStore.ScreenHeight<900) {
      vueInst.myPagination.rowsPerPage=10;
    }else{
      if(vueInst.accesFrom!=="search" && vueInst.accesFrom!="toateRepartizatele"){
        vueInst.myPagination.rowsPerPage=15;
        if(1*vueInst.userStore.ScreenHeight>1000){
          vueInst.myPagination.rowsPerPage=20;
        }
      }
    }*/

  }

  public beforeDestroy() {
    if(this.accesFrom=='toateRepartizatele') {
      // @ts-ignore
      this.$eventHub.$off('eventCloseDrawerWithDocument');
    }
  }
}
