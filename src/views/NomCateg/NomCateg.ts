import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import iNomCateg from '@/types/iNomCateg';
import LoadingComponent from '@/components/LoadingComponent.vue';
import ErrorComponent from '@/components/ErrorComponent.vue';
import {ServicesNomCateg} from '@/modules/ServicesNomCateg';
const EditNomCateg = import('@/components/EditNomCateg/EditNomCateg.vue');
import nomenclatoare from '@/store/nomenclatoare';
import {getModule} from 'vuex-module-decorators';
import iNomTipDoc from '@/types/iNomTipDoc';
import {ServicesNomTipDoc} from '@/modules/ServicesNomTipDoc';

//const EditNomCateg = () => import('@/components/EditNomCateg/EditNomCateg.vue').then(m => m.default)

// @ts-ignore
@Component({components: {
    EditNomCateg: () => ({
      component: EditNomCateg,
      loading: LoadingComponent,
      error: ErrorComponent,
      timeout: 3000
    })
}
})
export default class NomCateg extends Vue {
  public filter: string = '';
  public appidCategorie: number = 0;
  public loadingData: boolean = false;
  public visibleDialogEditCateg: boolean = false;
  public myPagination:any={
    rowsPerPage:10
  }
  public visibleColumns: string[] = [ 'id_categ', 'den_lang_1', 'activ'];
  public  columns: any = [
    { name: 'appid', label: 'appid', field: 'appid' },
    { name: 'id_categ', label: 'Id', field: 'id_categ', align: 'left', sortable: true, sort: (a: string, b: string) => parseInt(a, 10) - parseInt(b, 10) },
    { name: 'den_lang_1', label: 'Denumire', field: 'den_lang_1', align: 'left', sortable: true },
    { name: 'den_lang_2', label: 'Denumire maghiara', field: 'den_lang_2', align: 'left', sortable: true },
    { name: 'track_user', label: 'track_user', field: 'track_user' },
    { name: 'activ', label: 'Activ', field: 'appid' }
    ];
  public tableDataNomCateg: iNomCateg[] = [];
  public $refs: any;
  public storeNomenclatoare = getModule(nomenclatoare);
  // private userStore=getModule(User);

  constructor() {
    super();
  }

  public addRow() {
    this.appidCategorie = 0;
    this.visibleDialogEditCateg = true;
  }
  public goToView(pRouteViewName: string ) {
    this.$router.push({ name: pRouteViewName })
  }
  public renuntEditareCateg() {
    this.visibleDialogEditCateg = false;
  }

  public changeStatus(pCateg:iNomCateg){
    const vueInst = this;
    ServicesNomCateg.putNewStatusNomTipDoc(pCateg.appid,pCateg.activ).then(
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

  public askIfDeleteThis(params: iNomCateg) {
    const vueInst = this;
    this.$q.dialog({
      title: 'Confirmare',
      message: 'Stergere '+params.den_lang_1,
      cancel: true,
      persistent: true
    }).onOk(() => {
      ServicesNomCateg.deleteNomCateg(params.appid).then(presponse=>{
        if(presponse.status==='success'){
          ServicesNomCateg.updateStoreNomCategFromDB();
          vueInst.refreshDataTableNomCateg();
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

  public refreshDataTableNomCateg(){
    const vueInst = this;
    vueInst.visibleDialogEditCateg=false;
    ServicesNomCateg.getNomCateg().then((presponse)=>{
      vueInst.loadingData=false;
      if (presponse.status === 'success'){
        vueInst.tableDataNomCateg=JSON.parse(presponse.rows);
      }
    })
  }

  public created() {
    const vueInst = this;
    vueInst.loadingData=true;
    vueInst.refreshDataTableNomCateg();
    vueInst.storeNomenclatoare.set_currentpagetitle('Nomenclator Categorii Documente');
  }
}
