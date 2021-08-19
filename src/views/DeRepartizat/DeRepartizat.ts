import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import { getModule} from 'vuex-module-decorators';
import moment from 'moment';
import {CONFIG_ENV} from '@/config';
import DialogOpenScan from '@/components/DialogOpenScan/DialogOpenScan.vue';
import nomenclatoare from '@/store/nomenclatoare';
import iDocument from '@/types/iDocument';
import user from '@/store/user';
import iScan from '@/types/iScan';
import {dateToStringDDMonYYYY} from '@/modules/utils';
import {humanReadableBytes} from '@/modules/utils';
import {ServicesDocument} from '@/modules/ServicesDocument';
type OrNull<T> = { [K in keyof T]: T[K] | null }
type IDocument = OrNull<iDocument>;

interface IDocumentComplet extends IDocument{
  den_registru:string
}

@Component({components: {DialogOpenScan}})
export default class DeRepartizat extends Vue {
  public taburi: string='documente_repartizate';
  public filter: string = '';
  public $refs: any;
  public loadingData: boolean = false;
  public tableDataDeRepartizatDocuments: IDocumentComplet[] = [];
  public storeNomenclatoare = getModule(nomenclatoare);
  public userStore=getModule(user);
  public myPagination:any={
    rowsPerPage:10
  }
  public visibleColumns: string[] = ['appid', 'nr_inreg', 'data_doc', 'den_registru', 'id_tip_document', 'tip_request', 'nume_denumire','scans'];
  public  columns: any = [
    { name: 'appid', label: '', field: 'appid', align: 'right',  classes: 'bg-grey-1', style: 'max-width: 30px',headerStyle: 'max-width: 30px' },
    { name: 'nr_inreg', label: 'Numar', field: 'nr_inreg', align: 'center', sortable: true, sort: (a: string, b: string) => parseInt(a, 10) - parseInt(b, 10) , style: 'max-width: 40px',headerStyle: 'max-width: 40px',classes: 'bg-grey-1'},
    { name: 'data_doc', label: '/  Data document', field: 'data_doc', align: 'left', classes: 'bg-grey-1', sortable: true , style: 'max-width: 90px',headerStyle: 'max-width: 90px'},
    { name: 'den_registru', label: 'Registru', field: 'den_registru', align: 'left', sortable: true },
    { name: 'id_tip_document', label: 'Tip document', field: 'id_tip_document', align: 'left', sortable: true },
    { name: 'tip_request', label: 'Tip corespondenta', field: 'tip_request', align: 'left', sortable: true },
    { name: 'nume_denumire', label: 'Denumire solicitant', field: 'nume_denumire', align: 'left', sortable: true },
    { name: 'scans', label: 'Documente atasate', field: 'scans', align: 'left' }
  ];

  constructor() {
    super();
  }

  public askIfDeleteThis(pdocument: iDocument){
    this.$q.notify({
      color: 'red',
      textColor: 'white',
      type: 'negative',
      message: 'se va deschide dialog pentru actiuni',
      position: 'top',
      timeout: 3500,
    });
  }

  public openWorkOnDocument(pdocument: iDocument){
    const vueInst = this;
    // @ts-ignore
    vueInst.$eventHub.$emit('eventToOpenDocument', {action:'openDocument',appid:pdocument.appid,with_finalize_register_document:'no', with_repartizare_buton:'yes'})
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

  public openPreviewForm(pappid: number){
    const vueInst = this;
    //@ts-ignore;
    vueInst.$eventHub.$emit('eventFromChildComponent',{action:'show_preview_file',scan_appid:pappid});
  }

  public getMyDocuments(){
    const vueInst = this;
    vueInst.tableDataDeRepartizatDocuments=[];
    // @ts-ignore
    vueInst.$eventHub.$emit('eventToMenuApp', {action:'InterogheazaNrDocumenteDeRepartizat'});
    ServicesDocument.getDocumentsDeRepartizat().then(presponse =>{
      vueInst.loadingData=false;
      if(presponse.status == 'success'){
        presponse.rows.forEach(pdocument=>{
          vueInst.tableDataDeRepartizatDocuments.push(
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
              track_creation_date: pdocument.track_creation_date,
              den_registru:vueInst.getDenRegistru(pdocument.id_registru),
              id_org_destinatar_init: null,
              id_org_destinatar_curent: null,
              scans:pdocument.scans,
              repartizari:[]
            }
          )
        });
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

  public deleteDocumentFromGrid(pappid: number){
    const vueInst = this;
    const pindexToBeDeleted=vueInst.tableDataDeRepartizatDocuments.findIndex(pdocument=> pdocument.appid==pappid);
    vueInst.tableDataDeRepartizatDocuments.splice(pindexToBeDeleted,1);
  }

  public mounted() {
    this.loadingData=true;
    this.storeNomenclatoare.set_currentpagetitle('Repartizare Documente');
    this.getMyDocuments();
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
    vueInst.$eventHub.$on('eventDocumentRepartizat', (params: any) => {
      //console.log('in DeRepartizat.ts eventDocumentRepartizat with params=%o', params);
      switch (params.action) {
        case 'RepartizatDocument': vueInst.deleteDocumentFromGrid(params.appid);
                  break;
      }
    });
  }

  public beforeDestroy() {
    //@ts-ignore
    this.$eventHub.$off('eventDocumentRepartizat');
  }
}
