import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import iNomRegistru from '@/types/iNomRegistru';
import LoadingComponent from '@/components/LoadingComponent.vue';
import ErrorComponent from '@/components/ErrorComponent.vue';
import {ServicesRegistre} from '@/modules/ServicesRegistre';
const EditNomRegistru = import('@/components/EditNomRegistru/EditNomRegistru.vue');
import nomenclatoare from '@/store/nomenclatoare';
import {getModule} from 'vuex-module-decorators';
import {ServicesNomCateg} from '@/modules/ServicesNomCateg';
//const EditNomRegistru = () => import('@/components/EditNomRegistru/EditNomRegistru.vue').then(m => m.default)

// @ts-ignore
@Component({components: {
    EditNomRegistru: () => ({
      component: EditNomRegistru,
      loading: LoadingComponent,
      error: ErrorComponent,
      timeout: 3000
    })
  }
})
export default class NomRegistre extends Vue {
  public filter: string = '';
  public appidRegistru: number = 0;
  public loadingData: boolean = false;
  public visibleDialogEditRegistru: boolean = false;
  public myPagination:any={
    rowsPerPage:10
  }
  public visibleColumns: string[] = [ 'id_registru', 'an_permis_pt_inreg','nr_de_start',  'den_registru_lang_1', 'activ'];
  public  columns: any = [
    { name: 'appid', label: 'appid', field: 'appid' },
    { name: 'id_registru', label: 'id_registru', field: 'id_registru', align: 'left', sortable: true },
    { name: 'an_permis_pt_inreg', label: 'Anul', field: 'an_permis_pt_inreg', align: 'left', sortable: true },
    { name: 'nr_de_start', label: 'Nr.de start', field: 'nr_de_start', align: 'left', sortable: true },
    { name: 'den_registru_lang_1', label: 'Denumire registru', field: 'den_registru_lang_1', align: 'left', sortable: true },
    { name: 'den_registru_lang_2', label: 'Denumire maghiara', field: 'den_registru_lang_2', align: 'left', sortable: true },
    { name: 'activ', label: 'Activ', field: 'appid' }
  ];
  public tableDataNomRegistre: iNomRegistru[] = [];
  public $refs: any;
  public storeNomenclatoare = getModule(nomenclatoare);

  constructor() {
    super();
  }
  public addRow() {
    this.appidRegistru = 0;
    this.visibleDialogEditRegistru = true;
  }
  public renuntEditareRegistru() {
    this.visibleDialogEditRegistru = false;
  }
  public askIfDeleteThis(params: iNomRegistru) {
    const vueInst = this;
    this.$q.dialog({
      title: 'Confirmare',
      message: 'Stergere '+params.den_registru_lang_1,
      cancel: true,
      persistent: true
    }).onOk(() => {
      ServicesRegistre.deleteNomRegistru(params.appid).then(presponse=>{
        if(presponse.status==='success'){
          ServicesRegistre.updateStoreNomRegistreFromDB();
          vueInst.refreshDataTableNomRegistre();
          vueInst.$q.notify({
            color: 'green-4',
            textColor: 'white',
            type: 'positive',
            message: presponse.message,
            position: 'top',
            timeout: 1000,
          });
        }
      })
    });
  }

  public refreshDataTableNomRegistre(){
    const vueInst = this;
    vueInst.visibleDialogEditRegistru=false;
    ServicesRegistre.getNomRegistre().then((presponse)=>{
      vueInst.loadingData=false;
      if (presponse.status === 'success'){
        vueInst.tableDataNomRegistre=JSON.parse(JSON.stringify(presponse.rows));
      }
    })
  }

  public changeStatus(pRegistru:iNomRegistru){
    const vueInst = this;
    ServicesRegistre.putNewStatusNomTipDoc(pRegistru.appid,pRegistru.activ).then(
      presponse=>{
        if(presponse.status=='success'){
          vueInst.$q.notify({
            color: 'green-4',
            textColor: 'white',
            type: 'positive',
            message: presponse.message,
            position: 'top',
            timeout: 1000,
          });
        }
      }
    );
  }

  public created() {
    const vueInst = this;
    vueInst.loadingData=true;
    vueInst.refreshDataTableNomRegistre();
    vueInst.storeNomenclatoare.set_currentpagetitle('Nomenclator Registre');
  }
}
