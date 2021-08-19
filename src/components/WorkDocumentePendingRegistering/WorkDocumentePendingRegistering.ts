import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import { getModule} from 'vuex-module-decorators';
import moment from 'moment';
import {CONFIG_ENV} from '@/config';
import nomenclatoare from '@/store/nomenclatoare';
import user from '@/store/user';
import iDocument from '@/types/iDocument';
import iScan from '@/types/iScan';
import {dateToStringDDMonYYYY} from '@/modules/utils';
import {humanReadableBytes} from '@/modules/utils';
import {ServicesDocument} from '@/modules/ServicesDocument';
import {ServicesScans} from '@/modules/ServicesScans';
import DialogOpenScan from '@/components/DialogOpenScan/DialogOpenScan.vue';
type OrNull<T> = { [K in keyof T]: T[K] | null }
type IDocument = OrNull<iDocument>;

interface IDocumentComplet extends IDocument{
  den_registru:string
}

@Component({components: {DialogOpenScan}})
export default class WorkDocumentePendingRegistering extends Vue {
  @Prop() public fWorkDocumentePendingRegistering!: ()=>void;

  public taburi: string='documente_repartizate';
  public filter: string = '';
  public $refs: any;
  public loadingData: boolean = false;
  public showPreviewFileDialog: boolean =false;
  public tableDataMyDocuments: IDocumentComplet[] = [];
  public storeNomenclatoare = getModule(nomenclatoare);
  public userStore=getModule(user);
  public myPagination:any={
    rowsPerPage:10
  }
  public visibleColumns: string[] = [ 'id_doc', 'track_creation_date', 'den_registru', 'id_tip_document', 'tip_request', 'nume_denumire', 'scans', 'appid'];
  public  columns: any = [
    { name: 'appid', label: '', field: 'appid', align: 'right',  classes: 'bg-grey-1', style: 'max-width: 35px',headerStyle: 'max-width: 35px' },
    { name: 'id_doc', label: 'Numar', field: 'id_doc', align: 'center', sortable: true, sort: (a: string, b: string) => parseInt(a, 10) - parseInt(b, 10) , style: 'max-width: 70px',headerStyle: 'max-width: 70px',classes: 'bg-grey-1'},
    { name: 'track_creation_date', label: '/ Data document', field: 'track_creation_date', align: 'left', sortable: true, classes: 'bg-grey-1', style: 'max-width: 100px',headerStyle: 'max-width: 100px' },
    { name: 'den_registru', label: 'Registru', field: 'den_registru', align: 'left', sortable: true },
    { name: 'id_tip_document', label: 'Tip document', field: 'id_tip_document', align: 'left', sortable: true },
    { name: 'tip_request', label: 'Tip corespondenta', field: 'tip_request', align: 'left', sortable: true },
    { name: 'nume_denumire', label: 'Denumire solicitant', field: 'nume_denumire', align: 'left', sortable: true },
    { name: 'scans', label: 'Documente atasate', field: 'scans', align: 'left' }
  ];

  constructor() {
    super();
  }

  public openWorkOnDocument(pdocument: iDocument){
    const vueInst = this;
// @ts-ignore
    vueInst.$eventHub.$emit('eventToOpenDocument', {action:'openDocument',appid:pdocument.appid,with_finalize_register_document:'yes', with_repartizare_buton:'no'})
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

  public getMyDocumentWithNoScan(){
    const vueInst = this;
    vueInst.tableDataMyDocuments=[];
    ServicesDocument.getMyDocumentsWithNoScan().then(presponse =>{
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
              tip_request: pdocument.tip_request,
              data_doc: pdocument.data_doc,
              categorie_solicitant: pdocument.categorie_solicitant,
              nume_denumire: pdocument.nume_denumire,
              cui: pdocument.cui,
              titlu: '',
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
              repartizari:[]
            }
          )
        });
        this.$emit('MyDocuments', {action:'updateNrOfPendingRegistering',value:vueInst.tableDataMyDocuments.length})
      }
    })
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

  public mounted() {
    this.loadingData=true;
    this.storeNomenclatoare.set_currentpagetitle('Documente fara atasament');
    this.getMyDocumentWithNoScan();
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

  public created(): void {
    const vueInst = this;
    if(1*vueInst.userStore.ScreenHeight<900) {
      vueInst.myPagination.rowsPerPage=10;
    }else{
      vueInst.myPagination.rowsPerPage=15;
      if(1*vueInst.userStore.ScreenHeight>1000){
        vueInst.myPagination.rowsPerPage=20;
      }
    }

    //@ts-ignore
    vueInst.$eventHub.$on('eventFromChildComponentToPendingGrid', (params: any) => {
      //console.log('in WorkDocumentePendingRegistering.ts FinalizatInregistrareDocument with params=%o', params);
      switch (params.action) {
        case 'FinalizatInregistrareDocument':
              vueInst.tableDataMyDocuments.forEach(
                (pdocument,pindex)=>{
                  if(pdocument.appid==params.appid){
                    vueInst.tableDataMyDocuments.splice(pindex,1);
                  }
                }
              );
          break;
        case 'IncarcatScanLaDocumentAppid':
          vueInst.tableDataMyDocuments.forEach(
            (pdocument,pindex)=>{
              if(pdocument.appid==params.appid){
                ServicesScans.getScans(params.appid).then(
                  presponse=>{
                    vueInst.tableDataMyDocuments[pindex].scans=JSON.parse(JSON.stringify(presponse.rows));
                  }
                )
              }
            }
          );
          break;
      }
    });
  }

  public beforeDestroy() {
    //@ts-ignore
    this.$eventHub.$off('eventFromChildComponentToPendingGrid');
  }
}
