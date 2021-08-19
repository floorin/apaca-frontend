import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import {ServicesDocument} from '@/modules/ServicesDocument';
import user from '@/store/user';
import {URL_API} from '@/config';
import {getModule} from 'vuex-module-decorators';
import iUser from '@/types/iUser';

@Component({components: {}})
export default class MenuApp extends Vue {
  @Prop({ default: '0' }) public readonly userid!: string;
  public nrOfMyDocuments:number = 0;
  public nrOfPendingToRegister:number = 0;
  public nrDocumenteDeRepartizate:number = 0;
  public nrAllAllocatedDocs:number = 0;
  public $refs: any;
  public userStore = getModule(user);
  public goToView(pRouteViewName: string ) {
    this.$router.push({ name: pRouteViewName })
  }

  public getNrOfDocumentsForMe():void{
    this.nrDocumenteDeRepartizate = 3;
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

  public getNrOfDocumentsDeRepartizat():void{
    const vueInst=this;
    ServicesDocument.getNrOfDocumentsDeRepartizat().then(presponse=>{
      if(presponse.status=='success'){
        vueInst.nrDocumenteDeRepartizate = presponse.nr_of_doc;
      }
    });
  }

  public get user(): iUser {
    return this.userStore.user;
  }

  public startSSE(){
    const vueInst = this;
    if (!!window.EventSource && Number(vueInst.userStore.user.userid)!=0) {
      const source = new EventSource(`${URL_API}/search/sse`);
      source.onmessage = (event) => {
        const jdata = JSON.parse(event.data);
        vueInst.nrOfMyDocuments = 1*jdata.nr_of_my_doc;
        vueInst.nrOfPendingToRegister = 1*jdata.nr_of_doc_to_finalize;
        vueInst.nrDocumenteDeRepartizate = 1*jdata.nr_of_doc_de_repartizat;
        vueInst.nrAllAllocatedDocs = 1*jdata.nr_of_all_doc_allocated;
      };
    }
  }

  @Watch('userid')
  public onAppidChanged(newVal: string, oldVal: string) {
    const vueInst = this;
    vueInst.startSSE();
  }

  public created(): void {
    const vueInst = this;
    vueInst.startSSE();

    //@ts-ignore
    vueInst.$eventHub.$on('eventDocumentRepartizat', (params: any) => {
     // console.log('in MenuApp.ts eventDocumentRepartizat with params=%o', params);
      switch (params.action) {
        case 'RepartizatDocument': vueInst.getNrOfDocumentsDeRepartizat();
          break;
      }
    });

    //@ts-ignore
    vueInst.$eventHub.$on('eventToMenuApp', (params: any) => {
      // console.log('in MenuApp.ts eventDocumentRepartizat with params=%o', params);
      switch (params.action) {
        case 'InterogheazaNrPendingDocs': vueInst.getNrOfPendingRegistering();
          break;
      }
    });
  }


}
