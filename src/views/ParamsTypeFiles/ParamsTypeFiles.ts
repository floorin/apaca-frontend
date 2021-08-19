import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import LoadingComponent from '@/components/LoadingComponent.vue';
import ErrorComponent from '@/components/ErrorComponent.vue';
import {ServicesNomAllowedFiletypes} from '@/modules/ServicesNomAllowedFiletypes';
const EditNomAllowedFiletypes = import('@/components/EditNomAllowedFiletypes/EditNomAllowedFiletypes.vue');
import nomenclatoare from '@/store/nomenclatoare';
import {getModule} from 'vuex-module-decorators';
import iNomAllowedFiletypes from '@/types/iNomAllowedFiletypes';

//const EditNomCateg = () => import('@/components/EditNomCateg/EditNomCateg.vue').then(m => m.default)

// @ts-ignore
@Component({components: {
    EditNomAllowedFiletypes: () => ({
      component: EditNomAllowedFiletypes,
      loading: LoadingComponent,
      error: ErrorComponent,
      timeout: 3000
    })
  }
})
export default class ParamsTypeFiles extends Vue {
  public filter: string = '';
  public appidNomAllowedFiletypes: number = 0;
  public loadingData: boolean = false;
  public visibleDialogNomAllowedFiletype: boolean = false;
  public myPagination:any={
    rowsPerPage:10
  }
  public visibleColumns: string[] = [ 'appid', 'file_extension', 'file_max_size'];
  public  columns: any = [
    { name: 'appid', label: '', field: 'appid' },
    { name: 'file_extension', label: 'Extensie fisier', field: 'file_extension', align: 'left', sortable: true },
    { name: 'file_max_size', label: 'Dimensiune maxima (Mb)', field: 'file_max_size', align: 'left', sortable: true },
  ];
  public tableDataNomAllowedFiletypes: iNomAllowedFiletypes[] = [];
  public $refs: any;
  public storeNomenclatoare = getModule(nomenclatoare);
  // private userStore=getModule(User);

  constructor() {
    super();
  }

  public addRow() {
    this.appidNomAllowedFiletypes = 0;
    this.visibleDialogNomAllowedFiletype = true;
  }

  public renuntEditareNomAllowedFiletypes() {
    this.visibleDialogNomAllowedFiletype = false;
  }

  public tryUpdateSize(pFileType:iNomAllowedFiletypes,pfunction:any){
    const vueInst=this;
    console.log('tryUpdateSize pFileType=%o',pFileType)
    if(pFileType.appid && pFileType.file_extension.length>0){
      ServicesNomAllowedFiletypes.postNomAllowedFiletypes(pFileType.appid,pFileType.file_extension,pFileType.file_max_size).then(presponse=>{
        if(presponse.status=='success'){
          vueInst.$q.notify({
            color: 'teal',
            textColor: 'white',
            type: 'positive',
            message: presponse.message,
            position: 'top',
            timeout: 1000,
          });
          pfunction();
        }
      })
    }
  }

  public askIfDeleteThis(params: iNomAllowedFiletypes) {
    const vueInst = this;
    this.$q.dialog({
      title: 'Confirmare',
      message: 'Stergere extensie '+params.file_extension,
      cancel: true,
      persistent: true
    }).onOk(() => {
      ServicesNomAllowedFiletypes.deleteNomAllowedFiletypes(params.appid).then(presponse=>{
        if(presponse.status==='success'){
          vueInst.$q.notify({
            color: 'green-4',
            textColor: 'white',
            type: 'positive',
            message: presponse.message,
            position: 'top',
            timeout: 1000,
          });
          vueInst.tableDataNomAllowedFiletypes.find((fileTpe,pindex)=>{if(fileTpe.appid==params.appid){vueInst.tableDataNomAllowedFiletypes.splice(pindex,1)}})
        }
      })
    });
  }

  public refreshDataTableNomAllowedFiletypes(){
    const vueInst = this;
    vueInst.visibleDialogNomAllowedFiletype=false;
    ServicesNomAllowedFiletypes.getNomAllowedFiletypes().then((presponse)=>{
      vueInst.loadingData=false;
      if (presponse.status === 'success'){
        vueInst.tableDataNomAllowedFiletypes = JSON.parse(JSON.stringify(presponse.rows));
      }
    })
  }

  public created() {
    const vueInst = this;
    vueInst.loadingData=true;
    vueInst.refreshDataTableNomAllowedFiletypes();
    vueInst.storeNomenclatoare.set_currentpagetitle('Parametri Atasamente');
  }
}
