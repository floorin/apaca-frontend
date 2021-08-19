import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import iNomCateg from '@/types/iNomCateg';
import iNomTipDoc from '@/types/iNomTipDoc';
import LoadingComponent from '@/components/LoadingComponent.vue';
import ErrorComponent from '@/components/ErrorComponent.vue';
import {ServicesNomCateg} from '@/modules/ServicesNomCateg';
import {ServicesNomTipDoc} from '@/modules/ServicesNomTipDoc';
const EditNomTipDoc = import('@/components/EditNomTipDoc/EditNomTipDoc.vue');
import nomenclatoare from '@/store/nomenclatoare';
import {getModule} from 'vuex-module-decorators';
//const EditNomCateg = () => import('@/components/EditNomCateg/EditNomCateg.vue').then(m => m.default)

interface iNomTipDocWithDenCateg extends iNomTipDoc{
  den_categ:string
}

// @ts-ignore
@Component({components: {
    EditNomTipDoc: () => ({
      component: EditNomTipDoc,
      loading: LoadingComponent,
      error: ErrorComponent,
      timeout: 3000
    })
  }
})
export default class NomTipDoc extends Vue {
  public filter: string = '';
  public appidTipDoc: number = 0;
  public loadingData: boolean = false;
  public visibleDialogEditTipDoc: boolean = false;
  public myPagination:any={
    rowsPerPage:10
  }
  public visibleColumns: string[] = [ 'id_tip_doc', 'den_lang_1', 'den_categ', 'activ'];
  public  columns: any = [
    { name: 'appid', label: 'appid', field: 'appid' },
    { name: 'id_tip_doc', label: 'Id', field: 'id_tip_doc', align: 'left', sortable: true },
    { name: 'den_lang_1', label: 'Denumire', field: 'den_lang_1', sortable: true, align: 'left' },
    { name: 'den_lang_2', label: 'Denumire maghiara', field: 'den_lang_2', sortable: true, align: 'left' },
    { name: 'den_categ', label: 'Categorie', field: 'den_categ', sortable: true, align: 'left' },
    { name: 'activ', label: 'Activ', field: 'appid' }
  ];
  public tableDataNomCateg: iNomCateg[] = [];
  public tableDataNomTipDoc: iNomTipDocWithDenCateg[] = [];
  public $refs: any;
  public storeNomenclatoare = getModule(nomenclatoare);
  // private userStore=getModule(User);

  constructor() {
    super();
  }

  public addRow() {
    this.appidTipDoc = 0;
    this.visibleDialogEditTipDoc = true;
  }
  public goToView(pRouteViewName: string ) {
    this.$router.push({ name: pRouteViewName })
  }
  public renuntEditareTipDoc() {
    this.visibleDialogEditTipDoc = false;
  }

  public askIfDeleteThis(params: iNomCateg) {
    const vueInst = this;
    this.$q.dialog({
      title: 'Confirmare',
      message: 'Stergere '+params.den_lang_1,
      cancel: true,
      persistent: true
    }).onOk(() => {
      ServicesNomTipDoc.deleteNomTipDoc(params.appid).then(presponse=>{
        if(presponse.status==='success'){
          ServicesNomTipDoc.updateStoreNomTipDocsFromDB();
          vueInst.refreshDataTableNomTipDoc();
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

  public changeStatus(pTipDoc:iNomTipDoc){
    const vueInst = this;
    ServicesNomTipDoc.putNewStatusNomTipDoc(pTipDoc.appid,pTipDoc.activ).then(
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

  public changeConfidentality(pTipDoc:iNomTipDoc){
    const vueInst = this;
    ServicesNomTipDoc.putNewStatusConfidentalityNomTipDoc(pTipDoc.appid,pTipDoc.is_confidential).then(
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

  public refreshDataTableNomTipDoc(){
    const vueInst = this;
    vueInst.visibleDialogEditTipDoc=false;
    ServicesNomCateg.getNomCateg().then((presponse)=>{
      vueInst.loadingData=false;
      if (presponse.status === 'success'){
        vueInst.tableDataNomCateg=JSON.parse(presponse.rows);
        ServicesNomTipDoc.getNomTipDoc().then((presponse2)=>{
          vueInst.loadingData=false;
          if (presponse2.status === 'success'){
            vueInst.tableDataNomTipDoc=JSON.parse(presponse2.rows).map((pTipDoc:iNomTipDoc)=>{
              const tmpCateg=vueInst.tableDataNomCateg.find(pcateg=>{
                return pcateg.id_categ == pTipDoc.id_categ
              });
              return{
                appid: pTipDoc.appid,
                id_tip_doc: pTipDoc.id_tip_doc,
                id_categ: pTipDoc.id_categ,
                den_lang_1: pTipDoc.den_lang_1,
                den_lang_2: pTipDoc.den_lang_2,
                track_user: pTipDoc.track_user,
                track_date: pTipDoc.track_date,
                den_categ:(tmpCateg? tmpCateg.den_lang_1:''),
                activ: pTipDoc.activ,
                is_confidential: pTipDoc.is_confidential
              }
            });
          }
        })
      }
    })
  }

  public created() {
    const vueInst = this;
    vueInst.loadingData=true;
    vueInst.refreshDataTableNomTipDoc();
    vueInst.storeNomenclatoare.set_currentpagetitle('Nomenclator Tipuri Documente');
  }
}
