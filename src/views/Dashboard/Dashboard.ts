import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import { getModule} from 'vuex-module-decorators';
import nomenclatoare from '@/store/nomenclatoare';
import iDocumentIntrare from '@/types/iDocumentIntrare';
import MyDocuments from '@/components/MyDocuments/MyDocuments.vue';
import WorkDocumentePendingRegistering from '@/components/WorkDocumentePendingRegistering/WorkDocumentePendingRegistering.vue';
import WorkOnDocument from '@/components/WorkOnDocument/WorkOnDocument.vue';
import {ServicesDocument} from '@/modules/ServicesDocument';
type OrNull<T> = { [K in keyof T]: T[K] | null }
type IDocumentIntrare = OrNull<iDocumentIntrare>;

@Component({components: {MyDocuments, WorkDocumentePendingRegistering, WorkOnDocument}})
export default class Dashboard extends Vue {
  public taburi: string='documente_repartizate';
  public nrOfMyDocuments:number=0;
  public nrOfPendingToRegister:number=0;
  public $refs: any;
  public storeNomenclatoare = getModule(nomenclatoare);
  public appidDocToWorkOnIt:number=0;
  public withFinalizeButton:string = 'no';
  // private userStore=getModule(User);

  constructor() {
    super();
  }

  public getNrOfMyDocuments(){
    const vueInst = this;
    ServicesDocument.getNrOfMyDocuments().then(
      presult=>{
        if(presult.status=='success'){
          vueInst.nrOfMyDocuments = presult.nr_of_doc;
        }
      }
    );
  }

  public getNrOfPendingRegistering(){
    const vueInst = this;
    ServicesDocument.getNrOfPendingToRegister().then(
      presult=>{
        if(presult.status=='success'){
          vueInst.nrOfPendingToRegister = presult.nr_of_doc;
        }
      }
    );
  }

  public onEventFromMyDocuments(params:any){
    const vueInst = this;
    //console.log('in Dashboards.ts onEventFromMyDocuments with params=%o',params)
    switch (params.action) {
      case 'updateNrOfMyDocuments' : vueInst.nrOfMyDocuments=params.value;
        break;
      case 'updateNrOfPendingRegistering' : vueInst.nrOfPendingToRegister=params.value;
        break;
    }
  }

  public get widthForDrawerDocument(): number{
    if(this.$q.platform.is.mobile) {return window.innerWidth;}
    else{
      return (window.innerWidth-100);
    }
  }

  public mounted() {
    const vueInst = this;
    vueInst.storeNomenclatoare.set_currentpagetitle('Documente repartizate');
    vueInst.getNrOfPendingRegistering();
  }

  public created(): void {
    const vueInst = this;
    //@ts-ignore
    vueInst.$eventHub.$on('eventFromChildComponentToDashboard', (params: any) => {
      //console.log('in Dashboard.ts FinalizatInregistrareDocument with params=%o', params);
      switch (params.action) {
        case 'FinalizatInregistrareDocument': vueInst.getNrOfMyDocuments();
                                              vueInst.getNrOfPendingRegistering();
                                                  break;
      }
    });
  }

  public beforeDestroy() {
    //@ts-ignore
    this.$eventHub.$off('eventFromChildComponentToDashboard');
  }
}
